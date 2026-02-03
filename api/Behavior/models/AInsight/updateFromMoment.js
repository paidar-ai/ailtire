const path = require('path');

module.exports = {
    friendlyName: 'updateFromMoment',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    "moment": {
        "type": "AMoment",
        "description": "The moment to be used for updating Insights",
        "required": false
    }
},
    outputs: {
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        let { moment } = inputs;
        // obj has the obj for the method.

        if (!moment || !moment.analysis) return obj;

        const DOT_PATH_RE = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/;

        const isValidDotPath = (s) => typeof s === "string" && DOT_PATH_RE.test(s);

        const clamp01 = (n) => {
            if (typeof n !== "number" || Number.isNaN(n)) return 0;
            return Math.max(0, Math.min(1, n));
        };

        const nowIso = () => new Date().toISOString();

        const normalizeOperation = (op) => {
            const allowed = new Set(["create", "reinforce", "update", "supersede", "resolve"]);
            return allowed.has(op) ? op : "";
        };

        const normalizeInsightType = (t) => {
            const allowed = new Set(["preference", "constraint", "decision", "project_state", "glossary", "todo", "risk"]);
            return allowed.has(t) ? t : "";
        };

        const normalizePersistence = (p) => {
            const allowed = new Set(["ephemeral", "session", "project", "user"]);
            return allowed.has(p) ? p : "session";
        };

        const computeScopeKey = (m) => {
            // Prefer project scope, then workspace, then user. Fall back to a safe default.
            const scope = m.scope || m.contextScope || {};
            const projectId = scope.projectId || m.projectId || "";
            const workspaceId = scope.workspaceId || m.workspaceId || "";
            const userId = scope.userId || m.userId || "";

            if (projectId) return `project:${projectId}`;
            if (workspaceId) return `workspace:${workspaceId}`;
            if (userId) return `user:${userId}`;
            return "global:default";
        };

        const sanitizeCandidate = (raw) => {
            const insightType = normalizeInsightType(raw?.insight_type);
            const operation = normalizeOperation(raw?.operation);

            const subjectKey = (raw?.subject_key || "").trim();
            const valueKey = (raw?.value_key || "").trim();

            if (!insightType) return null;
            if (!operation) return null;
            if (!isValidDotPath(subjectKey)) return null;
            if (valueKey && !isValidDotPath(valueKey)) return null;

            const confidence = clamp01(raw?.confidence);
            const priority = Number.isFinite(raw?.priority) ? Math.max(1, Math.min(5, raw.priority)) : 3;
            const persistence = normalizePersistence(raw?.persistence);

            const statement = typeof raw?.statement === "string" ? raw.statement.trim() : "";
            const rationale = typeof raw?.rationale === "string" ? raw.rationale.trim() : "";

            const evidence = raw?.evidence || {};
            const quote = typeof evidence.quote === "string" ? evidence.quote.trim() : "";
            const source = typeof evidence.source === "string" ? evidence.source.trim() : "";

            // For create/update/supersede/resolve, a statement helps future injection.
            // For reinforce, we allow empty statement (it just bumps confidence).
            if (operation !== "reinforce" && !statement) return null;

            return {
                insightType,
                operation,
                subjectKey,
                valueKey,
                confidence,
                priority,
                persistence,
                statement,
                rationale,
                evidence: { source, quote }
            };
        };

        const scopeKey = computeScopeKey(moment);
        const momentId = moment.id || moment.momentId || "";
        const momentTsIso =
            moment.ts ? new Date(moment.ts).toISOString()
                : moment.timestamp ? new Date(moment.timestamp).toISOString()
                    : nowIso();

        const candidates = Array.isArray(moment.analysis.candidate_insights)
            ? moment.analysis.candidate_insights.slice(0, 15) // guardrail
            : [];

        const sanitizedCandidates = candidates.map(sanitizeCandidate).filter(Boolean);
        let existing = null;
        for (const c of sanitizedCandidates) {
            // Deterministic match: one active insight per (scopeKey, insightType, subjectKey)
            existing = await AInsight.findOne({
                scopeKey,
                insightType: c.insightType,
                subjectKey: c.subjectKey,
                status: "active"
            });

            const sourceEntry = { momentId, ts: momentTsIso };
            const timestamp = nowIso();

            if (existing && c.operation === "supersede") {
                existing.status = "superseded";
                existing.lastEvidence = c.evidence;
                existing.sources = [...(existing.sources || []), sourceEntry];
                existing.lastUpdated = timestamp;
                existing.updatedAt = timestamp;
                continue;
            }

            if (existing && c.operation === "resolve") {
                existing.status = "resolved";
                existing.lastEvidence = c.evidence;
                existing.sources = [...(existing.sources || []), sourceEntry];
                existing.lastUpdated = timestamp;
                existing.updatedAt = timestamp;
                continue;
            }
            existing.scopeKey = scopeKey;
            existing.insightType = c.insightType;
            existing.subjectKey = c.subjectKey;
            existing.valueKey = c.valueKey;
            existing.statement = c.statement;
            existing.rationale = c.rationale;
            existing.confidence = c.confidence;
            existing.priority = c.priority;
            existing.persistence = c.persistence;
            existing.sources = [...(existing.sources || []), sourceEntry];
            existing.lastUpdated = timestamp;
            existing.updatedAt = timestamp;
            existing.status = "active";
            existing.lastEvidence = c.evidence;
            existing.sources = [...(existing.sources || []), sourceEntry];

            /*
            // Update or reinforce existing
            const nextConfidence =
                c.operation === "reinforce"
                    ? clamp01(Math.max(existing.confidence || 0, c.confidence))
                    : clamp01(c.confidence || existing.confidence || 0);

            const patch = {
                confidence: nextConfidence,
                priority: Math.max(existing.priority || 1, c.priority || 1),
                persistence: existing.persistence || c.persistence,
                lastEvidence: c.evidence,
                sources: [...(existing.sources || []), sourceEntry],
                lastUpdated: timestamp,
                updatedAt: timestamp
            };

            // Only rewrite statement/value/rationale on create/update (not reinforce)
            if (c.operation !== "reinforce") {
                patch.statement = c.statement || existing.statement;
                patch.rationale = c.rationale || existing.rationale || "";
                if (c.valueKey) patch.valueKey = c.valueKey;
            }
             */
        }
        if(existing) {
            existing.save();
        }
        return existing;
    }
};

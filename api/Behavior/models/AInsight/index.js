class AInsight {
    static definition = {
        name: 'AInsight',
        description: 'Adaptive, feedback-weighted learning for a User-as-Actor “over time”.',
        attributes: {
            // --- Deterministic matching / identity ---
            scopeKey: { type: 'string', description: 'Scope for deterministic upsert (e.g., project:<id>, user:<id>).' },
            insightType: { type: 'string', description: 'preference | constraint | decision | project_state | glossary | todo | risk.' },
            subjectKey: { type: 'string', description: 'Dot-path canonical subject key (e.g., auth.token_storage, db.engine).' },
            valueKey: { type: 'string', description: 'Optional dot-path canonical value key (e.g., auth.storage.http_only_cookie).' },

            // --- Injection payload ---
            statement: { type: 'string', description: 'Concise, inject-able statement representing the current truth.' },
            rationale: { type: 'string', description: 'Optional short rationale (1–2 lines max).' },
            priority: { type: 'number', description: '1..5 injection importance (5 = almost always include).' },

            // --- Lifecycle / state ---
            status: { type: 'string', description: 'active | superseded | resolved | expired.' },
            createdAt: { type: 'string', description: 'ISO-8601 timestamp of creation.' },
            updatedAt: { type: 'string', description: 'ISO-8601 timestamp of last update.' },

            // --- Confidence & provenance ---
            confidence: { type: 'number', description: '0..1 confidence that this insight currently holds.' },
            sources: { type: 'json', description: 'Array of provenance entries: [{ momentId, ts }].' },
            lastEvidence: { type: 'json', description: 'Last evidence excerpt: { source: user|assistant, quote }.' },
            tags: { type: 'json', description: 'Optional string tags for retrieval/ranking.' },

            // --- Backward compatibility ---
            lastUpdated: { type: 'string', description: 'ISO-8601 timestamp of last update (legacy).' }
        },
        associations: {
            user: { type: 'AIdentity', description: 'Owner user.', cardinality: 1, composition: false, owner: false, via: 'insights' },
            actor: { type: 'AActor', description: 'Role context for this learning.', cardinality: 1, composition: false, owner: false }
        },
        // State machine implements unlearning/decay and counter-signal handling
        statenet: {
            Init: {
                description: 'Initial state.',
                events: {
                    create: { Proposed: {} }
                }
            },
            Proposed: {
                description: 'New or weakly evidenced insight.',
                events: {
                    reinforce: {
                        Active: {
                            condition: (obj) => obj.confidence >= 0.60
                        }
                    },
                    decay: { Proposed: { action: (obj) => {/* adjust confidence down */} } }
                }
            },
            Active: {
                description: 'Supported by recent evidence; applied unless vetoed.',
                events: {
                    contest: { Contested: { condition: (obj) => obj.negativeBurst === true } },
                    decay:   { Dormant:   { condition: (obj) => obj.confidence < 0.45 } }
                }
            },
            Contested: {
                description: 'Recent strong counter-evidence; do not auto-apply.',
                events: {
                    reinforce: { Active: { condition: (obj) => obj.reinforced === true } },
                    decay:     { Dormant: { condition: (obj) => obj.confidence < 0.45 } }
                }
            },
            Dormant: {
                description: 'Low confidence; ignored unless strengthened.',
                events: {
                    decay:   { Retired: { condition: (obj) => obj.confidence < 0.15 } },
                    refresh: { Proposed: { condition: (obj) => obj.newEvidence === true } }
                }
            },
            Retired: {
                description: 'Superseded or explicitly forgotten.',
                events: {
                    refresh: { Proposed: { condition: (obj) => obj.newEvidence === true } }
                }
            }
        }
    }
}
module.exports = AInsight;

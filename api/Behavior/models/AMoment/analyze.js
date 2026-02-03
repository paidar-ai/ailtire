const AIHelper = require("../../../../src/Server/AIHelper");

module.exports = {
    friendlyName: 'analyze',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        "retval": {
            "type": "AMoment",
            "description": "The Moment after it has been analyzed",
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        // I need to use the AIHelper to do the analysis but I need it to skip
        // the context parts.
        let messages = [{
            role: "system",
            content: `You are a moment-analysis engine for a GenAI system.

            Your job is to analyze a single interaction (user prompt + assistant response)
        and extract structured signals about what the interaction meant.

            This analysis is NOT memory and NOT user identity.
            It is short-lived feature extraction used to build higher-level insights.

            Rules:
        - Analyze only this interaction.
        - Do NOT speculate beyond the text.
        - Be conservative; if unsure, leave fields empty.
        - Do NOT include explanations or commentary.
        - Output ONLY valid JSON matching the schema.
            `
        },
            {
                role: "user",
                content: `Analyze the following GenAI interaction and produce a Moment Analysis.

User message:
"""
${obj.context}
"""

Assistant response:
"""
${obj.outcome}
"""

Return a JSON object with the following fields:

{
  "intent": "",                 // snake_case (free text ok): what the user was trying to accomplish
  "topic": "",                  // snake_case (free text ok): main subject
  "role_signal": "",            // snake_case: implied user role (e.g., "architect", "teacher") or ""
  "preference_signals": [],     // array of snake_case short strings
  "constraint_signals": [],     // array of snake_case short strings
  "outcome": "",                // valid: "satisfied" | "needs_clarification" | "misaligned"
  "correction": false,          // valid: true | false
  "signal": "",                 // valid: "curiosity" | "confusion" | "confirmation" | "urgency" | ""

  "candidate_insights": [
    {
      "insight_type": "",        // valid: "preference" | "constraint" | "decision" | "project_state" | "glossary" | "todo" | "risk"
      "subject_key": "",         // dot-path key: /^[a-z][a-z0-9_]*(\\\\.[a-z0-9_]+)*$/  (e.g., "auth.token_storage", "db.engine")
      "value_key": "",           // optional dot-path key (same format) or "" (e.g., "auth.storage.http_only_cookie")
      "operation": "",           // valid: "create" | "reinforce" | "update" | "supersede" | "resolve"
      "confidence": 0.0,         // valid range: 0.0..1.0
      "priority": 1,             // valid range: 1..5 (5 = highest importance for injection)
      "persistence": "",         // valid: "ephemeral" | "session" | "project" | "user"
      "evidence": {
        "source": "",            // valid: "user" | "assistant" | ""
        "quote": ""              // short exact excerpt supporting the candidate (one sentence/clause)
      },
      "statement": "",           // inject-able sentence; required for create/update/supersede/resolve; optional for reinforce
      "rationale": ""            // optional: 1–2 short lines max
    }
  ]
}

Conventions:
- Use snake_case for: intent, topic, role_signal, preference_signals, constraint_signals, outcome, signal, insight_type, operation, persistence, evidence.source.
- Use DOT-PATH keys for: subject_key and value_key (e.g. "auth.token_storage", "response.verbosity", "db.engine").
  - Allowed characters: a-z, 0-9, underscore, dot
  - Must start with a letter
  - No spaces, hyphens, "..", or trailing dots
- If you cannot confidently produce a valid subject_key, do NOT emit that candidate.
- candidate_insights can be an empty array or contain multiple items (0..N).
- evidence.quote must be a short exact excerpt (one sentence or clause) from the user or assistant.

Important:
- Leave arrays empty if no signals are present.
- Leave strings empty if unclear.
- Do NOT invent preferences or constraints.
`
            }
        ];

        let results = await AIHelper.ask(messages, null, { noContext: true });

        // Be defensive: if the model returns non-JSON, this will throw (good: you’ll notice).
        obj.analysis = JSON.parse(results.response);

        obj.save();
        await AInsight.updateFromMoment({moment: obj});
        return obj;
    }
};

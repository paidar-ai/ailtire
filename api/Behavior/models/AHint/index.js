class AHint {
    static definition = {
        name: 'AHint',
        description: 'A single guided prompt (“hint”) with applicability rules and ranking.',
        attributes: {
            id: {
                type: 'string',
                description: 'Unique hint identifier (GUID or composite key).',
                required: true
            },
            key: {
                type: 'string',
                description: 'Machine-friendly alias (e.g. "admin.promptRoleName").',
                required: true
            },
            type: {
                type: 'string',
                description: 'Kind of hint: "open" | "slot" | "choice" | "confirm" | "feedback".',
                required: true
            },
            template: {
                type: 'string',
                description: 'Text template, with placeholders (e.g. "Enter the {field}").',
                required: true
            },
            params: {
                type: 'json',
                description: 'Parameters for placeholders (e.g. { field: "roleName", options: [...] }).',
                required: false
            },
            when: {
                type: 'json',
                description: 'Applicability filter (JSON-DSL or expression tree) evaluated against runtime context.',
                required: false
            },
            score: {
                type: 'number',
                description: '0..1 ranking for competing hints (higher = stronger match).',
                required: false,
                default: 0.5
            },
            createdAt: {
                type: 'string',
                description: 'ISO-8601 timestamp of hint creation.',
                required: false
            },
            updatedAt: {
                type: 'string',
                description: 'ISO-8601 timestamp of last modification.',
                required: false
            }
        },

        associations: {
            guidance: {
                type: 'AGuidance',
                description: 'Guidance that this hint belongs to.',
                cardinality: 1,
            }
        }
    }
}
module.exports = AHint;

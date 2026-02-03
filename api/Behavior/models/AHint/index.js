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
            prompt: {
                type: 'string',
                description: 'Human-readable instruction for this hint.',
                required: true
            },
            intent: {
                type: 'string',
                description: 'Short, declarative intent label for workflow generation.',
                required: false
            },
            requiresCapabilities: {
                type: 'array',
                description: 'Capabilities needed to fulfill this hint (late-bound to toolbox tools).',
                required: false
            },
            stage: {
                type: 'string',
                description: 'Stage in the guidance workflow (outline, whitepaper, lecture, slides, blog).',
                required: false
            },
            produces: {
                type: 'json',
                description: 'Outputs produced by this hint (type, format, count).',
                required: false
            },
            dependsOn: {
                type: 'array',
                description: 'List of hint ids or stage names this hint depends on.',
                required: false
            },
            humanGate: {
                type: 'boolean',
                description: 'True if this hint requires human approval before proceeding.',
                required: false
            },
            metadata: {
                type: 'json',
                description: 'Extension point for hint-specific metadata.',
                required: false
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

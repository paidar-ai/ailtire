module.exports = {
    friendlyName: 'create',
    description: 'Create a hint and optionally attach it to guidance',
    static: true,
    inputs: {
        id: {
            description: 'Hint identifier',
            type: 'string',
            required: true
        },
        prompt: {
            description: 'Human-readable instruction',
            type: 'string',
            required: false
        },
        intent: {
            description: 'Intent label for workflow generation',
            type: 'string',
            required: false
        },
        requiresCapabilities: {
            description: 'Capabilities needed to fulfill this hint',
            type: 'array',
            required: false
        },
        stage: {
            description: 'Workflow stage for this hint',
            type: 'string',
            required: false
        },
        produces: {
            description: 'Outputs produced by this hint',
            type: 'json',
            required: false
        },
        dependsOn: {
            description: 'Dependencies (hint ids or stages)',
            type: 'array',
            required: false
        },
        metadata: {
            description: 'Hint metadata',
            type: 'json',
            required: false
        },
        humanGate: {
            description: 'Require human approval',
            type: 'boolean',
            required: false
        },
        guidance: {
            description: 'Guidance id to attach this hint',
            type: 'string',
            required: false
        }
    },
    outputs: {
        type: 'AHint',
        description: 'The created hint'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        const hint = new AHint({
            id: inputs.id,
            prompt: inputs.prompt,
            intent: inputs.intent,
            requiresCapabilities: inputs.requiresCapabilities,
            stage: inputs.stage,
            produces: inputs.produces,
            dependsOn: inputs.dependsOn,
            metadata: inputs.metadata,
            humanGate: inputs.humanGate
        });
        if (inputs.guidance) {
            const guidance = AGuidance.find({ id: inputs.guidance });
            if (!guidance) {
                throw new AError.NotFound(`Guidance not found: ${inputs.guidance}`);
            }
            guidance.addToHints(hint);
        }
        return hint;
    }
};

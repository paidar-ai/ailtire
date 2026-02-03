module.exports = {
    friendlyName: 'create',
    description: 'Create guidance',
    static: true,
    inputs: {
        id: {
            description: 'Guidance identifier',
            type: 'string',
            required: false
        },
        title: {
            description: 'Guidance title',
            type: 'string',
            required: false
        },
        goal: {
            description: 'Guidance goal',
            type: 'string',
            required: false
        },
        scope: {
            description: 'Guidance scope or context',
            type: 'json',
            required: false
        },
        deliverables: {
            description: 'Structured deliverables',
            type: 'json',
            required: false
        },
        workflow: {
            description: 'Workflow stages or steps',
            type: 'json',
            required: false
        },
        constraints: {
            description: 'Guidance constraints',
            type: 'json',
            required: false
        },
        assignment: {
            description: 'Guidance assignment',
            type: 'json',
            required: false
        },
        channels: {
            description: 'Notification and response channels',
            type: 'json',
            required: false
        },
        metadata: {
            description: 'Guidance metadata',
            type: 'json',
            required: false
        }
    },
    outputs: {
        type: 'AGuidance',
        description: 'The created guidance'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        return new AGuidance({
            id: inputs.id,
            title: inputs.title,
            goal: inputs.goal,
            scope: inputs.scope,
            deliverables: inputs.deliverables,
            workflow: inputs.workflow,
            constraints: inputs.constraints,
            assignment: inputs.assignment,
            channels: inputs.channels,
            metadata: inputs.metadata
        });
    }
};

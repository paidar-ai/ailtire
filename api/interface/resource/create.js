module.exports = {
    friendlyName: 'create',
    description: 'Create a resource',
    static: true,
    inputs: {
        name: {
            description: 'Resource name',
            type: 'string',
            required: true
        },
        description: {
            description: 'Resource description',
            type: 'string',
            required: false
        },
        type: {
            description: 'Resource type',
            type: 'string',
            required: false
        },
        metadata: {
            description: 'Resource metadata',
            type: 'json',
            required: false
        },
        url: {
            description: 'Resource URL',
            type: 'string',
            required: false
        }
    },
    outputs: {
        type: 'AResource',
        description: 'The created resource'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        return new AResource({
            name: inputs.name,
            description: inputs.description,
            type: inputs.type,
            metadata: inputs.metadata,
            url: inputs.url
        });
    }
};

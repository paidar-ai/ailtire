module.exports = {
    friendlyName: 'create',
    description: 'Create a toolbox',
    static: true,
    inputs: {
        name: {
            description: 'Toolbox name',
            type: 'string',
            required: true
        },
        description: {
            description: 'Toolbox description',
            type: 'string',
            required: false
        }
    },
    outputs: {
        type: 'AToolBox',
        description: 'The created toolbox'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        return new AToolBox({
            name: inputs.name,
            description: inputs.description
        });
    }
};

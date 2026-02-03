module.exports = {
    friendlyName: 'construct',
    description: `Construct a AAttribute object being added to the Class outside of this constructor.`,
    static: true,
    inputs: {
        name: {
            description: 'Name of the application', type: 'string', required: true
        },
        description: {
            description: 'Description of the model', type: 'string', required: false,
        },
        type: {
            description: 'Type of the attribute', type: 'string', required: true
        },
        package: {
            description: 'Package of the model being created.',
            type: "APackage",
            required: false,
        },
        transient: {
            description: 'Is the attribute transient', type: 'boolean', required: false,
        },
    },
    outputs: {
        type: 'AAttribute', description: 'A new AAttribute is created and returned',
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let retval = new AAttribute(inputs);
        return retval;
    }
};
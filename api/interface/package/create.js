module.exports = {
    friendlyName: 'create',
    description: 'Create an package',
    static: true,
    inputs: {
        name: {
            description: 'The name of the package. sub packages created with / as separator',
            type: 'string',
            required: true
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        APackage.construct({name: inputs.name});
        return `Package: ${inputs.name} created`;
    }
};


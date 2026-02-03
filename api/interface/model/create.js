const path = require('path');
module.exports = {
    friendlyName: 'create',
    description: 'Create an model',
    static: true,
    inputs: {
        name: {
            description: 'The name of the model',
            type: 'string',
            required: true
        },
        package: {
            description: 'The name of the package',
            type: 'string',
            required: false
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
        AClass.construct({name: inputs.name, package: inputs.package});
        return `Model: ${inputs.name} created`;
    }
};


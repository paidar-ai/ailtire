const fs = require("fs");
module.exports = {
    friendlyName: 'find',
    description: 'Find an instance of the class',
    static: true,
    inputs: {
        name: {
            description: 'The name of the model',
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
        // Find the scenario from the usecase.
        let cls = global.classes[inputs.name];
        return cls;
    }
};

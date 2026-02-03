const fs = require("fs");
module.exports = {
    friendlyName: 'get',
    description: 'Get a Model',
    static: true,
    inputs: {
        name: {
            description: 'The id of the model',
            type: 'string',
            required: true
        },
    },
    outputs: {
        type: "APackage",
        description: "An APackage is returned that matches the name input."
    },

    exits: {
    },

    fn: function (inputs, env) {
        // Find the scenario from the usecase.
        let cname = inputs.name;
        let package = global.packages[cname]
        if(package) {
            return package;
        } else {
            return null;
        }
    }
};

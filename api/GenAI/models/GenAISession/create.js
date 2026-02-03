const path = require('path');
const GenAISession = require("./index");

module.exports = {
    friendlyName: 'create',
    description: 'Called in the creations of the GenAISession. This should create the model based on the input parameters.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        "retval": {
            "type": "GenAISession",
            "description": "A newly created GenAISession instance.",
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        if (!obj.providerName) {
            obj.providerName = "default";
        }

        let provider = GenAIProvider.find({name: obj.providerName});
        obj.provider = provider;
        await obj.provider.init();
        return obj;
    }
};

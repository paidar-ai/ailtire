const path = require('path');

module.exports = {
    friendlyName: 'init',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "input1": {}
    },
    outputs: {
        "retval": {
            "type": "GenAIProvider",
            "description": "An initialized GenAIProvider instance."
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        await obj._adaptor.init();
        console.log("Adaptor initialized");

    }
};

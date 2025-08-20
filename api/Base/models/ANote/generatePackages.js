const path = require('path');

module.exports = {
    friendlyName: 'generatePackages',
    description: 'Generate package from the notes. Make sure there is not a package that is already valid',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        prompt: {
            type: "string",
            description: "The prompt is added to the current note to generate items from",
            required: false
        },
},
    outputs: {
        "type": "ANote",
        "description": "ANote with the packages attached to it"
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let { input1 } = inputs;
        // obj has the obj for the method.
        return {
        retval: ""
        };
    }
};

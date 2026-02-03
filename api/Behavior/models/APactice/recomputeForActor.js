const path = require('path');

module.exports = {
    friendlyName: 'recomputeForActor',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    "input1": {
        "type": "string",
        "description": "MY Description of the input",
        "required": false
    }
},
    outputs: {
    "retval": {
        "type": "string",
        "description": "My Return Value"
    }
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

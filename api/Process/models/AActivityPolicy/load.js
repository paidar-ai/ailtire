const path = require('path');

module.exports = {
    friendlyName: 'load',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "definition": {
            "type": "json",
            "description": "The Definition of the Policy",
            "required": false
        }
    },
    outputs: {
            "type": "AActivityPolicy",
            "description": "The AActivityPolicy Object based on the definition",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {definition} = inputs;
        // obj has the obj for the method.
        let policy = new AActivityPolicy(definition);
        return policy
    }
};

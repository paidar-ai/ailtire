const path = require('path');
const APolicyRule = require("./index");

module.exports = {
    friendlyName: 'load',
    description: 'Load a single policy rule',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "def": {
            "type": "json",
            "description": "Definition of the rule from a json object",
            "required": false
        }
    },
    outputs: {
        "type": "APolicyRule",
        "description": "The loaded policy rule",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let def = inputs.def;
        let retval = new APolicyRule(def);
        return retval;
    }
};

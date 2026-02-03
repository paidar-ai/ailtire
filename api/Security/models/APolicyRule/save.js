const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
        "type": "string",
        "description": "String representation of the rule",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        let retval = JSON.stringify(obj._attributes, null, 2);
        return retval;
    }
};

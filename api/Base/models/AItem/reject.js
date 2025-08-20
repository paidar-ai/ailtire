const path = require('path');

module.exports = {
    friendlyName: 'reject',
    description: 'Reject the item to be generated',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "text": {
            "type": "string",
            "description": "Why the item was rejected.",
            "required": false
        }
    },
    outputs: {
        "type": "AItem",
        "description": "The AItem is returned in the rejected state.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        let { text } = inputs;
        obj.reason = text || "not specified";
        return obj;
    }
};

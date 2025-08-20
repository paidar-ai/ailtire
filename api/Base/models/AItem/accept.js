const path = require('path');

module.exports = {
    friendlyName: 'accept',
    description: 'Accept the item to be generated',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "text": {
            "type": "string",
            "description": "The reason the item was accepted",
            "required": false
        }
    },
    outputs: {
            "type": "AItem",
            "description": "The AItem in the accepted state",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let text = inputs?.text;
        // obj has the obj for the method.
        obj.reason = text || "Not specified";
        return obj;
    }
};

const path = require('path');

module.exports = {
    friendlyName: 'getClass',
    description: 'Return the class',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "name": {
            "type": "string",
            "description": "Name of the class to get",
            "required": true
        }
    },
    outputs: {
            "type": "AClass",
            "description": "The class is returned",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let { name } = inputs;
        // obj has the obj for the method.
        if (global.classes.hasOwnProperty(name)) {
            return global.classes[name];
        } else {
            for (let cname in global.classes) {
                if (cname.toLowerCase() === name.toLowerCase()) {
                    return global.classes[cname];
                }
            }
        }
        return null;
    }
};

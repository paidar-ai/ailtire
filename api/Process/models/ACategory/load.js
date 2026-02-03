const path = require('path');

module.exports = {
    friendlyName: 'load',
    description: 'Load a Category from the file',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    "file": {
        "type": "file",
        "description": "The file to load",
        "required": true
    }
},
    outputs: {
        "type": "ACategory",
        "description": "ACategory Object based on the file",
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let { file } = inputs;

        let def = require(file);
        def.dir = path.dirname(file);
        let retval = new ACategory(def);
        return retval;
    }
};

const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
    description: 'Save the item to the file system',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
        "type": "string",
        "description": "The string will be stored in the note owning object",
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let def = {}
        for(let i in obj._attributes) {
            if(i !== 'id') {
                def[i] = obj._attributes[i];
            }
        }
        def.id = obj.id;
        def.state = obj.state;
        return def;
    }
};

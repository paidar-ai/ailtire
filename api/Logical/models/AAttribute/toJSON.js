const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");

module.exports = {
    friendlyName: 'toJSON',
    description: 'Convert toJSON. Only contain the attributes.',
    static: false,
    inputs: {
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        let retval = {};
        // Only put in the json the attributes that are in the definition.
        // All others are considered transient.
        // Additionally check for the transient flag if set then do not include.
        for(let aname in obj._attributes) {
            if(obj.definition.attributes.hasOwnProperty(aname) && !obj.definition.attributes[aname].transient) {
                retval[aname] = obj._attributes[aname];
            }
        }
        return retval;
    }
};


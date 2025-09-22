const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");

module.exports = {
    friendlyName: 'saveJSON',
    description: 'Convert saveJSON. Only contain the attributes.',
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
        let attr = {
            type: obj._attributes.type,
            description: obj._attributes.description,
            transient: obj._attributes.transient,
        }
        return attr;
    }
};


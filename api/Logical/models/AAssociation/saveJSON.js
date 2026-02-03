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
        // Only put in the json the attributes that are in the definition.
        // All others are considered transient.
        // Additionally check for the transient flag if set then do not include.
        let retval = {
            type: obj._attributes.type,
            description: obj._attributes.description,
            transient: obj._attributes.transient,
            composition: obj._attributes.composition,
            owner: obj._attributes.owner,
            via: obj._attributes.via,
            transparent: obj._attributes.transparent,
        }
        return retval;
    }
};


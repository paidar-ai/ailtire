const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");

module.exports = {
    friendlyName: 'save',
    description: 'Save and actor to the directory',
    static: false,
    inputs: {
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        obj.owner.save();
        return obj;
    }
};


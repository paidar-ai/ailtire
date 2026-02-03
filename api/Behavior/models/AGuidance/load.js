const fs = require('fs');
const path = require('path');
const { deserializeModel } = require('../../../../src/utils/modelJson');

module.exports = {
    friendlyName: 'load',
    description: 'Load an AGuidance from .ailtire/AGuidance/',
    static: true, // Class method that returns a new instance
    inputs: {
        fileName: {
            type: 'string',
            required: true,
            description: 'The filename of the guidance to load (full path to .json)'
        }
    },
    outputs: {
        retval: {
            type: 'AGuidance',
            description: 'The loaded AGuidance instance'
        }
    },
    exits: {
        notFound: {
            description: 'No saved guidance file was found by that name'
        },
        json: (obj) => obj
    },

    fn: function (inputs, exits) {
        const filePath = path.resolve(inputs.fileName);
        if (!fs.existsSync(filePath)) {
            return exits.notFound();
        }
        const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const guidance = deserializeModel(AGuidance, json);
        return guidance;
    }
};

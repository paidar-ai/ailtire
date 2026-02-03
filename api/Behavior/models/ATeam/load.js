const fs = require('fs');
const path = require('path');
const { deserializeModel } = require('../../../../src/utils/modelJson');

module.exports = {
    friendlyName: 'load',
    description: 'Load an ATeam from .ailtire/ATeam/',
    static: true, // Class method that returns a new instance
    inputs: {
        fileName: {
            type: 'string',
            required: true,
            description: 'The filename of the team to load (full path to .json)'
        }
    },
    outputs: {
        retval: {
            type: 'ATeam',
            description: 'The loaded ATeam instance'
        }
    },
    exits: {
        notFound: {
            description: 'No saved team file was found by that name'
        },
        json: (obj) => obj
    },

    fn: function (inputs, exits) {
        const filePath = path.resolve(inputs.fileName);
        if (!fs.existsSync(filePath)) {
            return exits.notFound();
        }
        const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const team = deserializeModel(ATeam, json);
        return team;
    }
};

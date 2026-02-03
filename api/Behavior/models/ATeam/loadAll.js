const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all ATeam definitions from .ailtire/ATeam/',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        retval: {
            type: 'json',
            description: 'All loaded ATeam instances'
        }
    },
    exits: {
        json: (obj) => obj,
    },

    fn: async function (obj, inputs, env) {
        const dir = path.resolve(
            global.ailtire.config.baseDir,
            `.ailtire/ATeam/`
        );

        if (!fs.existsSync(dir)) {
            return;
        }

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            ATeam.load({ fileName: path.resolve(dir, file) });
        }
        return await ATeam.instances();
    }
};

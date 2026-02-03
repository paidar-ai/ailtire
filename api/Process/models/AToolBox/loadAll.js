const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all AToolBox definitions from .ailtire/AToolBox/',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        retval: {
            type: 'json',
            description: 'All loaded AToolBox instances'
        }
    },
    exits: {
        json: (obj) => obj,
    },

    fn: async function (obj, inputs, env) {
        const dir = path.resolve(
            global.ailtire.config.baseDir,
            `.ailtire/AToolBox/`
        );

        if (!fs.existsSync(dir)) {
            return;
        }

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            AToolBox.load({ fileName: path.resolve(dir, file) });
        }
        return await AToolBox.instances();
    }
};

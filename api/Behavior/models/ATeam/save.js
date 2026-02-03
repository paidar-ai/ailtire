const path = require('path');
const fs = require('fs');
const { serializeModel } = require('../../../../src/utils/modelJson');

module.exports = {
    friendlyName: 'save',
    description: 'Save the ATeam to the .ailtire/ATeam/',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        retval: {
            type: 'ATeam',
            description: 'ATeam saved'
        }
    },
    exits: {
        json: (obj) => obj,
    },

    fn: function (obj, inputs, env) {
        const json = serializeModel(obj);
        const dir = path.resolve(global.ailtire.config.baseDir, `.ailtire/ATeam/`);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const fileKey = obj._attributes.id || obj._attributes.name;
        fs.writeFileSync(path.resolve(dir, `${fileKey}.json`), JSON.stringify(json, null, 2));
        return obj;
    }
};

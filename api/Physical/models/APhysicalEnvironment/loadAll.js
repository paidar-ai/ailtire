const path = require('path');
const APhysicalEnvironment = require("./index");

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all environments from a base directory',
    static: true,
    inputs: {
        baseDir: {
            type: 'string',
            description: 'Absolute path to physical-model/environments',
            required: true
        }
    },
    outputs: {
        type: "Array",
        description: "Array of APhysicalEnvironment objects",
        properties: {
            type: "APhysicalEnvironment",
            description: "APhysicalEnvironment Objects",
        }
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs, env) {
        global.physical = global.physical || {};
        global.physical.environments = global.physical.environments || {};
        for (const name of fs.readdirSync(inputs.baseDir)) {
            const envDir = path.join(inputs.baseDir, name);
            if (!fs.statSync(envDir).isDirectory()) continue;
            let environment = APhysicalEnvironment.load({name: name, dir: envDir});
            global.environments[name] = environment;
        }
        return global.physical.environments;
    }

};

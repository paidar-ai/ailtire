const path = require('path');
const APhysicalEnvironment = require("./index");

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all environments from a base directory',
    static: true,
    inputs: {
        dir: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname/locations',
            required: true
        }
    },
    outputs: {
        type: "Array",
        description: "Array of ANetworkDevices objects",
        properties: {
            type: "ANetworkDevice",
            description: "ANetworkDevice Objects",
        }
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs, env) {
        let retval = {};
        for (const name of fs.readdirSync(inputs.baseDir)) {
            const fileName = path.join(inputs.baseDir, name);
            let obj = ANetworkDevice.load({name: name, file: fileName});
            retval[name] = obj;
        }
        return retval;
    }
};

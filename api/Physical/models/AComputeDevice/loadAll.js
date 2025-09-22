const path = require('path');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all environments from a base directory',
    static: true,
    inputs: {
        dir: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname/computeDevices',
            required: true
        }
    },
    outputs: {
        type: "Array",
        description: "Array of AComputeDevice objects",
        properties: {
            type: "AComputeDevice",
            description: "AComputeDevice Objects",
        }
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs, env) {
        let retval = {};
        for (const name of fs.readdirSync(inputs.baseDir)) {
            const fileName = path.join(inputs.baseDir, name);
            let obj = AComputeDevice.load({name: name, file: fileName});
            retval[name] = obj;
        }
        return retval;
    }
};

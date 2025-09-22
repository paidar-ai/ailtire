module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all compute devices from a base directory',
    static: true,
    inputs: {
        file: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname/computeDevices/deviceName',
            required: true
        },
        name: {
            type: 'string',
            description: 'Name of the compute device',
            required: true
        }
    },
    outputs: {
        type: "AComputeDevice",
        description: "The compute device object from the configuration file index.js",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs,) {
        const fileName = inputs.file;
        let retval = {};
        if(fs.existsSync(fileName)) {
            const meta = require(fileName)
            retval = new AComputeDevice(meta);
        }
        return retval;
    }

};

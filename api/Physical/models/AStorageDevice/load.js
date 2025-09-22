module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all storage devices from a base directory',
    static: true,
    inputs: {
        file: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname/storageDevices/deviceName',
            required: true
        },
        name: {
            type: 'string',
            description: 'Name of the storage device',
            required: true
        }
    },
    outputs: {
        type: "AStorageDevice",
        description: "The storage device object from the configuration file index.js",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs,) {
        const fileName = inputs.file;
        let retval = {};
        if(fs.existsSync(fileName)) {
            const meta = require(fileName)
            retval = new AStorageDevice(meta);
        }
        return retval;
    }
};

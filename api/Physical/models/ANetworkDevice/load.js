module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all network devices from a base directory',
    static: true,
    inputs: {
        file: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname/networkDevices/locationname',
            required: true
        },
        name: {
            type: 'string',
            description: 'Name of the networkDevice',
            required: true
        }
    },
    outputs: {
        type: "ANetworkDevice",
        description: "The network device object from the configuraiton file index.js",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs,) {

        const fileName = inputs.file;
        let retval = {};
        if(fs.existsSync(fileName)) {
            const meta = require(fileName)
            retval = new ANetworkDevice(meta);
        }
        return retval;

    }

};

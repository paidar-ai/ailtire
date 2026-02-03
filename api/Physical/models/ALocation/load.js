module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all environments from a base directory',
    static: true,
    inputs: {
        file: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname/locations/locationname',
            required: true
        },
        name: {
            type: 'string',
            description: 'Name of the location',
            required: true
        }
    },
    outputs: {
        type: "ALocation",
        description: "The location object from the configuraiton file index.js",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs,) {
        const fileName = inputs.file;
        let retval = {};
        if(fs.existsSync(fileName)) {
            const meta = require(fileName)
            retval = new ALocation(meta);
        }
        return retval;
    }

};

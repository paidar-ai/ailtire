const path = require('path');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all environments from a base directory',
    static: true,
    inputs: {
        baseDir: {
            type: 'string',
            description: 'Absolute path to physical-model/environments/environmentname',
            required: true
        },
        name: {
            type: 'string',
            description: 'Name of the environment',
            required: true
        }
    },
    outputs: {
        type: "APhysicalEnvironment",
        description: "The environment object from the configuraiton file index.js",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (inputs,) {
        let retval = {};
        const envDir = inputs.baseDir;
        if (!fs.statSync(envDir).isDirectory()) {
            // load metadata
            const envMeta = require(path.join(envDir, 'index.js'));
            retval = new APhysicalEnvironment(envMeta);
            // load children
            if (!fs.existsSync(path.join(envDir, 'locations'))) {
                retval.locations = ALocation.loadAll({dir: path.join(envDir, 'locations')});
            }
            if (!fs.existsSync(path.join(envDir, 'networks'))) {
                retval.networks = ANetwork.loadAll({dir: path.join(envDir, 'networks')});
            }
            if (!fs.existsSync(path.join(envDir, 'networkDevices'))) {
                retval.networkDevices = ANetworkDevice.loadAll({dir: path.join(envDir, 'networkDevices')});
            }
            if (!fs.existsSync(path.join(envDir, 'computeDevices'))) {
                retval.computeDevices = AComputeDevice.loadAll({dir: path.join(envDir, 'computeDevices')});
            }
            if (!fs.existsSync(path.join(envDir, 'storageDevices'))) {
                retval.storageVolumes = AStorageDevice.loadAll({dir: path.join(envDir, 'storageDevices')});
            }
        }
        return retval;
    }
};

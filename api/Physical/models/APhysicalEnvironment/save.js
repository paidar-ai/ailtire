const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Save the environment to disk',
    static: false,
    inputs: {},
    outputs: {
        type: "APhysicalEnvironment",
        description: "The Object is saved to the directory structure",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (obj, inputs, env) {

        const envDir = obj.dir || global.ailtire.config.baseDir + '/physical/environments/' + obj.name;

        fs.mkdirSync(envDir, {recursive: true});
        // load metadata
        let tempObj = obj.toJSON();
        fs.writeFileSync(path.join(envDir, 'index.js'), JSON.stringify(tempObj, null, 4));
        for (let i in obj.locations) {
            obj.locations[i].save();
        }
        for (let i in obj.networks) {
            obj.networks[i].save();
        }
        for (let i in obj.networkDevices) {
            obj.networkDevices[i].save();
        }
        for (let i in obj.computeDevices) {
            obj.computeDevices[i].save();
        }
        for (let i in obj.storageDevices) {
            obj.storageDevices[i].save();
        }

        return obj;
    }
};

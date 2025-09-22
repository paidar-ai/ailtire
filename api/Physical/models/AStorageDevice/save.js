const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Save the storage device to disk',
    static: false,
    inputs: {},
    outputs: {
        type: "AComputeDevice",
        description: "The Object is saved to the directory structure",
    },
    exits: {
        success: {}, json: (envs) => envs
    },

    fn: function (obj, inputs, env) {

        const baseDir = obj.dir || global.ailtire.config.baseDir + '/physical/environments/' + obj.environment.name + '/storageDevices/';

        fs.mkdirSync(baseDir, {recursive: true});
        // load metadata
        let tempObj = obj.toJSON();
        fs.writeFileSync(path.join(baseDir, 'index.js'), JSON.stringify(tempObj, null, 4));

        return obj;
    }
};

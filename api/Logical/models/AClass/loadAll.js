const path = require('path');
const helper = require('../../../../src/utils/helper');
const fs = require("fs");

const isDirectory = source => fs.existsSync(source) && fs.lstatSync(source).isDirectory();
const isFile = source => fs.existsSync(source) && !fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getFiles = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isFile);

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load All of the classes from the directory',
    static: true,
    inputs: {
        dir: {
            description: 'Directory of the classes',
            type: 'string',
            required: true
        },
    },

    exits: {
    },

    fn: function (inputs, env) {

        let dir = inputs.dir || global.ailtire.baseDir;
        if(fs.existsSync(dir)) {
            let models = getDirectories(dir);
            // Initialize the global actors.
            for (let i in models) {
                let modelDir = models[i];
                AClass.load({package: inputs.package, dir: modelDir});
            }
        }
    }
};


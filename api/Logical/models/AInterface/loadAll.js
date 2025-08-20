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
        package: {
            description: 'Package of the interfaces',
            type: 'string',
            required: true
        },
        dir: {
            description: 'Directory of the inteface to load',
            type: 'string',
            require: false,
        }
    },

    exits: {
    },

    fn: function (inputs, env) {
        const package = inputs.package;
        const dir = inputs.dir || path.resolve(package.dir, "interface");
        if(fs.existsSync(dir)) {
            let interfaces = getDirectories(dir);
            AInterface.load({package:package, dir:dir});
            for (let i in interfaces) {
                let idir = interfaces[i];
                AInterface.load({package: inputs.package, dir: idir});
            }
        }
    }
};


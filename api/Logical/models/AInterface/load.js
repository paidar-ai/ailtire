const path = require('path');
const helper = require('../../../../src/utils/helper');
const fs = require("fs");

const isDirectory = source => fs.existsSync(source) && fs.lstatSync(source).isDirectory();
const isFile = source => fs.existsSync(source) && !fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getFiles = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isFile);

module.exports = {
    friendlyName: 'load',
    description: 'Load an actor from the directory',
    static: true,
    inputs: {
        dir: {
            description: 'Interface Directory to load the class definition',
            type: 'string',
            required: true
        },
        package: {
            description: 'Package that is the owner of the class.',
            type: 'APackage',
            required: true
        }
    },

    exits: {
    },

    fn: function (inputs, env) {
        const package = inputs.package;
        const mDir = inputs.dir;

        let interfaces = {};
        if (!package.prefix) {
            package.prefix = prefix.toLowerCase();
        }

        if(!global.interface) {
            global.interface = {};
        }
        let files = getFiles(mDir);
        for (let i in files) {
            let file = path.resolve(files[i]);
            let extendedPath = file.replace(path.resolve(package.dir, 'interface'), '');
            let aname = extendedPath.replace('.js','').replaceAll(/\\/g, '/');
            let apath = package.prefix + aname;
            apath = apath.toLowerCase();
            let details = require(file);
            details.package = package;
            details.path = apath;
            let interface = new AInterface(details);
//            let action = Action.create(package, apath, details);
            global.interface[apath] = interface;
            package.addToInterfaces(interface);
        }
        // AInterface.loadAll({package: package, dir: mDir});
        return package.interfaces;
    }
};


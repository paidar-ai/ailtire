const path = require('path');
const helper = require('../../../../src/utils/helper');
const fs = require("fs");

const isDirectory = source => fs.existsSync(source) && fs.lstatSync(source).isDirectory();
const isFile = source => fs.existsSync(source) && !fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getFiles = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isFile);


module.exports = {
    friendlyName: 'loadAll',
    description: 'Load All of the actors from the directory',
    static: true,
    inputs: {
        cls: {
            description: 'Class that contains the methods to be loaded',
            type: 'AClass',
            required: true
        },
    },

    exits: {
    },

    fn: function (inputs, env) {
        let cls = inputs.cls;
        let dir = cls.definition.dir;
        let files = getFiles(dir);
        for(let i in files) {
            let file = files[i];
            let filename = path.basename(file);
            if(filename !== 'index.js' && filename[0] !== '.') {
                try {
                    AMethod.load({file: file, cls: cls});
                }
                catch(e) {
                    console.error("Error Loading method: " + file, e);
                }
            }
        }
    }
};


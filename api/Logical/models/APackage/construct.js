const Generator = require("../../../../src/Documentation/Generator");
const fs = require("fs");
const path = require("path");

module.exports = {
    friendlyName: 'construct', description: `Construct an application directory heirarchy`,
    static: true,
    inputs: {
        name: {
            description: 'Name of the application', type: 'string', required: true
        }, dir: {
            description: 'Application base directory to load the application definition', type: 'string', required: false
        },
    },
    outputs: {
        type: 'APackage',
        description: "The APakcage created by the construct.",
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let name = inputs.name;
        let output = inputs.dir || './api';

        // Build out the packages based in the delimiter '/'
        // Check that the package has already been created first.
        // if it has then check the next level.
        if (name) {
            let packageArray = name.split(/\//);
            let ancestors = [];
            for (let i in packageArray) {
                let packageItem = packageArray[i];
                let packageItemName = packageItem.replace(/ /g, '');
                let shortname = '';
                let nameArray = packageItem.split(/\s/);
                for (let j in nameArray) {
                    shortname += nameArray[j][0];
                }
                shortname = shortname.toUpperCase();
                if (!existsDir(output + '/' + packageItemName)) {
                    let files = {
                        context: {
                            name: packageItem,
                            nameNoSpace: packageItemName,
                            shortname: shortname.toLowerCase(),
                            ancestors: ancestors.join('_').toLowerCase()
                        }, targets: {
                            ':nameNoSpace:/index.js': {template: `${__dirname}/templates/index.js`},
                            ':nameNoSpace:/handlers': {folder: true},
                            ':nameNoSpace:/workflows': {folder: true},
                            ':nameNoSpace:/interface': {folder: true},
                            ':nameNoSpace:/models': {folder: true},
                            ':nameNoSpace:/deploy': {folder: true},
                            ':nameNoSpace:/deploy/services.js': {template: `${__dirname}/templates/deploy/services.js`},
                            ':nameNoSpace:/deploy/build.js': {template: `${__dirname}/templates/deploy/build.js`},
                            ':nameNoSpace:/deploy/deploy.js': {template: `${__dirname}/templates/deploy/deploy.js`},
                            ':nameNoSpace:/deploy/web/Dockerfile': {template: `${__dirname}/templates/deploy/Dockerfile`},
                            ':nameNoSpace:/deploy/web/package.json': {template: `${__dirname}/templates/deploy/package.json`},
                            ':nameNoSpace:/deploy/web/server.js': {template: `${__dirname}/templates/deploy/server.js`},
                            ':nameNoSpace:/usecases': {folder: true},
                        }
                    };
                    Generator.process(files, output);
                }
                ancestors.push(shortname);
                output += '/' + packageItemName;
            }
        } else { // Return the application directory
            output = output;
            name = '';
        }
        let package = APackage.load({dir: path.resolve(output)});
        return package;
    }
};

function existsDir(dir) {
    try {
        if (fs.statSync(dir).isDirectory()) {
            return true;
        }
    } catch (e) {
        if (e) {
            return false;
        }
    }
}
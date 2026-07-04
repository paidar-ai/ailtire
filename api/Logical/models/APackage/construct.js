const Generator = require("../../../../src/Documentation/Generator");
const fs = require("fs");
const path = require("path");

module.exports = {
    friendlyName: 'construct', description: `Construct a package. A package contains an interface, event handlers, and models. This logical package allows to group like things together for a reusable items in the architecture.`,
    static: true,
    inputs: {
        name: {
            description: 'Name of the package.', type: 'string', required: true
        },
        description: {
            description: 'Description of the package', type: 'string', required: false,
        },
        shortname: {
            description: 'Short name of the package', type: 'string', required: false,
        },
        dir: {
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
                            ':nameNoSpace:/deploy/microservice': {folder: true},
                            ':nameNoSpace:/deploy/webserver': {folder: true},
                            ':nameNoSpace:/deploy/microservice/server.js': {template: `${__dirname}/templates/deploy/microservice/server.js`},
                            ':nameNoSpace:/deploy/microservice/package.json': {template: `${__dirname}/templates/deploy/microservice/package.json`},
                            ':nameNoSpace:/deploy/microservice/Dockerfile': {template: `${__dirname}/templates/deploy/microservice/Dockerfile`},
                            ':nameNoSpace:/deploy/webserver/package.json': {template: `${__dirname}/templates/deploy/webserver/package.json`},
                            ':nameNoSpace:/deploy/webserver/Dockerfile': {template: `${__dirname}/templates/deploy/webserver/Dockerfile`},
                            ':nameNoSpace:/deploy/webserver/index.html': {template: `${__dirname}/templates/deploy/webserver/index.html`},
                            ':nameNoSpace:/deploy/webserver/vite.config.js': {template: `${__dirname}/templates/deploy/webserver/vite.config.js`},
                            ':nameNoSpace:/deploy/webserver/src/main.js': {template: `${__dirname}/templates/deploy/webserver/src/main.js`},
                            ':nameNoSpace:/deploy/webserver/src/App.svelte': {template: `${__dirname}/templates/deploy/webserver/src/App.svelte`},
                            ':nameNoSpace:/deploy/package.json': {template: `${__dirname}/templates/deploy/package.json`},
                            ':nameNoSpace:/deploy/services.js': {template: `${__dirname}/templates/deploy/services.js`},
                            ':nameNoSpace:/deploy/build.js': {template: `${__dirname}/templates/deploy/build.js`},
                            ':nameNoSpace:/deploy/deploy.js': {template: `${__dirname}/templates/deploy/deploy.js`},
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

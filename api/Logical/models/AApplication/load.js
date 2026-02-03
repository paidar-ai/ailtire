const path = require('path');
const fs = require("fs");
const helper = require('../../../../src/utils/helper');
const classProxy = require("../../../../src/Proxy/ClassProxy");
module.exports = {
    friendlyName: 'load',
    description: 'Load an application from the directory',
    static: true,
    inputs: {
        dir: {
            description: 'Class Directory to load the class definition',
            type: 'string',
            required: true
        },
    },

    exits: {
    },

    fn: function (inputs, env) {
        let dir = inputs.dir;
        let packagejson = path.resolve(dir, 'package.json');
        if(!fs.existsSync(packagejson)) {
            console.log("Skipping Application: " + dir);
            console.log("package.json file is missing!");
            return;
        }
        const configStr = fs.readFileSync(packagejson, 'utf-8');
        let config = JSON.parse(configStr);

        let app = new AApplication(config);
        // Load the packages
        let package = APackage.load({dir: path.resolve(dir, 'api')});
        app.package = package;
        global.topPackage = package;
        global.application = app;

        // Load the actors;
        let actors = AActor.loadAll({dir: path.resolve(dir, 'actors')});
        app.actors = actors;
        let notes = ANote.loadAll({dir: path.resolve(dir, '.notes')});
        return app;
    }
};


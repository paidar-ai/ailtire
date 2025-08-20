const Generator = require("../../../../src/Documentation/Generator");
module.exports = {
    friendlyName: 'construct',
    description: `Construct an application directory heirarchy`,
    static: true,
    inputs: {
        name: {
            description: 'Name of the application',
            type: 'string',
            required: true
        },
        dir: {
            description: 'Application base directory to load the application definition',
            type: 'string',
            required: true
        },
    },

    exits: {
        json: (obj) => { return obj; },
    },

    fn: function (inputs, env) {
        let dir = inputs.dir;
        let name = inputs.name;
        let files = {
            context: {
                name: name,
                nameNoSpace: name.replace(/ /g, ''),
                path: dir
            },
            targets: {
                'index.js': {template: `${__dirname}/templates/index.js`},
                'package.json': {template: `${__dirname}/templates/package.json`},
                'api/index.js': {template: `${__dirname}/templates/apiIndex.js`},
                'api/interface': {folder: true},
                'api/handlers': {folder: true},
                'api/workflows': {folder: true},
                'test': {folder: true},
                'views': {folder: true},
                'actors': {folder: true},
                'bin': {folder: true},
                '.workflows': { folder: true },
                '.notes': { folder: true },
                '.uploads': { folder: true },
                'views/layouts/default.ejs': {copy: `${__dirname}/templates/package.json`},
                'bin/:nameNoSpace:': {copy: `${__dirname}/templates/bin`},
                'assets/js': {folder: true},
                'deploy/docker-compose.yml': {template: `${__dirname}/templates/deploy/docker-compose.yml`},
                'deploy/build.js': {template: `${__dirname}/templates/deploy/build.js`},
                'deploy/deploy.js': {template: `${__dirname}/templates/deploy/deploy.js`},
                'deploy/web/Dockerfile': {template: `${__dirname}/templates/deploy/Dockerfile_web`},
                'deploy/doc/Dockerfile': {template: `${__dirname}/templates/deploy/Dockerfile_doc`},
                'deploy/doc/package.json': {template: `${__dirname}/templates/deploy/package.doc.json`},
                '/deploy/web/server.js': {template: `${__dirname}/templates/deploy/server.js`},
                '/deploy/doc/doc.js': {template: `${__dirname}/templates/deploy/doc.js`},
                'docs/plantuml.jar': {copy: `${__dirname}/templates/plantuml.jar`}
            }
        };
        Generator.process(files, dir);
        return name;
    }
};


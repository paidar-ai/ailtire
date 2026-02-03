// const api = require('../../src/Documentation/api');
module.exports = {
    friendlyName: 'create',
    description: 'Create an app',
    static: true,
    inputs: {
        name: {
            description: 'The name of the application',
            type: 'string',
            required: true
        },
        dir: {
            description: 'The directory to install the application',
            type: 'string',
            required: false
        },
    },

    exits: {
        json: (obj) => { return obj; },
    },

    fn: function (inputs, env) {
        if(inputs.hasOwnProperty('dir')) {
            AApplication.construct({name: inputs.name, dir: inputs.dir});
        }
        else {
            inputs.dir = './' + inputs.name;
            AApplication.construct({name: inputs.name, dir: inputs.dir});
        }
        return `Application ${inputs.name} has been created at ${inputs.dir}.\nType 'npm install' to populate dependencies.\nThen 'npm start' to start the application.`;
    }
};


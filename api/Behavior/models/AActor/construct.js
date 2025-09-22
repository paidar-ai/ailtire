const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");
const {actor} = require("../../../../src/Documentation/api");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct actor to the directory',
    static: true,
    inputs: {
        name: {
            description: 'The name of the actor',
            type: 'string',
            required: true
        },
        description: {
            description: 'The description of the actor',
            type: 'string',
            required: false
        }
    },

    exits: {},

    fn: function (inputs, env) {
        let baseDir = global.ailtire.baseDir;
        let dir = path.resolve(baseDir, 'actors' );
        let files = {
            context: {
                name: inputs.name,
                description: 'Put a description of the actor here.',
                nameNoSpace: inputs.name.replace(/ /g, '')
            },
            targets: {
                ':nameNoSpace:/index.js': {template: `${__dirname}/templates/actor.js`},
                ':nameNoSpace:/image.png': {copy: `${__dirname}/templates/image.png`},
                ':nameNoSpace:/views/svelte': {copyFolder: `${__dirname}/templates/views/svelte`},
            }
        };
        Generator.process(files, dir);
        return true;
    }
};


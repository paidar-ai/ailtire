const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");

module.exports = {
    friendlyName: 'save',
    description: 'Save and actor to the directory',
    static: false,
    inputs: {},

    exits: {},

    fn: function (obj, inputs, env) {

        let dir = path.resolve(global.ailtire.baseDir, 'actors' );
        let files = {
            context: {
                name: obj.name,
                description: obj.description || 'Put a description of the actor here.',
                nameNoSpace: obj.name.replace(/ /g, '')
            },
            targets: {
                ':nameNoSpace:/index.js': {template: `${__dirname}/templates/actor.js`},
            }
        };
        Generator.process(files, dir);
        return obj;
    }
};


const path = require('path');
const helper = require('../../../../src/utils/helper');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load All of the actors from the directory',
    static: true,
    inputs: {
        dir: {
            description: 'Directory of the actors',
            type: 'string',
            required: true
        },
    },

    exits: {
    },

    fn: function (inputs, env) {

        let dir = inputs.dir || global.ailtire.config;.baseDir;
        let actors = helper.getDirectories(dir);
        // Initialize the global actors.
        if (!global.hasOwnProperty('actors')) {
            global.actors = {};
        }
        for (let i in actors) {
            let actorDir = actors[i];
            if (!actorDir.includes('\\doc') && !actorDir.includes('\/doc')) {
                AActor.load({file: path.resolve(actorDir, 'index.js')});
            }
        }
        return global.actors;
    }
};


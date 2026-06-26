const path = require('path');
const helper = require('../../../../src/utils/helper');
const fs = require('fs');
module.exports = {
    friendlyName: 'load',
    description: 'Load an actor from the directory',
    static: true,
    inputs: {
        name: {
            description: 'The name of the actor',
            type: 'string',
            required: true
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {

        let fname = inputs.file;
        if (!fname) {
            let name = inputs.name;
            let baseDir = inputs.dir || global.ailtire.baseDir;
            fname = path.resolve(baseDir, name, 'index.js');
        }
        let dir = path.dirname(fname);
        if (!fs.existsSync(fname)) {
            throw Error({message: `Actor ${inputs.name || inputs.file} does not exist!`});
        }
        let actorTemp = require(fname);

        let roles = [];
        for (let i in actorTemp.roles) {
            let role = actorTemp.roles[i];
            if (typeof role === 'string') {
                try {
                    let roleObj = ARole.find({name: role});
                    if (roleObj) {
                        roles.push(roleObj);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        // Make sure the roles are unique
        roles = roles.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
        actorTemp.roles = roles;
        actor = new AActor(actorTemp);
        actor.dir = dir;
        actor.doc = {basedir: `${dir}/doc`};
        helper.loadDocs(actor, actor.doc.basedir);
        return actor;
    }
};


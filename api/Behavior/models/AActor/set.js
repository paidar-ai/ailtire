const fs = require("fs");
module.exports = {
    friendlyName: 'set',
    description: 'Set an Actor documentation',
    static: false,
    inputs: {
        summary: {
            descritpion: 'Summary of the actor',
            type: 'string',
            required: false
        },
        document: {
            descritpion: 'Documentation of the actor',
            type: 'string',
            required: false
        }
    },

    exits: {
        json: (obj) => { return obj;}
    },

    fn: function (obj, inputs, env) {
        // Find the actor from the usecase.
        let actor = obj;
        if(actor) {
            actor.description = inputs.summary;
            if(actor.doc && actor.doc.basedir && inputs.documentation) {
                fs.writeFileSync(actor.doc.basedir + '/doc.emd', inputs.documentation)
            }
            let saveActor = {
                name: actor.name,
                shortname: actor.shortname,
                description: inputs.summary
            }
            let actorDef = `module.exports = ${JSON.stringify(saveActor, null, 3)} ;`;
            let filename = actor.dir + '/index.js';
            fs.writeFileSync(filename, actorDef);

            if(env?.res) {
                env.res.redirect('/web/');
            }
            return actor;
        } else {
            console.error("Could not find the Actor:", aname);
            env?.res.status(500).send({error: "Actor could not be found"});
        }
        return false;
    }
};

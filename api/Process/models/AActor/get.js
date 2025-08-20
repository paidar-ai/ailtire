const fs = require("fs");
module.exports = {
    friendlyName: 'get',
    description: 'Get an Actor',
    static: true,
    inputs: {
        id: {
            description: 'The id of the actor',
            type: 'string',
            required: false
        },
        name: {
            description: 'The name of the actor',
            type: 'string',
            required: false
        },
        doc: {
            descritpion: 'Return the documentation of the actor',
            type: 'boolean',
            required: false
        }
    },

    exits: {
        json: (obj) => {
            if (!obj) {
                return {status: '401', message: 'Actor not found.'};
            }
            return obj;
        },
    },

    fn: function (inputs, env) {
        // Find the actor from the usecase.
        let aname = inputs.id || inputs.name;
        let actor = _findActor(aname);
        if (actor) {
            if (inputs.doc) {
                if (actor.doc && actor.doc.basedir) {
                    if (fs.existsSync(actor.doc.basedir + '/doc.emd')) {
                        actor.document = fs.readFileSync(actor.doc.basedir + '/doc.emd', 'utf8');
                    } else {
                        actor.document = "Enter documentation here.";
                    }
                }
            }
            actor.workflows = {};
            for (let i in global.workflows) {
                let workflow = global.workflows[i];
                for (let aname in workflow.activities) {
                    let activity = workflow.activities[aname];
                    if (activity.actor && activity.actor === actor.name) {
                        actor.workflows[workflow.name] = workflow;
                    }
                }
            }
            return actor;
        }
        return null;
    }
};

function _findActor(aname) {
    if (global.actors.hasOwnProperty(aname)) {
        return global.actors[aname];
    } else {
        for (let a in global.actors) {
            let actor = global.actors[a];
            if (a.toLowerCase() === aname.toLowerCase()) {
                return actor;
            }
            if (actor.name.toLowerCase().replace(/\s/g, '') === aname.toLowerCase().replace(/\s/g, '')) {
                return actor;
            }
            if (actor.shortname.toLowerCase() === aname.toLowerCase()) {
                return actor;
            }
        }
    }
    return null;
}

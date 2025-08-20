const fs = require("fs");

module.exports = {
    friendlyName: 'set',
    description: 'Set an Actor documentation',
    static: true,
    inputs: {
        id: {
            description: 'Id of the actor',
            type: 'string',
            required: true
        },
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
        json: (obj) => { return obj; },
    },

    fn: function (inputs, env) {
        // Find the actor from the usecase.
        let aname = inputs.id;
        let actor = AActor.get({id: aname});
        if(!actor) {
            console.error("Could not find the actor:", aname);
            return false;
        }
        actor.set(inputs);
        return true;
    }
};

module.exports = {
    friendlyName: 'get',
    description: 'Get an Actor',
    static: true,
    inputs: {
        actors: {
            description: 'List of actors',
            type: 'string',
            required: false
        },
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
        let actors = inputs.actors || global.actors;
        let retval ={};
        for(let aname in actors) {
            let actor = actors[aname];
            for (let i in actor) {
                retval[i] = actor[i];
                switch (i) {
                    case "usecases":
                        for(let iname in actor.usecases) {
                            retval.usecases[iname] = {
                                name: actor.usecases[iname].name,
                                description: actor.usecases[iname].description,
                            };
                        }
                        break;
                    case "scenarios":
                        for(let iname in actor.scenarios) {
                            retval.scenarios[iname] = {
                                name: actor.scenarios[iname].name,
                                description: actor.scenarios[iname].description,
                            };
                        }
                        break;
                    case "doc":
                        retval.doc = undefined;
                        break;
                }
            }
        }
        return JSON.stringify(retval);
    }
};

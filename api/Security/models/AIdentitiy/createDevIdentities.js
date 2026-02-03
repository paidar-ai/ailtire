module.exports = {
    friendlyName: 'createDevIdentities',
    description: 'Create default Development Identities for each actor defined in the system',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
       identities: {
           type: "array",
           description: "The newly created identities",
           properties: {
               type: "AIdentity",
               description: "A single identity"
           }
       }
    },
    exits: {
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let actors = await AActor.instances();
        let allPowerfulIdentity = new AIdentity({displayName: 'root', identifier:'root'});
        let identities = [allPowerfulIdentity];
        for(let i in actors) {
            let actor = actors[i];
            let identity = new AIdentity({displayName: actor.name, identifier:actor.name});
            identity.addToActors(actor);
            identities.push(identity);

            allPowerfulIdentity.addToActors(actor);
        }
        return identities;
    }
};

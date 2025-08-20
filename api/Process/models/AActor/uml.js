const AService = require("../../../../src/Server/AService");
module.exports = {
    friendlyName: 'uml',
    description: 'plantuml diagram of the Actor',
    inputs: {
        target: {
            description: 'The type of diagram to generate',
            type: 'string',
            required: true
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        try {
            // Generate the plantuml diagram
            // Or get it from the doc directory.
            let actor = obj;
            let diagram = inputs.diagram;
            
            let apackages = {};

            for (let i in actor.usecases) {
                let usecase = actor.usecases[i];
                let uname = usecase.name.replace(/\s/g, '');
                let package = APackage.getPackage(usecase.package);
                let packageName = usecase.package;
                if (!apackages.hasOwnProperty(packageName)) {
                    apackages[packageName] = {
                        color: package.color,
                        shortname: package.shortname,
                        usecases: {},
                        workflows: {},
                        name: package.name
                    };
                }
                apackages[packageName].usecases[uname] = usecase;
            }
            for(let i in actor.workflows) {
                let workflow = actor.workflows[i];
                let wname = workflow.name.replace(/\s/g,'');
                let package = APackage.getPackage(workflow.package);
                let packageName = package.name.replace(/\s/g, '');
                if (!apackages.hasOwnProperty(packageName)) {
                    apackages[packageName] = {
                        color: package.color,
                        shortname: package.shortname,
                        usecases: {},
                        workflows: {},
                        name: package.name
                    };
                }
                apackages[packageName].workflows[wname] = workflow;
            }
            let results = await AService.call('puml/actor', {actor: actor, actorPackages: apackages, diagram: diagram});
            return results;
        }
        catch(e) {
            console.error(e);
            env.res.json({error:`Actor not found ${inputs.id}`});
        }
    }
};

const AIHelper = require("../../../../src/Server/AIHelper");

module.exports = {
    friendlyName: 'generateActors',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        prompt: {
            type: "string",
            description: "The prompt is added to the current note to generate items from",
            required: false
        },
    },
    outputs: {
            "type": "ANote",
            "description": "ANote with the actors attached to it"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {

        let package = global.topPackage;
        let pjson = package.toPrompt();
        let ajson = AActor.toPrompt(global.actors);
        let actorSchema = AActor.schema();
        let messages = [];
        AEvent.emit({event: "generate.started", data: {message: "Generating Actors from Notes"}});
        messages.push({role: 'system', content: `Use the following actors for analysis of the user prompt: ${ajson}`});
        messages.push({role: 'system', content: `Use the following package for analysis of the user prompt: ${pjson}`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        messages.push({
            role: 'user', content: "Based on the following information generate any new actors for the system. " +
                " The results should be in" +
                ` json format: \'${actorSchema}.'` +
                " The results should be an array of these objects. actorShortName should be a name that has no spaces " +
                `and all lowercase and a wellknown abbreviation for the actorName. Here is the following information: ${obj.text}`
        });

        let actors = await AIHelper.askForCode(messages);
        for (let i in actors) {
            let actor = actors[i];
            obj.addToItems({type: 'AActor', json: actor});
        }
        obj.save();
        AEvent.emit({event: "generate.completed", data: {message: `Generated ${actors.length} Actors from Notes`}});
        return obj;
    }
};

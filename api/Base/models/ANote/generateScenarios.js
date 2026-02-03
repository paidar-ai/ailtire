const AIHelper = require("../../../../src/Server/AIHelper");

module.exports = {
    friendlyName: 'generateScenarios',
    description: 'Generate scenarios from the notes. Make sure there is not a scenario that is already valid',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        prompt: {
            type: "string",
            description: "The prompt is added to the current note to generate items from",
            required: false
        },
    },
    outputs: {
            "type": "ANote", "description": "ANote with the scenarios attached to it"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        let package = global.topPackage;
        AEvent.emit({event:"generate.scenarios.started", data: {message: `Generating Scenarios from Notes`} });
        let pjson = package.toPrompt();
        let ajson = AActor.toPrompt(global.actors);
        let ujson = AUseCase.toPrompt(global.usecases);
        let messages = [];
        messages.push({
            role: 'system',
            content: `Use the following usecases for analysis of the user prompt: ${ujson}`
        });
        messages.push({role: 'system', content: `Use the following actors for analysis of the user prompt: ${ajson}`});
        messages.push({role: 'system', content: `Use the following package for analysis of the user prompt: ${pjson}`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        messages.push({
            role: 'user',
            content: "Based on the information generate any new scenarios for the usecases. Each scenario should belong" +
                " to a usecase. For each current scenario elaborate on the description, given, when and then statements. " +
                " Limit each given,when and then statement to less than 80 characters. The results should be in" +
                ` json format: ${AScenario.schema()}` +
                " The results should be an array of these objects."
        });


        let scenarios = await AIHelper.askForCode(messages);
        /*
        // Now see if the new scenarios fit into the use cases.
        messages = [];
        messages.push({role: 'system', content: `Use the following usecases for the analysis of the user prompt: ${ujson}`});
        messages.push({role: 'system', content: "For each scenario in the user prompt find a usecase for each it scenario " +
                "and return a json map that has { usecaseName: scenarioName}. If a usecase does not exist give a name for a new one."});
       let sjson = scenarios.join('\n');
       messages.push({role: 'user', content: `Map these scenarios to usecases: ${sjson}`});
        let mapping = await AIHelper.askForCode(messages);

         */
        for (let i in scenarios) {
            let sname = scenarios[i].name.replace(/\s/g, '');
            let scenario = scenarios[i];
            obj.addToItems({type: 'AScenario', json: scenario});
        }
        AEvent.emit({event:"generate.scenarios.completed", data: {message: `Generating ${scenarios.length} Scenarios from Notes`} });
        obj.save();

    }
};

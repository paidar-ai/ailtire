const path = require('path');
const AEvent = require("../../../../src/Server/AEvent");
const AFilter = require("yamljs");

module.exports = {
    friendlyName: 'generate',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        prompt: {
            type: "string",
            description: "The prompt is added to the current note to generate items from",
            required: false
        },
        filters: {
            type: "string",
            description: "A list of filters to apply to the items, this is a comma separated list of filters. If no filtier is specified then all filters are used. ",
            required: false
        }
    },
    outputs: {
            "type": "ANote",
            "description": "ANote with a set of action items attached to it",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {

        let {prompt, filters} = inputs;

        let filterArray = filters.split(',');
        if (filterArray.length === 0) {
            filterArray = ["actor", "actionitem", "model", "scenario", "usecase", "workflow", "package"];
        }
        for (let i in filterArray) {
            let filter = filterArray[i];
            filter = filter.trim().toLowerCase();
            switch (filter) {
                case "actor":
                    await obj.generateActors({prompt: prompt});
                    break;
                case "actionitem":
                    await obj.generateActionItems({prompt: prompt});
                    break;
                case "model":
                    await obj.generateModels({prompt: prompt});
                    break;
                case "package":
                    await obj.generatePackages({prompt: prompt});
                    break;
                case "scenario":
                    await obj.generateScenarios({prompt: prompt});
                    break;
                case "usecase":
                    await obj.generateUseCases({prompt: prompt});
                    break;
                case "workflow":
                    await obj.generateWorkflows({prompt: prompt});
                    break;
                default:
                    break;
            }
        }
        return obj;
    }
};

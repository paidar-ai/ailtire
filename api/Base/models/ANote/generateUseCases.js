const path = require('path');
const AIHelper = require("../../../../src/Server/AIHelper");

module.exports = {
    friendlyName: 'generateUseCases',
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
            "description": "The Note with the use cases attached to it",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        AEvent.emit({event: "generate.started", data: {message: `Generating UseCases from Notes`}});
        const usecaseFormat = AUseCase.schema();
        let messages = [];
        let package = global.topPackage;
        // Get the current usecases, class definitions, and workflows
        // Put them into a string and put them as system information.
        let items = ["usecases", "classes", "workflows"];
        for (i in items) {
            let content = `Use the following ${items[i]} for analysis of the user prompt:`;
            for (let name in package[items[i]]) {
                let obj = package[items[i]][name];
                content += obj.toPrompt() + '\n';
            }
            messages.push({role: 'system', content: content});
        }
        // Get the current documentation. Add it as system information.
        // let docString = package.getDocumentation();
       //  messages.push({role: 'system', content: "Use the following as the package documentation: " + docString});
        messages.push({
            role: 'system',
            content: `Take the user prompt and generate use cases or update existing use cases for the project. ` +
                `A good use case name should be an action phrase beginning with active verbs, be user focused, and concise. ` +
                `The output should use the following template: ${usecaseFormat}. Output should be an array of ` +
                `json objects. Only return the json.`
        });

        // Now ask to show the changes to the documentation based on all of the information.
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        messages.push({role: 'user', content: obj.text});
        let usecases = await AIHelper.askForCode(messages);
        for (let i in usecases) {
            let usecase = usecases[i];
            usecase.package = package.name;
            usecase.prefix = package.prefix;
            usecase.dir = path.resolve(`${package.dir}/usecases/${usecase.name.replace(/\s/g, '')}`);
            obj.addToItems({type:'AUseCase', json:usecase});
        }
        obj.save();
        AEvent.emit({
            event: "generate.completed",
            data: {message: `Generating ${usecases.length} UseCases from Notes`}
        });
        return obj;
    }
};

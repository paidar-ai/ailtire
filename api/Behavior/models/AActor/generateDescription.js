const fs = require("fs");
const AIHelper = require('../../../../src/Server/AIHelper');

module.exports = {
    friendlyName: 'generateDocumentation',
    description: 'Have Generative AI generate Documentation',
    static: false,
    inputs: {
        prompt: {
            name: 'prompt',
            description: 'Prompt to generate documentation',
            type: 'string',
            required: false,
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        let actor = obj;
        let json = `{name: ${actor.name}, shortname: ${actor.shortname}, description: ${actor.description}`;
        let doc = actor.getDocumentation(actor);

        let messages = [];
        messages.push({role: 'system', content: `Use the following actor for analysis of the user prompt: ${json}`});
        messages.push({
            role: 'system',
            content: `Use the following as actor documentation for analysis of the user prompt: ${doc}`
        });
        // messages.push({ role: 'system', content: `Use the following as system documentation for analysis of the
        // user prompt: ${systemDoc}`});
        let items = ["usecases", "scenarios"];
        for (i in items) {
            let content = `Use the following ${items[i]} for analysis of the user prompt:`;
            for (let name in actor[items[i]]) {
                let obj = actor[items[i]][name];
                content += `{name: ${obj.name}, description: "${obj.description}"},`;
                // content += `{ name:${obj.name}, description:${obj.description} }\n`;
            }
            messages.push({role: 'system', content: content});
        }
        messages.push({
            role: 'user', content: "Generate a concise description of the actor based on the actor and" +
                " usecase and scenario definitions and documentation. It should not be more than one sentence long." +
                " Do not include the file location or information."
        });
        let response = await AIHelper.ask(messages);
        actor.description = response;
        actor.save();
        return response;
    }
};
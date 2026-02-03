const AIHelper = require("../../../../src/Server/AIHelper");

module.exports = {
    friendlyName: 'generate',
    description: 'Generate Use Cases from the prompt',
    static: true,
    inputs: {
        prompt: {
            type: "string",
            description: "The prompt is added to the current note to generate items from",
            required: false
        },
        note: {
            type: "ANote",
            description: "The note to use to generate items from",
            required: false
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (inputs, env) {
        const format = AUseCase.schema();

        let messages = [];
        let ujson = AUseCase.toPrompt();

        let content = `Use the following usecase definitions for analysis and check for duplicates of the user prompt: ${ujson}`;
        messages.push({role: 'system', content: content});

        // Get the current documentation. Add it as system information.
        messages.push({role: 'system',
            content: `From the user prompt identify and generate usecases or usecases to update  using the following as a` +
                ` template: ${format}. Output should be in an array of json objects. Only return the json.`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        let note = inputs.note;
        if(!note) {
            note = await ANote.create({text: "Generate usecases from the prompt: " + inputs.prompt});
        }
        messages.push({ role: 'user', content: note.text });
        let models = await AIHelper.askForCode(messages);
        try {
            // Iterate over the list of use cases and save them.
            let items = [];
            for (let i in models) {
                let model = models[i];
                let item = note.addToItems({type: 'AUseCase', json: model});
                item.note = note;
                items.push(item);
            }
            note.save();
            return note;
        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    }
};

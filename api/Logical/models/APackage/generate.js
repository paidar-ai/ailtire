const AIHelper = require("../../../../src/Server/AIHelper");

module.exports = {
    friendlyName: 'generate',
    description: 'Generate Packages from the prompt',
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
        const format = APackage.schema();

        let messages = [];
        let package = global.topPackage;
        let pjson = package.toPrompt();

        let content = `Use the following  package definition for analysis of the user prompt: ${pjson}`;
        messages.push({role: 'system', content: content});

        // Get the current documentation. Add it as system information.
        messages.push({role: 'system',
            content: `From the user prompt identify and generate packages using the following as a` +
                ` template: ${format}. Output should be in an array of json objects. Only return the json.`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        let note = inputs.note;
        if(!note) {
            note = await ANote.create({text: "Generate packages from the prompt: " + inputs.prompt});
        }
        messages.push({ role: 'user', content: note.text });
        let models = await AIHelper.askForCode(messages);
        try {
            // Iterate over the list of use cases and save them.
            let items = [];
            for (let i in models) {
                let model = models[i];
                let item = note.addToItems({type: 'APackage', json: model});
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

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
        const aformat = AActivity.schema();
        const actionFormat = AAction.schema();

        let messages = [];

        let content = `Use the following Activity definitions for analysis and check for duplicates of the user prompt: ${aformat}`;
        messages.push({role: 'system', content: content});

        let acontent = `Use the following action definition for analysis to add actions to the Activity in the actions field of the Activity: ${actionFormat}`;
        messages.push({role: 'system', content: acontent});
        // Get the current documentation. Add it as system information.
        messages.push({role: 'system',
            content: `From the user prompt identify and generate activities or activities to update.` +
                `Output should be in an array of json objects following the activity definition and Action Definitions. Only return the json.`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        let note = inputs.note;
        if(!note) {
            note = await ANote.create({text: "Generate activities from the prompt: " + inputs.prompt});
        }
        messages.push({ role: 'user', content: note.text });
        let models = await AIHelper.askForCode(messages);
        try {
            // Iterate over the list of use cases and save them.
            let items = [];
            for (let i in models) {
                let model = models[i];
                let item = note.addToItems({type: 'AWorkflow', json: model});
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

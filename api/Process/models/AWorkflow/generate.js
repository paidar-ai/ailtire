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
        const wformat = AWorkflow.schema();
        const aformat = AActivity.schema();

        let messages = [];

        let content = `Use the following workflow definitions for analysis and check for duplicates of the user prompt: ${wformat}`;
        messages.push({role: 'system', content: content});

        let acontent = `Use the following activity definitions for analysis to add activities to the workflow in the activities field of the workflow: ${aformat}`;
        messages.push({role: 'system', content: acontent});
        // Get the current documentation. Add it as system information.
        messages.push({role: 'system',
            content: `From the user prompt identify and generate workflows or workflows to update.` +
                `Output should be in an array of json objects following the workflow definition and Activity Definitions.
                 There should be an activity called Init which is the starting activity of the workflow. Only return the json.`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        let note = inputs.note;
        if(!note) {
            note = await ANote.create({text: "Generate workflows from the prompt: " + inputs.prompt});
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

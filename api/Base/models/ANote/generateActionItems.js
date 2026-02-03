const path = require('path');
const AEvent = require("../../../../src/Server/AEvent");

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

        let notesArray = obj.text.split('\n');
        let chunks = [""];
        let chunkIndex = 0;
        for(let i in notesArray) {
            if(chunks[chunkIndex].length > 20000) {
                chunkIndex++;
                chunks[chunkIndex] = "";
            }
            chunks[chunkIndex] += notesArray[i] + '\n';
        }
        // Create action items from the note coming in.
        // First look at the action items in the current UserActivities
        const actionItemFormat = `
    {
        name: "Action Item Name",
        summary: "Summary of the Action Item",
        description: "Details of the Action Item",
        assignee: "The person who the action item is assigned.",
        reporter: "Who identified the action item.",
        dueDate: "When should the action item be completed.",
    }
    `
        AEvent.emit({event:"generate.actionItems.started", data: { message: "Generating Action Items from Notes"} });
        let actionItemList = [];
        for(let i in chunks) {
            AEvent.emit({event:"generate.actionItems.inprogress", data: { message: `Finding Action Items from Notes: ${(i/chunks.length)*100}%`} });
            let messages = [];
            messages.push({
                role: "system",
                content: `For the user prompt identify all of the action items, the due date and who is responsible. Use the following json format: ${actionItemFormat}`
            });
            messages.push({
                role: "system",
                content: `For the dueDate identify a real date or two weeks from ${new Date()}.`
            });
            if(inputs.prompt) {
                messages.push({role: 'user', content: inputs.prompt});
            }
            messages.push({role: 'user', content: chunks[i]});
            let actionItems = await AIHelper.askForCode(messages);
            for (let i in actionItems) {
                obj.addToItems({type: 'AActionItem', json: actionItems[i]});
            }
        }
        AEvent.emit({event:"generate.actionItems.completed", data: {message: `Generating ${notes.items.length} ActionItems from Notes`} });
        notes.save();
    }
};

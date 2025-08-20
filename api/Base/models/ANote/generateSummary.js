const AIHelper = require("../../../../src/Server/AIHelper");
module.exports = {
    friendlyName: 'generateSummary',
    description: 'Generate a summary of the notes',
    static: false, // True is for Class methods. False is for object based.
    inputs: { },
    outputs: {
            "type": "ANote",
            "description": "The ANote is updated with the summary from the notes",
    },
    exits: {
        json: (obj) => {
            return obj;
        }
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
        AEvent.emit({event:"note.summary.started", data: { message: "Generating Summary from Notes"} });
        let summaries = [];
        for(let i in chunks) {
            AEvent.emit({event:"note.summary.inprogress", data: { message: `Finding Action Items from Notes: ${(i/chunks.length)*100}%`} });
            let messages = [];
            messages.push({
                role: "system",
                content: `For the user prompt generate a summary of the notes and topics discussed. If this is a transcript or meeting notes list the attendees as well.`
            });
            messages.push({role: 'user', content: chunks[i]});
            summaries.push(await AIHelper.ask(messages));
        }
        let summary = "";
        if(summaries.length > 1) {
            // Combine the summaries.
            let messages = [];
            messages.push({
                role: "system",
                content: `For the user prompt combine the summaries into one cohesive summary`
            });
            messages.push({role: 'user', content: summaries.join('\n-----------\n')});
            summary = await AIHelper.ask(messages);
        } else {
            summary = summaries[0];
        }
        obj.summary = summary;
        AEvent.emit({event:"note.summary.completed", data: {obj: { id: obj.id, summary: summary}} });
        obj.save();
        return obj;
    }
};

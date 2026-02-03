module.exports = {
    friendlyName: 'generate',
    description: 'Generate Items in the architecture',
    static: true,
    inputs: {
        prompt: {
            description: 'Prompt used to generate architectural elements',
            type: 'string',
            required: false
        },
        filters: {
            description: 'Filters used to generate architectural elements, This is a comma separated list of filters.',
            type: 'string',
            required: false
        },
        id: {
            description: 'The id of the note',
            type: 'string',
        }
    },
    outputs: {
       type: "ANote",
       description: "Note created by the function call."
    },

    exits: {
        json: (obj)  => { return obj; },
    },

    fn: async function (inputs, env) {
        // Find the scenario from the usecase.
        if(inputs.id) {
            let note = ANote.find({id: inputs.id});
            return await note.generateItems({filters: inputs.filters});
        }
        let note = await ANote.construct({text: inputs.prompt});

        await note.generateItems({prompt: inputs.prompt, filters: inputs.filters});
        return note;
    }
};

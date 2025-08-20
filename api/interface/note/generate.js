module.exports = {
    friendlyName: 'generate',
    description: 'Generate Items in the architecture',
    static: true,
    inputs: {
        prompt: {
            description: 'Prompt used to generate architectural elements',
            type: 'string',
            required: true
        },
        filters: {
            description: 'Filters used to generate architectural elements',
            type: 'string',
            required: false
        }
    },

    exits: {
        json: (obj)  => { return obj; },
    },

    fn: async function (inputs, env) {
        // Find the scenario from the usecase.
        let note = await ANote.construct({text: inputs.prompt});

        let retval = await note.generateItems({filters: inputs.filters});
        return retval;
    }
};

module.exports = {
    friendlyName: 'create',
    description: 'Create a note for the architecture',
    static: true,
    inputs: {
        text: {
            description: 'Text from the note.',
            type: 'string',
            required: true
        },
    },

    exits: {
        json: (obj)  => { return obj; },
    },

    fn: async function (inputs, env) {
        // Find the scenario from the usecase.
        let retval = ANote.construct({text: inputs.text});
        return retval;
    }
};

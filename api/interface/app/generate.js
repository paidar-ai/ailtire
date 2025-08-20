const fs = require("fs");
// const AApplication = require("../../src/Server/AApplication");
module.exports = {
    friendlyName: 'generate',
    description: 'Using Generative AI Generate Items in the architecture based on the prompt',
    static: true,
    inputs: {
        prompt: {
            description: 'Prompt used to generate architectural elements',
            type: 'string',
            required: true
        },
        filters: {
            description: 'Filters used to generate architectural elements, comma separated list of filters.',
            type: 'string',
        }
    },

    exits: {
        json: (obj)  => { return obj; },
    },

    fn: async function (inputs, env) {
        // Find the scenario from the usecase.
        let retval = await AApplication.generateItems(inputs.prompt, inputs.filters, null, env);
        return retval;
    }
};

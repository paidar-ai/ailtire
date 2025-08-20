module.exports = {
    friendlyName: 'generateWorkflows',
    description: 'Generate Workflows',
    static: true,
    inputs: {
        id: {
            description: 'The id of the Actor, if there is not an id a new Actor will be created or one that matches ' +
                'the prompt will be used.',
            type: 'string',
            required: false
        },
        target: {
            description: 'The type of artifact to generate',
            type: 'string',
            required: true
        },
        prompt: {
            description: 'The prompt to use to generate the artifact',
            type: 'string',
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (inputs, env) {
        // Find the scenario from the usecase.
        let retval = AActor.generate(inputs);
        return retval;

        let actor = AActor.get({id: inputs.id});
        switch (inputs.target) {
            case "description":
            case "Description":
                let retval = await actor.generateDescription({prompt: inputs.prompt});
                return retval;
                break;
            case "Documentation":
            case "documentation":
            case "doc":
                return await actor.generateDocumentation({prompt: inputs.prompt});
                break;
            default:
                console.log("Unknown target generation");
                break;
        }
        return false;
    }
};

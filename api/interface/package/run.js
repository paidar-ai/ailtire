module.exports = {
    friendlyName: 'run',
    description: 'Run one service or all services from a package deploy definition.',
    static: true,
    inputs: {
        package: {
            description: 'Name of the package',
            type: 'string',
            required: true
        },
        env: {
            description: 'Deploy environment to use',
            type: 'string',
            required: false
        },
        service: {
            description: 'Specific service name to run. Omit to run all services.',
            type: 'string',
            required: false
        },
        mode: {
            description: 'Execution mode: local or docker',
            type: 'string',
            required: false
        },
        name: {
            description: 'Application name used for runtime variables',
            type: 'string',
            required: false
        },
        composeFile: {
            description: 'Optional compose file path to write or use',
            type: 'string',
            required: false
        },
        detach: {
            description: 'Run docker compose in detached mode',
            type: 'boolean',
            required: false
        },
    },

    exits: {
        json: (obj) => { return obj; },
        success: (obj) => { return obj; },
    },

    fn: async function (inputs, env) {
        return APackage.runService(inputs);
    }
};

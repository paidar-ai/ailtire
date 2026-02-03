module.exports = {
    friendlyName: 'createDev',
    description: 'Create development identities for all actors',
    static: true,
    inputs: {},
    outputs: {
        type: 'array',
        description: 'List of created identities',
        properties: {
            type: 'AIdentity',
            description: 'A single identity'
        }
    },
    exits: {
        json: (obj) => obj
    },
    fn: async function (inputs, env) {
        return await AIdentity.createDevIdentities();
    }
};

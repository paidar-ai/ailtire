class AAgent {
    static definition = {
        name: 'AAgent',
        description: 'An agent that acts on behalf of an identity using a tool.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the agent',
            },
            description: {
                type: 'string',
                description: 'Description of the agent',
            },
            status: {
                type: 'string',
                description: 'Operational status of the agent',
            }
        },
        associations: {
            identity: {
                type: 'AIdentity',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Identity the agent represents',
            },
            tool: {
                type: 'ATool',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Tool the agent uses to act',
            }
        }
    }
}

module.exports = AAgent;

module.exports = {
    friendlyName: 'addMcpServer',
    description: 'Add an MCP server and import tools into a toolbox',
    static: true,
    inputs: {
        toolbox: {
            description: 'Toolbox name or id',
            type: 'string',
            required: true
        },
        serverUrl: {
            description: 'MCP server URL',
            type: 'string',
            required: true
        },
        sessionId: {
            description: 'MCP session id',
            type: 'string',
            required: false
        },
        protocolVersion: {
            description: 'MCP protocol version',
            type: 'string',
            required: false
        },
        createAgents: {
            description: 'Create AAIAgent instances',
            type: 'boolean',
            required: false
        },
        identity: {
            description: 'Identity identifier for created agents',
            type: 'string',
            required: false
        },
        agentProvider: {
            description: 'Agent provider name',
            type: 'string',
            required: false
        },
        agentModel: {
            description: 'Agent model identifier',
            type: 'string',
            required: false
        },
        systemPrompt: {
            description: 'System prompt for created agents',
            type: 'string',
            required: false
        },
        temperature: {
            description: 'Agent temperature',
            type: 'number',
            required: false
        },
        maxTokens: {
            description: 'Agent max tokens',
            type: 'number',
            required: false
        }
    },
    outputs: {
        type: 'json',
        description: 'Import summary',
        properties: {
            toolsAdded: {
                type: 'array',
                description: 'List of tool names imported'
            },
            agentsCreated: {
                type: 'array',
                description: 'List of agent names created'
            }
        }
    },
    exits: {
        json: (obj) => obj
    },
    fn: async function (inputs, env) {
        let toolbox = AToolBox.find({ name: inputs.toolbox }) || AToolBox.find({ id: inputs.toolbox });
        if (!toolbox) {
            throw new AError.NotFound(`Toolbox not found: ${inputs.toolbox}`);
        }
        return await toolbox.addMcpServer({
            serverUrl: inputs.serverUrl,
            sessionId: inputs.sessionId,
            protocolVersion: inputs.protocolVersion,
            createAgents: inputs.createAgents,
            identity: inputs.identity,
            agentProvider: inputs.agentProvider,
            agentModel: inputs.agentModel,
            systemPrompt: inputs.systemPrompt,
            temperature: inputs.temperature,
            maxTokens: inputs.maxTokens
        });
    }
};

const axios = require('axios');

module.exports = {
    friendlyName: 'addMcpServer',
    description: 'Import tools from an MCP server into this toolbox and optionally create AI agents.',
    static: false,
    inputs: {
        serverUrl: {
            type: 'string',
            description: 'MCP server URL (e.g., http://localhost:3000/mcp)',
            required: true
        },
        sessionId: {
            type: 'string',
            description: 'MCP session id header value',
            required: false
        },
        protocolVersion: {
            type: 'string',
            description: 'MCP protocol version',
            required: false
        },
        createAgents: {
            type: 'boolean',
            description: 'Create AAIAgent instances for each imported tool',
            required: false,
            default: false
        },
        identity: {
            type: 'AIdentity',
            description: 'Identity used for created agents',
            required: false
        },
        agentProvider: {
            type: 'string',
            description: 'Provider name for created agents',
            required: false
        },
        agentModel: {
            type: 'string',
            description: 'Model identifier for created agents',
            required: false
        },
        systemPrompt: {
            type: 'string',
            description: 'System prompt for created agents',
            required: false
        },
        temperature: {
            type: 'number',
            description: 'Temperature for created agents',
            required: false
        },
        maxTokens: {
            type: 'number',
            description: 'Max tokens for created agents',
            required: false
        }
    },
    outputs: {
        type: 'json',
        description: 'Import summary { toolsAdded, agentsCreated }'
    },
    exits: {
        json: (obj) => obj,
    },
    fn: async function (obj, inputs, env) {
        const sessionId = inputs.sessionId || 'default-session';
        const protocolVersion = inputs.protocolVersion || '2025-03-26';
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json, text/event-stream',
            'mcp-session-id': sessionId,
        };

        const rpc = async (method, params = {}, id = 1) => {
            const { data } = await axios.post(
                inputs.serverUrl,
                { jsonrpc: '2.0', id, method, params },
                { headers }
            );
            return data;
        };

        const notify = async (method, params = {}) => {
            await axios.post(
                inputs.serverUrl,
                { jsonrpc: '2.0', method, params },
                { headers }
            );
        };

        await rpc(
            'initialize',
            {
                protocolVersion,
                capabilities: { roots: { listChanged: true }, sampling: {} },
                clientInfo: { name: 'Ailtire', version: '1.0.0' },
            },
            1
        );

        await notify('notifications/initialized');

        const toolsResp = await rpc('tools/list', {}, 2);
        console.log(toolsResp);
        const tools = toolsResp?.result?.tools || toolsResp?.tools || [];
        const addedTools = [];
        const createdAgents = [];

        let identity = inputs.identity;
        if (inputs.createAgents && identity && typeof identity === 'string') {
            identity = AIdentity.find({ identifier: identity });
            if (!identity) {
                throw new Error('Identity not found.');
            }
        }

        for (const toolDef of tools) {
            console.log("Adding Tool:", toolDef);
            const localTool = {
                name: toolDef.name,
                description: toolDef.description,
                inputs: toolDef.inputSchema || toolDef.input_schema || toolDef.parameters,
                outputs: toolDef.outputSchema || toolDef.output_schema,
            };
            const toolObj = new ATool(localTool);
            obj.addToTools(toolObj);
            addedTools.push(toolObj.name);

            if (inputs.createAgents) {
                if (!identity) {
                    throw new Error('Identity is required to create agents.');
                }
                const agent = new AAIAgent({
                    name: `${toolDef.name} Agent`,
                    description: `AI agent for MCP tool ${toolDef.name}`,
                    provider: inputs.agentProvider || 'mcp',
                    model: inputs.agentModel,
                    systemPrompt: inputs.systemPrompt,
                    temperature: inputs.temperature,
                    maxTokens: inputs.maxTokens
                });
                agent.identity = identity;
                agent.tool = toolObj;
                obj.addToAgents(agent);
                createdAgents.push(agent.name);
            }
        }

        return {
            toolsAdded: addedTools,
            agentsCreated: createdAgents
        };
    }
};

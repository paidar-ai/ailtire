class AAIAgent {
    static definition = {
        name: 'AAIAgent',
        extends: 'AAgent',
        description: 'An AI-powered agent that uses a model to drive tool use.',
        attributes: {
            provider: {
                type: 'string',
                description: 'AI provider or adaptor name',
            },
            model: {
                type: 'string',
                description: 'Model identifier',
            },
            systemPrompt: {
                type: 'string',
                description: 'System-level instructions for the agent',
            },
            temperature: {
                type: 'number',
                description: 'Sampling temperature for model output',
            },
            maxTokens: {
                type: 'number',
                description: 'Maximum tokens for a single model response',
            }
        },
        associations: {}
    }
}

module.exports = AAIAgent;

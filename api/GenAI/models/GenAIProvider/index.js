class GenAIProvider {
    static definition = {
        name: 'GenAIProvider',
        description: 'Encapsulates LLM provider configuration (credentials, defaults)',
        attributes: {
            name: {
                type: 'string',
                description: 'Provider identifier (e.g. "default", "ailtire", "openai")'
            },
            apiKey: {
                type: 'string',
                description: 'API key or token for that provider'
            },
            defaultModelName: {
                type: 'string',
                description: 'Default model to use if none specified on session'
            },
            url: {
                type: 'string',
                description: 'URL to use if none specified on session'
            },
            adaptorName: {
                type: 'string',
                description: 'Adaptor name to use for this provider'
            }
        },
        statenet: {
            Init: {
                description: 'Provider constructed but not yet initialized',
                events: {
                    init: {Ready: {}}
                }
            },
            Ready: {
                description: 'Provider client initialized and ready for requests'
            }
        }
    };
}

module.exports = GenAIProvider;

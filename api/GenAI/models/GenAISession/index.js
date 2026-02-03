class GenAISession {
    static definition = {
        name: 'GenAISession',
        description: 'Handles a generic AI session over various providers (voice/text/multimodal)',
        attributes: {
            id: {
                type: 'string',
                description: 'Unique identifier for this GenAI session'
            },
            language: {
                type: 'string',
                description: 'Optional language context for prompts'
            },
            providerName: {
                type: 'string',
                description: 'Provider name (e.g. "openai", "ollama", "azure")'
            },
            modelName: {
                type: 'string',
                description: 'Model name (e.g. "gpt-4o-mini")'
            },
            context: {
                type: 'json',
                description: 'Optional context for the session'
            }
        },
        associations: {
            provider: {
                type: 'GenAIProvider',
                composition: false,
                owner: false,
                description: 'Associated provider',
            },
            identity: {
                type: "AIdentity",
                cardinality: 1,
                composition: false,
                owner: false,
            },
            moments: {
                type: "AMoment",
                cardinality: "n",
                composition: false,
                owner: false,
            }
        },
        statenet: {
            Init: {
                description: 'Session object constructed, client not yet initialized',
                events: {
                    initialize: {Initialized: {}}
                }
            },
            Initialized: {
                description: 'Client created and ready to send prompts',
                events: {
                    send: {Sending: {}}
                }
            },
            Sending: {
                description: 'Prompt in flight to provider',
                events: {
                    success: {Completed: {}},
                    failure: {Failed: {}}
                }
            },
            Completed: {
                description: 'Prompt completed successfully'
            },
            Failed: {
                description: 'Prompt failed'
            }
        }
    };
}

module.exports = GenAISession;
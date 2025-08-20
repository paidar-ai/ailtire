// src/Server/AExecutable.js
class AExecutable {
    static definition = {
        name: 'AExecutable',
        description: 'Abstract base for something the engine can invoke: either a concrete Action or a nested Activity.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the executable',
            },
            description: {
                type: 'string',
                description: 'Description of the executable',
            },
            inputs: {
                type: 'json',
                description: 'Input parameters for this executable'
            },
            timeoutMs: {
                type: 'number',
                description: 'Optional max time (ms) before this action is considered failed',
            },
            retryPolicy: {
                type: 'json',
                description: '{ maxAttempts, backoff: "fixed"|"exponential", initialDelayMs } – overrides activity policy if present',
            },
            outputs: {
                type: 'json',
                description: 'Outputs for this executable'
            }
        },
        associations: {}
    }
}

module.exports = AExecutable;
class AActivity {
    static definition = {
        name: 'AActivity',
        extends: "AExecutable",
        description: 'Composite unit of work; fires on triggers, applies policy, then runs a list of sub-steps.',
        attributes: {
            name: {type: 'string', description: 'Unique activity name'},
            description: {type: 'string', description: 'What this activity does'},

            inputs: {type: 'json', description: 'Input parameter definitions'},
            variables: {type: 'json', description: 'Computed variables during execution'},
            outputs: {type: 'json', description: 'Output parameter definitions'},

            onError: {type: 'json', description: 'Called when the Activity moves into an error state. Should follow this format: { description: "...", fn: (obj) => { ... }'},
            onStart: {type: 'json', description: 'Called when the Activity moves into a started state. Should follow this format: { description: "...", fn: (obj) => { ... }'},
            onComplete: {type: 'json', description: 'Called when the Activity moves into a finished state. Should follow this format: { description: "...", fn: (obj) => { ... }'},
        },
        associations: {
            policy: {
                type: 'AActivityPolicy',
                cardinality: 1,
                composition: true,
                owner: true,
                description: 'Retry/timeout/circuit-breaker & concurrency settings'
            },

            // now you can nest both simple Actions or other Activities
            actions: {
                type: 'AExecutable',
                cardinality: 'n',
                composition: true,
                owner: true,
                description: 'Ordered actions: can be AAction, AActivity, or AWorkflow'
            }
        },
    }
}

module.exports = AActivity;
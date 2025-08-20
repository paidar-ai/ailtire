class AAction {
    static definition = {
        name: 'AAction',
        description: 'An atomic operation: service call, script execution, data transformation, or custom function. All defined inside the fn attribute.',
        extends: 'AExecutable',
        attributes: {
            fn: {
                type: 'function',
                description: 'Function to execute',
            }
        },
        associations: {
        },
    }
}

module.exports = AAction;
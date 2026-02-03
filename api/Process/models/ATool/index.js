class ATool {
    static definition = {
        name: 'ATool',
        description: 'Defines an executable tool that performs specific actions in workflows.',
        attributes: {
            name: {
                type: 'string',
                description: 'The name of the tool',
            },
            description: {
                type: 'string',
                description: 'Overview of what the tool does',
            },
            inputs: {
                type: 'json',
                description: 'Parameters required for the operation of the tool',
            },
            outputs: {
                type: 'json',
                description: 'Expected outputs from the tool execution',
            },
            fn: {
                type: 'function',
                description: 'Function to execute the tool’s operation',
            },
        },
        associations: {
            toolbox: {
                type: 'AToolBox',
                cardinality: 'n',
                description: 'A list of toolboxes that the tools can be a part of',
            },
        },
    }
}

module.exports = ATool;
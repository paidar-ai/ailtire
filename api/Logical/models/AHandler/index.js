
class AHandler {
    static definition = {
        name: 'AHandler',
        description: 'This represents an message handler and contains methods and actions to perform when and event is captured.',
        attributes: {
            description: {
                type: "string",
                description: "Description of the event handler",
            },
            fn: {
                type: "function",
                description: "Function that is called to execute the event handler"
            }
        },
        associations: {
            owner: {
                type: 'AHandlers',
                cardinality: 1,
                description: "This is the owner collection of the handler.",
                composition: false,
                owner: false,
                transient: true,
            }
        },
    }
}

module.exports = AHandler;


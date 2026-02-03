
class TDocumentNode {
    static definition = {
        name: 'TDocumentNode',
        description: 'This is the Node of a document and represents the chunking of a document to be used by an LLM',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the document node'
            },
            metadata: {
                type: 'json',
                description: 'Metadata about the document node',
            },
            text: {
                type: 'string',
                description: 'Text of the document node',
            },
        },
        associations: {
            owner: {
                type: 'TDocument',
                cardinality: 1,
                composition: false,
                owner: false,
            },
        },
        /*
        statenet: {
            Init: {
                description: "Initial State"
                events: {
                    create: {
                        StateName: { }
                    }
                }
            },
            StateName: {
                description: "My Description of the state",
                events: {
                    eventName: {
                        StateName: {
                            condition: function(obj) { ... },
                            action: function(obj) { ... },
                        }
                    },
                    eventName2 ...
                }
                actions: {
                    entry: { entry1: function(obj) { ... } },
                    exit: { exit1: function(obj): { ... } }
                }
            }
        }
        */
    }
}

module.exports = TDocumentNode;


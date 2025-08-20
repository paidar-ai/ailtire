/*
statenet: {
    StateName: {
        description: "My Description of the state",
        color: "#aaaaaa",
        events: { // Events that can be handled while in this state.
            eventName: {
                StateName: {
                    // Condition checked after the eventName method is called.
                    condition: {
                        description: "...",
                        action: 'methodname',
                        fn: (obj) => { ... },
                    },
                    action: {
                        description: "...",
                        action: 'methodname',
                        fn: (obj) => { return ... },
                    }
                }
            },
            eventName2 ...
        }
        actions: { // Actions to be performed on the entry and exit of this state.
            entry: { // These actions happen when the state is entered and before any action inside the state.
                     // Including the event action if there is any.
                entry1: {
                    description: "...",
                    action: 'methodname'
                    fn: (obj) => { ... }
                 },
            exit: { // These actions happen when the state is being left. After all other actions.
                exit1:
                    description: "..."
                    action: 'methodname'
                    fn: (obj) => { ... }
                }
                ...
        }
    }
}

Example of Converting a Document.
statenet: {
    Created: {
        description: "My Description of the state",
        color: "#aaaaaa",
        events: { // Events that can be handled while in this state.
            convert: {
                Converting: {
                }
            },
        }
    }
    Converting: {
        events: {
            entry.runConversion: {
                Failed: {
                    condition: {
                        fn: (retval) => { return retval.status === 'Failed'; }
                    }
                }
                Converted: {
                    condition: {
                        fn: (retval) => { return retval.status === 'Successful'; }
                    }
                }
            }
        }
        actions: {
            entry: {
                runConversion: {
                    action: runConversion;
                }
            }
        }
    }
}
*/
class AStateNet {
    static definition = {
        name: 'AStateNet',
        description: 'Statenet definition of a AClass. Includes the state definitions, transitions and actions performed in those states.',
        attributes: {
            description: {
                type: 'string',
                description: 'Description of the State net.',
            }
        },
        associations: {
            states: {
                type: 'AState',
                unique: (obj) => { return obj.name; },
                description: "States in the state net.",
                cardinality: 'n',
                composition: true,
                owner: true,
            },
        },
    }
}

module.exports = AStateNet;


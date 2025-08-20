
class AItem {
    static definition = {
        name: 'AItem',
        description: 'This is an item that is suggested to be created in the architecture.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the item to be created.',
            },
            json: {
                type: 'json',
                description: "JSON representing the item to be creaated."
            },
            type: {
                type: 'string',
                description: "String representing the type of item to be created in the architecture."
            },
            reason: {
                type: "string",
                description: "The reason why a item was rejected or accepted."
            },
            objectID: {
                type: "string",
                description: "The objectID of the item in the architecture."
            }
        },
        associations: {
            note: {
                type: 'ANote',
                cardinality: '1',
                description: 'Note that the item is suggested from.',
                transient: true
            },
        },
        statenet: {
            Init: {
                description: "Initial State",
                events: {
                    create: {
                        Suggested: { }
                    }
                }
            },
            Suggested: {
                description: "The item has been suggested to be created but not created yet.",
                events: {
                    accept: {
                        Accepted: {
                        }
                    },
                    reject: {
                        Rejected: {

                        }
                    }
                }
            },
            Accepted: {
                description: "The Item was accepted and is going to be generated.",
                events: {
                    generate: {
                        Generated: { }
                    },
                    reject: {
                        Rejected: { }
                    }
                },
                actions: {
                    entry: {
                        entry1: (obj) => {
                            obj.note.save();
                            obj.generate();
                        }
                    }
                }
            },
            Rejected: {
                description: "The Item was Rejected and will not be generated.",
                actions: {
                    entry: {
                        entry1: (obj) => {
                            obj.note.save();
                        }
                    }
                }
            },
            Generated: {
                description: "The item suggested is generated.",
                actions: {
                    entry: {
                        entry1: (obj) => {
                            obj.note.save();
                        }
                    }
                }

            }
        }
    }
}

module.exports = AItem;



class ATriggerState {
    static definition = {
        name: 'ATriggerState',
        description: 'This is the state of a trigger in a running workflow.',
        attributes: {
        },
        associations: {
            def: {
                type: 'ATrigger',
                description: 'The trigger that this state is associated with',
                cardinality: 1,
                composition: false,
                owner: false,
                transient: true,
            },
            activity: {
                type: 'AActivityInstance',
                description: 'The activity that this trigger is associated with',
                cardinality: 1,
                composition: false,
                transient: true,
            }
        },
        statenet: {
            Init: {
                description: "Initial State",
                events: {
                    create: {
                        UnEvaluated: { }
                    }
                }
            },
            UnEvaluated: {
                description: "The Trigger has not yet been evaluated",
                events: {
                    eval: {
                        Passed: {
                            condition: function(obj, value) { return value; },
                        },
                        Failed: {
                            condition: function(obj, value) { return !value; },
                        }
                    },
                },
            },
            Passed: {
                description: "The Trigger has passed the evaluation",
            },
            Failed: {
                description: "The Trigger has Failed the evaluation",
                events: {
                    eval: {
                        Passed: {
                            condition: function(obj, value) { return value; },
                        },
                        Failed: {
                            condition: function(obj, value) { return !value; },
                        }
                    }
                }
            }
        }
    }
}

module.exports = ATriggerState;


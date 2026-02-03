
class ATransition {
    static definition = {
        name: 'ATransition',
        description: 'The transition from one state to another state based on a triggering event.',
        attributes: {
            description: {
                type: 'string',
                description: 'Description of the transition and the triggering event',
            },
            name: {
                type: 'string',
                description: 'Name of the transition. This is the name of the state to transition.',
                required: true,
            },
            eventName: {
                type: 'string',
                description: 'Name of the event that triggers the transition.',
                required: true,
            }
        },
        associations: {
            condition: {
                type: "ACondition",
                description: "Condition for the transition to fire and move",
                cardinality: '1',
                composition: true,
                owner: true
            },
            fromState: {
                type: 'AState',
                description: "From State of the transition",
                cardinality: 1,
                composition: false,
                owner: false,
            },
            toState: {
                type: 'AState',
                description: "To State of the transition",
                cardinality: 1,
                composition: false,
                owner: false,
            },
            action: {
                type: 'AStateAction',
                description: "Action to be performed when the transition is fired",
                cardinality: 1,
                composition: true,
                owner: true,
            }
        },
    }
}

module.exports = ATransition;


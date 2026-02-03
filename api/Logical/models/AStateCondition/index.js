
class AStateCondition {
    static definition = {
        name: 'AStateCondition',
        description: 'A condition to be met for a transition in a state net',
        attributes: {
            description: {
                type: 'string',
                description: 'Description of the condition for the state transition',
            },
            fn: {
                type: 'function',
                description: 'Function to be used to check the condition. Should return true for the transition to happen. false to block the transition',
            }
        },
        associations: {
        },
    }
}

module.exports = AStateCondition;


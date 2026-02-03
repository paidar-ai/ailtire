
class AStateAction {
    static definition = {
        name: 'AStateAction',
        description: 'This is an action performed with respect to a State either during a transition or on entry or exit of a state',
        attributes: {
            name: {
                type: 'name',
                description: "Name of the state action.",
            },
            description: {
                type: 'string',
                description: 'Description of the action',
            },
            fn: {
                type: 'function',
                description: 'Function that is called to execute the action',
            },
        },
        associations: {
        },
    }
}

module.exports = AStateAction;


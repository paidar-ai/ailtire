class APolicyRule {
    static definition = {
        "name": "APolicyRule",
        "attributes": {
            "name": {
                "type": "string",
                "description": "Name of the rule",
            },
            description: {
                "type": "string",
                "description": "Description of the rule",
            },
            fn: {
                "type": "function",
                "description": "Function that defines the rule, The parameters to the function are: (actor, action, object) " +
                    "Where actor is the actor that is trying to perform the action, action is the action that is being performed, object is the object that is being acted upon.",
            }
        },
        "associations": {
            "parent": {
                "type": "APolicy",
                description: 'The parent policy',
            }
        }
    }
}

module.exports = APolicyRule;
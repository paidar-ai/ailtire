class APolicy {
    static definition = {
        name: "APolicy",
        description: 'APolicy allows the developer to define a policy for communication with other systems.',
        attributes: {
            name: {
                "type": "string",
                "description": "Unique policy name",
            },
            description: {
                "type": "string",
                "description": "Description of the policy",
            },
            appliesTo: {
                "type": "array",
                "description": "This is a list of interfaces that this policy applies to. The list should follow the " +
                    "format: [ '/actor/list', '/actor/*', '*/list', '*' ] where the asterisk means all. And the list " +
                    "is a list of interfaces.",
            }
        },
        associations: {
            rules: {
                "type": "APolicyRule",
                "cardinality": "n",
                description: 'List of rules that define the policy. the order they are listed is the order they are evaluated.',
                composition: true,
                owner: true
            }
        },
        "statenet": { }
    }
}

module.exports = APolicy;
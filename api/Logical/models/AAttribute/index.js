
class AAttribute {
    static definition = {
        name: 'AAttribute',
        description: 'This represents an attribute of the Class',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the attribute',
            },
            type: {
                type: 'string',
                description: 'One of the fundamental types (string, number, boolean)',
            },
            description: {
                type: 'string',
                description: 'Description of the attribute',
            },
            transient: {
                type: 'boolean',
                description: 'True if the attribute is not stored presistently',
            },
            parent: {
                type: 'json',
                description: 'This represents the owning class of the attribute',
            }
        },
        associations: {
        },
    }
}

module.exports = AAttribute;


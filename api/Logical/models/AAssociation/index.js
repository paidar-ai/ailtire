
class AAssociation {
    static definition = {
        name: 'AAssociation',
        description: 'This represents an association between to classes.',
        attributes: {
            type: {
                type: 'string',
                description: 'The Class of the association',
            },
            cardinality: {
                type: 'string',
                description: 'The Cardinality of the association. n or 1',
            },
            composition: {
                type: 'boolean',
                description: 'Composition means that the association is an aggregation. It helps with the object managment. If there is composition then the objects in this association cannot exist without the parent',
            },
            owner: {
                type: 'boolean',
                description: "If true then this object owns the relationship. This is helpful for lifecycle management."
            },
            via: {
                type: 'string',
                description: "Automatically creates the back link in the associated object. This handles the traversing of the graph as well.",
            },
            transient: {
                type: "boolean",
                description: "True if the attribute is not stored presistently",
            },
            description: {
                type: 'string',
                description: 'Description of the attribute',
            }
        },
        associations: {
            owner: {
                type: 'AClass',
                description: "The owner of the relationship",
                cardinality: "1",
            },
        },
    }
}

module.exports = AAssociation;



class AClass {
    static definition = {
        name: 'AClass',
        description: 'This represents a class in the architecture',
        unique: (obj) => { return obj.name; },
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the class',
            },
            description: {
                type: 'string',
                description: 'Description of the class',
            },
            extends: {
                type: 'string',
                description: 'Extends another class in the architecture. This is used for inheritance.',
            },
            unique: {
                type: 'function',
                description: 'Function that is called to create a unique id for the class. This enforces a unique instance of the class.',
            },
            state: {
                type: 'string',
                description: 'Current state of the class',
            },
            uid: {
                type: "string",
                description: "Unique ID for the Class includes the Package unique ID",
            }
        },
        associations: {
            attributes: {
                unique: (obj) => { return obj.name; },
                type: 'AAttribute',
                description: 'Attributes for the class',
                cardinality: 'n',
                owner: true,
                composition: true,
                via: "owner",
            },
            associations: {
                unique: (obj) => { return obj.name; },
                type: 'AAssociation',
                description: 'Association for the class',
                cardinality: 'n',
                owner: true,
                composition: true,
                via: "owner",
            },
            methods: {
                unique: (obj) => { return obj.name; },
                type: 'AMethod',
                description: 'Methods for the class',
                cardinality: 'n',
                owner: true,
                composition: true,
                via: "owner",
            },
            statenet: {
                type: 'AStateNet',
                cardinality: "1",
                owner: true,
                composition: true,
                description: 'StateNet for the class',
                via: "owner",
            }
        },
    }
}

module.exports = AClass;
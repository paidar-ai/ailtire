
class AApplication {
    static definition = {
        name: 'AApplication',
        description: 'This represents the application',
        attributes: {
            name: {
                type: 'string',
                description: 'The name of the application',
            },
            description: {
                type: 'string',
                description: 'The description of the application',
            },
        },
        associations: {
            classes: {
                type: 'AClass',
                description: "The owner of the relationship",
                cardinality: "n",
            },
            packages: {
                type: 'APackage',
                description: "The owner of the relationship",
                cardinality: "n",
            },
            "actors": {
                type: 'AActor',
                description: "The actors of the relationship",
                cardinality: "n",
            },
            "interfaces": {
                type: 'AInterface',
                description: "The interfaces of the relationship",
                cardinality: "n",
            }
        },
    }
}

module.exports = AApplication;
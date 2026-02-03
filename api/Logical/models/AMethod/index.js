
class AMethod {
    static definition = {
        name: 'AMethod',
        description: 'This is a method of a class',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the method',
            },
            friendlyName: {
                type: 'string',
                description: 'Friendly name of the method',
            },
            inputs: {
                type: 'json',
                description: 'Inputs of the method',
            },
            outputs: {
                type: 'json',
                description: 'Inputs of the method',
            },
            exits: {
                type: 'json',
                description: 'Exits of the method',
            },
            fn: {
                type: 'function',
                description: 'Function that is called to execute the method',
            },
            uid: {
                type: "string",
                description: "Unique Identification includes owning model uid."
            },
            static: {
                type: "boolean",
                description: "True if the method is static"
            }
        },
        associations: {
            owner: {
                type: 'ref',
                cardinality: 1,
                composition: false,
                owner: false,
                transient: true,
            },
        },
    }
}

module.exports = AMethod;


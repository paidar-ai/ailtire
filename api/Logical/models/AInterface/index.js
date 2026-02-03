
class AInterface {
    static definition = {
        name: 'AInterface',
        description: 'This is an interface of the package.',
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
                description: 'Outputs of the method',
            },
            exits: {
                type: 'json',
                description: 'Exits of the method',
            },
            fn: {
                type: 'function',
                description: 'Function that is called to execute the method',
            },
            path: {
                type: 'string',
                description: 'Path of the interface',
                required: true,
            }
        },
        associations: {
            owner: {
                type: 'APackage',
                cardinality: '1',
                composition: false,
                owner: false,
                transient: true,
            },
        },
    }
}

module.exports = AInterface;


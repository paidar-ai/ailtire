
class APackage {
    static definition = {
        name: 'APackage',
        description: 'This represents a Package in the logical layer and contains the classes, interface, handlers, for the package',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the package',
            },
            shortname: {
                type: 'string',
                description: 'Nickname or short name of the package',
            },
            description: {
                type: 'string',
                description: 'Description of the package',
            },
            color: {
                type: 'string',
                description: 'Color of the package',
            },
            uid: {
                type: 'string',
                description: "Unique ID for the package includes parent package uid."
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
            classes: {
                type: 'AClass',
                unique: (obj) => { return obj.name; },
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            handlers: {
                type: 'AHandlers',
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            interfaces: {
                unique: (obj) => { return obj.path; },
                type: 'AInterface',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: "owner",
            },
            usecases: {
                type: "AUseCase",
                unique: (obj) => { return obj.name; },
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            workflows: {
                type: 'AWorkflow',
                unique: (obj) => { return obj.name; },
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            subpackages: {
                type: 'APackage',
                unique: (obj) => { return obj.name; },
                cardinality: 'n',
                composition: true,
                owner: true,
                via: "owner",
            }
        },
    }
}

module.exports = APackage;


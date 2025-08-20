
class AUseCase {
    static definition = {
        name: 'AUseCase',
        description: 'UseCase of the system. Including the name, actors and description.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the use case',
            },
            description: {
                type: 'string',
                description: "Description of the use case.",
            },
            actors: {
                type: 'json',
                description: 'Contains the actor name and how it uses the use case. {actor: "uses"',
            },
            dir: {
                type: 'string',
                description: 'Directory of the use case',
                transient: true,
            }
        },
        associations: {
            includes: {
                type: 'AUseCase',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            extends: {
                type: 'AUseCase',
                cardinality: 'n',
                composition: false,
                owner: false
            },
            owner: {
                type: 'APackage',
                cardinality: 1,
                composition: false,
                transient: true,
            },
            scenarios: {
                type: 'AScenario',
                cardinality: 'n',
                owner: true,
                composition: true,
            }
        },
    }
}

module.exports = AUseCase;


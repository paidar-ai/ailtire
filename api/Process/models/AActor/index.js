
class AActor {
    static definition = {
        name: 'AActor',
        description: 'This represents an actor of the system.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the actor',
            },
            shortname: {
                type: 'string',
                description: 'Shortname of the actor',
            },
            description: {
                type: 'string',
                description: 'Description of the actor',
            },
            doc: {
                type: 'json',
                description: 'Documentation of the actor',
            }
        },
        associations: {
            workflows: {
                type: 'AWorkflow',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            usecases: {
                type: 'AUseCase',
                cardinality: 'n',
                owner: false,
                composition: false,
            },
            activities: {
                type: 'AActivity',
                cardinality: 'n',
                owner: false,
                composition: false,
            },
            scenarios: {
                type: 'AScenario',
                cardinality: 'n',
                owner: false,
                composition: false,
            }
        },
    }
}

module.exports = AActor;


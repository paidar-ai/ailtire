
class AScenario {
    static definition = {
        name: 'AScenario',
        description: 'Scenario shows how an actor interacts with the system including the steps.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the scenario',
            },
            when: {
                type: 'string',
                description: 'When the scenario is executed',
            },
            then: {
                type: 'string',
                description: 'Then the scenario is executed',
            },
            given: {
                type: 'string',
                description: 'Given the scenario is executed',
            },
            description: {
                type: 'string',
                description: 'Description of the scenario',
            },
            actors: {
                type: 'json',
                description: 'List of actors that this scenario uses, {actor: "uses the system", ... }',
            },
            uid: {
                type: 'string',
                description: 'Unique ID of the scenario',
            }
        },
        associations: {
            steps: {
                type: 'AStep',
                description: 'List of steps that this scenario uses',
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            owner: {
                type: 'AUseCase',
                cardinality: 1,
                composition: false,
                transient: true,
            }
        },
    }
}

module.exports = AScenario;
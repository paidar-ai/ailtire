class AHint {
    static definition = {
        name: 'AGuidance',
        description: 'A named grouping of hints (AHint) for an Actor and UseCase, The guidance helps ' +
            'guide the user in the right direction by providing a set of hints to help the user' +
            'accomplish the goal of the actor or usecases.',
        attributes: {
            id: {type: 'string', description: 'Guidance identifier.'},
            description: {type: 'string', description: 'Human-readable description of the guidance.'},
            goal: {type:"string", description: "Human-readable goal of the guidance."},
        },
        associations: {
            owner: {
                type: 'AClass',
                description: 'This can be any element in the architecture that has a goal. This could ba an actor, ' +
                    'usecase, scenario, class.',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            hints: {
                type: 'AHint',
                description: 'Hints/defaults emitted from Practice back into UseCases/Scenarios.',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: 'guidance'
            }
        }
    }
}

module.exports = AHint;
class AGuidance {
    static definition = {
        name: 'AGuidance',
        description: 'A named grouping of hints (AHint) for an Actor and UseCase, The guidance helps ' +
            'guide the user in the right direction by providing a set of hints to help the user' +
            'accomplish the goal of the actor or usecases.',
        attributes: {
            id: {type: 'string', description: 'Guidance identifier.'},
            title: {type: 'string', description: 'Short, human-friendly title for the guidance.'},
            goal: {type:"string", description: "Human-readable goal of the guidance."},
            scope: {type: 'json', description: 'Scope or context for the guidance (team, project, topic).'},
            deliverables: {type: 'json', description: 'Structured outputs to produce (whitepaper, lectures, slides, blogs).'},
            workflow: {type: 'json', description: 'Ordered stages or steps for producing deliverables.'},
            constraints: {type: 'json', description: 'Constraints for the guidance (counts, limits, bounds).'},
            assignment: {type: 'json', description: 'Assignee and routing information for automated workflows.'},
            channels: {type: 'json', description: 'Notification and response channels.'},
            metadata: {type: 'json', description: 'Extension point for guidance-specific metadata.'},
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

module.exports = AGuidance;

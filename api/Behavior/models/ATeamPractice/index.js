class ATeamPractice {
    static definition = {
        name: 'ATeamPractice',
        description: 'Aggregated shared know-how for a team (patterns, guardrails, hints).',
        attributes: {
            guardrails: {
                type: 'string',
                description: 'Do/Don’t norms derived from evidence.'
            },
            principles: {
                type: 'string',
                description: 'Team principles and operating guidelines.'
            },
            metadata: {
                type: 'json',
                description: 'Additional practice metadata'
            }
        },
        associations: {
            team: {
                type: 'ATeam',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Team this practice belongs to'
            },
            hints: {
                type: 'AHint',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: 'practice',
                description: 'Hints derived for the team'
            }
        }
    }
}

module.exports = ATeamPractice;

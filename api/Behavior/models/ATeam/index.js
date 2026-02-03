class ATeam {
    static definition = {
        name: 'ATeam',
        description: 'A group of identities coordinating to act as a team.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the team'
            },
            description: {
                type: 'string',
                description: 'Description of the team'
            },
            goal: {
                type: 'string',
                description: 'Human-readable goal or mission of the team'
            }
        },
        associations: {
            toolbox: {
                type: 'AToolBox',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Primary toolbox used by this team'
            },
            members: {
                type: 'ATeamMember',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: 'team',
                description: 'Members of this team with their assigned roles'
            },
            guidance: {
                type: 'AGuidance',
                cardinality: 'n',
                composition: false,
                via: 'owner',
                description: 'Guidance owned by this team'
            },
            practice: {
                type: 'ATeamPractice',
                cardinality: 1,
                composition: true,
                owner: true,
                via: 'team',
                description: 'Aggregated practice knowledge for the team'
            },
            actors: {
                type: 'AActor',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Actors the team can assume or coordinate as'
            },
            moments: {
                type: 'AMoment',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Interaction moments captured for the team'
            },
            insights: {
                type: 'AInsight',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Derived insights for the team'
            },
            resources: {
                type: 'AResource',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Resources the team uses to do work'
            }
        }
    }
}

module.exports = ATeam;

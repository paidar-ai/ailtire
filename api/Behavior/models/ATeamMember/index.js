class ATeamMember {
    static definition = {
        name: 'ATeamMember',
        description: 'A membership record linking an identity to a team with a role.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of this team membership record'
            },
            title: {
                type: 'string',
                description: 'Optional title for this team member'
            },
            description: {
                type: 'string',
                description: 'Description of the member responsibilities'
            }
        },
        associations: {
            team: {
                type: 'ATeam',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Team this member belongs to'
            },
            identity: {
                type: 'AIdentity',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Identity represented by this member'
            },
            role: {
                type: 'ARole',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Role for this member within the team'
            }
        }
    }
}

module.exports = ATeamMember;

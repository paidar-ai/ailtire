module.exports = {
    friendlyName: 'addMember',
    description: 'Add a member to a team',
    static: true,
    inputs: {
        team: {
            description: 'Team name or id',
            type: 'string',
            required: true
        },
        identity: {
            description: 'Identity identifier or id',
            type: 'string',
            required: true
        },
        role: {
            description: 'Role name',
            type: 'string',
            required: false
        },
        title: {
            description: 'Member title',
            type: 'string',
            required: false
        },
        description: {
            description: 'Member responsibilities',
            type: 'string',
            required: false
        }
    },
    outputs: {
        type: 'ATeamMember',
        description: 'The created team member record'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        let team = ATeam.find({ name: inputs.team }) || ATeam.find({ id: inputs.team });
        if (!team) {
            throw new AError.NotFound(`Team not found: ${inputs.team}`);
        }
        return team.addMember({
            identity: inputs.identity,
            role: inputs.role,
            title: inputs.title,
            description: inputs.description
        });
    }
};

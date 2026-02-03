module.exports = {
    friendlyName: 'addGuidance',
    description: 'Add guidance to a team',
    static: true,
    inputs: {
        team: {
            description: 'Team name or id',
            type: 'string',
            required: true
        },
        id: {
            description: 'Guidance identifier',
            type: 'string',
            required: false
        },
        description: {
            description: 'Guidance description',
            type: 'string',
            required: false
        },
        goal: {
            description: 'Guidance goal',
            type: 'string',
            required: false
        }
    },
    outputs: {
        type: 'ATeam',
        description: 'The updated team'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        let team = ATeam.find({ name: inputs.team }) || ATeam.find({ id: inputs.team });
        if (!team) {
            throw new AError.NotFound(`Team not found: ${inputs.team}`);
        }
        let guidance = null;
        if (inputs.id) {
            guidance = AGuidance.find({ id: inputs.id });
        }
        if (guidance) {
            return team.addGuidance({ guidance: guidance });
        }
        return team.addGuidance({
            id: inputs.id,
            description: inputs.description,
            goal: inputs.goal
        });
    }
};

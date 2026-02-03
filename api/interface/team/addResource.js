module.exports = {
    friendlyName: 'addResource',
    description: 'Add a resource to a team',
    static: true,
    inputs: {
        team: {
            description: 'Team name or id',
            type: 'string',
            required: true
        },
        name: {
            description: 'Resource name',
            type: 'string',
            required: true
        },
        description: {
            description: 'Resource description',
            type: 'string',
            required: false
        },
        type: {
            description: 'Resource type',
            type: 'string',
            required: false
        },
        metadata: {
            description: 'Resource metadata',
            type: 'json',
            required: false
        },
        url: {
            description: 'Resource URL',
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
        return team.addResource({
            name: inputs.name,
            description: inputs.description,
            type: inputs.type,
            metadata: inputs.metadata,
            url: inputs.url
        });
    }
};

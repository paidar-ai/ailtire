module.exports = {
    friendlyName: 'get',
    description: 'Get a team',
    static: true,
    inputs: {
        id: {
            description: 'Team name or id',
            type: 'string',
            required: true
        }
    },
    outputs: {
        type: 'ATeam',
        description: 'The requested team'
    },
    exits: {
        json: (obj) => obj,
        notFound: (err) => err.message
    },
    fn: function (inputs, env) {
        let team = ATeam.find({ name: inputs.id }) || ATeam.find({ id: inputs.id });
        if (!team) {
            throw new AError.NotFound(`Team not found: ${inputs.id}`);
        }
        return team;
    }
};

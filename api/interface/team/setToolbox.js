module.exports = {
    friendlyName: 'setToolbox',
    description: 'Set a team toolbox',
    static: true,
    inputs: {
        team: {
            description: 'Team name or id',
            type: 'string',
            required: true
        },
        toolbox: {
            description: 'Toolbox name or id',
            type: 'string',
            required: true
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
        let toolbox = AToolBox.find({ name: inputs.toolbox }) || AToolBox.find({ id: inputs.toolbox });
        if (!toolbox) {
            throw new AError.NotFound(`Toolbox not found: ${inputs.toolbox}`);
        }
        return team.setToolbox({ toolbox: toolbox });
    }
};

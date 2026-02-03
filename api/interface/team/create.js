module.exports = {
    friendlyName: 'create',
    description: 'Create a team',
    static: true,
    inputs: {
        name: {
            description: 'Name of the team',
            type: 'string',
            required: true
        },
        description: {
            description: 'Description of the team',
            type: 'string',
            required: false
        },
        goal: {
            description: 'Goal or mission of the team',
            type: 'string',
            required: false
        },
        toolbox: {
            description: 'Toolbox to associate with the team',
            type: 'AToolBox',
            required: false
        }
    },
    outputs: {
        type: 'ATeam',
        description: 'The created team'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        let toolbox = inputs.toolbox;
        if (toolbox && typeof toolbox === 'string') {
            toolbox = AToolBox.find({ name: toolbox }) || AToolBox.find({ id: toolbox });
        }
        let team = new ATeam({
            name: inputs.name,
            description: inputs.description,
            goal: inputs.goal
        });
        team.create({ name: inputs.name, description: inputs.description, goal: inputs.goal, toolbox: toolbox });
        return team;
    }
};

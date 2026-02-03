module.exports = {
    friendlyName: 'create',
    description: 'Create a team',
    static: false,
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
            description: 'Toolbox for the team',
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
    fn: function (obj, inputs, env) {
        obj.name = inputs.name;
        obj.description = inputs.description;
        obj.goal = inputs.goal;
        if (inputs.toolbox) {
            obj.toolbox = inputs.toolbox;
        }
        return obj;
    }
};

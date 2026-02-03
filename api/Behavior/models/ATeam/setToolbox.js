module.exports = {
    friendlyName: 'setToolbox',
    description: 'Set the toolbox for this team',
    static: false,
    inputs: {
        toolbox: {
            type: 'AToolBox',
            description: 'Toolbox to associate with the team',
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
    fn: function (obj, inputs, env) {
        obj.toolbox = inputs.toolbox;
        return obj;
    }
};

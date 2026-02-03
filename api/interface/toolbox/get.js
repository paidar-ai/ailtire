module.exports = {
    friendlyName: 'get',
    description: 'Get a toolbox',
    static: true,
    inputs: {
        id: {
            description: 'Toolbox name or id',
            type: 'string',
            required: true
        }
    },
    outputs: {
        type: 'AToolBox',
        description: 'The requested toolbox'
    },
    exits: {
        json: (obj) => obj,
        notFound: (err) => err.message
    },
    fn: function (inputs, env) {
        let toolbox = AToolBox.find({ name: inputs.id }) || AToolBox.find({ id: inputs.id });
        if (!toolbox) {
            throw new AError.NotFound(`Toolbox not found: ${inputs.id}`);
        }
        return toolbox;
    }
};

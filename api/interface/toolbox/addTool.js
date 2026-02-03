module.exports = {
    friendlyName: 'addTool',
    description: 'Add a tool to a toolbox',
    static: true,
    inputs: {
        toolbox: {
            description: 'Toolbox name or id',
            type: 'string',
            required: true
        },
        name: {
            description: 'Tool name',
            type: 'string',
            required: true
        },
        description: {
            description: 'Tool description',
            type: 'string',
            required: false
        },
        inputs: {
            description: 'Tool input schema',
            type: 'json',
            required: false
        },
        outputs: {
            description: 'Tool output schema',
            type: 'json',
            required: false
        }
    },
    outputs: {
        type: 'AToolBox',
        description: 'The updated toolbox'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (inputs, env) {
        let toolbox = AToolBox.find({ name: inputs.toolbox }) || AToolBox.find({ id: inputs.toolbox });
        if (!toolbox) {
            throw new AError.NotFound(`Toolbox not found: ${inputs.toolbox}`);
        }
        return toolbox.addTool({
            name: inputs.name,
            description: inputs.description,
            inputs: inputs.inputs,
            outputs: inputs.outputs
        });
    }
};

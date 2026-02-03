module.exports = {
    friendlyName: 'addTool',
    description: 'Add a tool to the toolbox',
    static: false,
    inputs: {
        tool: {
            type: 'ATool',
            description: 'Existing tool instance to add',
            required: false
        },
        toolDef: {
            type: 'json',
            description: 'Tool definition to construct and add',
            required: false
        },
        name: {
            type: 'string',
            description: 'Tool name (used if toolDef is not provided)',
            required: false
        },
        description: {
            type: 'string',
            description: 'Tool description (used if toolDef is not provided)',
            required: false
        },
        inputs: {
            type: 'json',
            description: 'Tool input schema (used if toolDef is not provided)',
            required: false
        },
        outputs: {
            type: 'json',
            description: 'Tool output schema (used if toolDef is not provided)',
            required: false
        },
        fn: {
            type: 'function',
            description: 'Tool function (used if toolDef is not provided)',
            required: false
        }
    },
    outputs: {
        type: 'AToolBox',
        description: 'The toolbox with the tool added'
    },
    exits: {
        json: (obj) => obj,
    },
    fn: function (obj, inputs, env) {
        let toolObj = inputs.tool;
        if (!toolObj) {
            let toolDef = inputs.toolDef;
            if (!toolDef) {
                toolDef = {
                    name: inputs.name,
                    description: inputs.description,
                    inputs: inputs.inputs,
                    outputs: inputs.outputs,
                    fn: inputs.fn
                };
            }
            if (toolDef && toolDef.name) {
                obj.addToTools({ type: 'ATool', json: toolDef });
            } else {
                throw new Error('No tool provided to add.');
            }
        } else {
            obj.addToTools(toolObj);
        }
        return obj;
    }
};

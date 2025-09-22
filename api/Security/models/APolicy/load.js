const fs = require('fs');

module.exports = {
    friendlyName: 'loadPolicy',
    description: 'Load a single policy by name',
    static: true,
    inputs: {
        file: {
            type: 'string',
            required: true,
            description: 'Full path to the policy index.js file'
        }
    },
    outputs: {
        type: 'APolicy',
        description: 'The loaded policy'
    },
    exits: {},
    fn: function (inputs, env) {
        if (!fs.existsSync(inputs.file)) {
            throw new global.AppError.NotFound(`Policy file not found: ${inputs.file}`);
        }
        const def = require(inputs.file);
        const attr = {};
        for (let i in APolicy.definition.attributes) {
            if (def.hasOwnProperty(i)) {
                attr[i] = def[i];
            }
        }
        let retval = new APolicy(attr);
        for (let i in def.rules) {
            let rule = APolicyRule.load({def: def.rules[i]});
            retval.addToRules(rule);
        }
        return retval;
    }
};

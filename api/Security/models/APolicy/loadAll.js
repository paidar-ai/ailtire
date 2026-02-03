const fs = require('fs');
const path = require('path');
const APolicy = require('./index');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all policies from a directory',
    static: true,
    inputs: {
        dir: {
            type: 'string',
            required: true,
            description: 'Directory containing one subfolder per policy'
        }
    },
    exits: {success: {}},
    fn: function (inputs, env) {
        const policies = {};
        for (const name of fs.readdirSync(inputs.dir)) {
            const policyDir = path.join(inputs.dir, name);
            const file = path.join(policyDir, 'index.js');
            if (fs.statSync(policyDir).isDirectory() && fs.existsSync(file)) {
                policies[name] = APolicy.load({file: file});
            }
        }
        global.policies = policies;
        return policies;
    }
};

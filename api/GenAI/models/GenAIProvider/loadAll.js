const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    "input1": {
        "type": "string",
        "description": "MY Description of the input",
        "required": false
    }
},
    outputs: {
    "retval": {
        "type": "string",
        "description": "My Return Value"
    }
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.

        const dir = path.resolve(
            global.ailtire.config.baseDir,
            `.ailtire/GenAIProvider/`
        );

        // If directory doesn't exist, return empty array
        if (!fs.existsSync(dir)) {
            return;
        }

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        for(let i in files) {
            let provider = GenAIProvider.load({fileName: path.resolve(dir, files[i])});
        }
        return await GenAIProvider.instances();
    }
};

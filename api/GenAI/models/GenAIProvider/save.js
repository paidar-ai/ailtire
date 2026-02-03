const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
    description: 'Save the GenAIProvider to the .ailtire/GenAIProvider/',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        "retval": {
            "type": "GenAIProvider",
            "description": "GenAIProvider saved"
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        let json = {};
        for (let i in obj._attributes) {
            if (obj._attributes[i][0] !== "_") {
                json[i] = obj._attributes[i];
            }
        }
        let dir = path.resolve(global.ailtire.config.baseDir, `.ailtire/GenAIProvider/`);
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.resolve(global.ailtire.config.baseDir, `.ailtire/GenAIProvider/${obj.name}.json`), JSON.stringify(json, null, 2));
        return obj;
    }
};

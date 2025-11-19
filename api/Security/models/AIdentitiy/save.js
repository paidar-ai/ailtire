const path = require('path');
const fs = require('fs');
const keytar = require('keytar');
const SERVICE = 'ailtire';

module.exports = {
    friendlyName: 'save',
    description: 'Save the AIdentity',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
            "type": "AIdentity",
            "description": "The AIdentity from the file object stored.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let dir = path.resolve(global.ailtire.config?.baseDir || global.ailtire.config;.baseDir, ".database", "AIdentity");
        let filename = path.resolve(dir, `${obj.identifier}.json`);
        fs.mkdirSync(dir, { recursive: true });
        let def = {};
        for(let aname in obj._attributes) {
            if(aname !== 'secretHash') {
                def[aname] = obj._attributes[aname];
            } else {
                await keytar.setPassword(SERVICE, obj.identifier, obj.secretHash);
            }
        }
        fs.writeFileSync(filename, JSON.stringify(def, null, 2), 'utf8');

        return obj;
    }
};

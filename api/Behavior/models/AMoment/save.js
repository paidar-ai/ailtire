const fs = require('fs');
const keytar = require('keytar');
const SERVICE = 'ailtire';

module.exports = {
    friendlyName: 'save',
    description: 'Save the moment in the Moment directory.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
            "type": "AMoment",
            "description": "The AMoment from the file object stored.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let identity = obj.identity;
        let id = identity.id;
        let dir = path.resolve(global.ailtire.config?.baseDir || global.ailtire.config.baseDir, ".database", "AMoment", id);

        let filename = path.resolve(dir, `${obj.id}.json`);
        fs.mkdirSync(dir, { recursive: true });
        let def = {};
        for(let aname in obj._attributes) {
            def[aname] = obj._attributes[aname];
        }
        fs.writeFileSync(filename, JSON.stringify(def, null, 2), 'utf8');

        return obj;
    }
};

const path = require('path');
const fs = require('fs');
const keytar = require('keytar');
const SERVICE = 'ailtire';

module.exports = {
    friendlyName: 'save',
    description: 'Save the insight in the database directory.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
        "type": "AInsight",
        "description": "The AInsight from the file object stored.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let id = obj.id;

        let dir = path.resolve(
            global.ailtire.config?.baseDir || global.ailtire.config.baseDir,
            ".database",
            "AInsight"
        );

        let filename = path.resolve(dir, `${id}.json`);
        fs.mkdirSync(dir, { recursive: true });

        let def = {};
        for (let aname in obj._attributes) {
            def[aname] = obj._attributes[aname];
        }

        fs.writeFileSync(filename, JSON.stringify(def, null, 2), 'utf8');

        return obj;
    }
};

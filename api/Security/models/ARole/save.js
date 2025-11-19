const fs = require('fs');
const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Save a role definition to disk',
    static: false,
    inputs: {},
    outputs: {
        "type": "ARole",
        "description": "The saved role",
    },
    exits: {},

    fn: function (inputs) {
        const def = obj._attributes;
        let dir = obj.dir || path.resolve(ailtire.config.baseDir || ailtire.config;.baseDir, "security", "roles", obj.name.replace(/ /g, ''));

        fs.mkdirSync(dir, {recursive: true});
        const filePath = path.join(dir, `index.js`);
        const out = `module.exports = ${JSON.stringify(def, null, 2)};`;
        fs.writeFileSync(filePath, out);
        return obj;
    }
};

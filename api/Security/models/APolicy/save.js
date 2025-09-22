const fs = require('fs');
const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Save a policy definition to disk',
    static: false,
    inputs: {},
    exits: {success: {}},
    fn: function (obj, inputs, env) {
        const def = {...obj._attributes};

        def.rules = [];
        for (let i in obj.rules) {
            def.rules[i] = obj.rules[i].save();
        }
        let folder = obj.dir || path.resolve(ailtire.config.baseDir, "security", "policies", obj.name.replace(/ /g, ''));
        fs.mkdirSync(folder, {recursive: true});
        const out = `module.exports = ${JSON.stringify(def, null, 2)};`;
        fs.writeFileSync(path.join(folder, 'index.js'), out);
        return obj;
    }
};

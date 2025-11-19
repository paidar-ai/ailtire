const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
    description: 'Save and actor to the directory',
    static: false,
    inputs: {},

    exits: {},

    fn: function (obj, inputs, env) {

        let dir = path.resolve(global.ailtire.config;.baseDir, 'actors', obj.name.replace(/\s/g,'') );
        fs.mkdirSync(dir, { recursive: true });
        let fileName = path.resolve(dir, 'index.js');
        let def = {}
        for(let key in obj._attributes) {
            def[key] = obj._attributes[key];
        }
        def.roles = [];
        for(let roles in obj.roles) {
            def.roles.push(obj.roles[roles].name);
        }
        fs.writeFileSync(fileName, `module.exports = ${JSON.stringify(def, null, 2)};`);
        return obj;
    }
};


const path = require('path');
const fs = require("fs");

module.exports = {
    friendlyName: 'save',
    description: 'Save and actor to the directory',
    static: true,
    inputs: {
        cls: {
            description: 'Class to save',
            type: 'AClass',
            required: true
        }
    },

    exits: {},

    fn: function (obj, env) {
        let name = obj.definition.name;
        obj = obj.definition;
        let nameNoSpace = name.replace(/ /g, '');
        obj.dir = obj.dir || path.resolve(obj.package.dir, nameNoSpace);
        let tempObj = {
            name: name,
            description: obj.description,
        };
        if (obj.extends) {
            tempObj.extends = obj.extends;
        }
        if (obj.unique) {
            tempObj.unique = obj.unique;
        }
        tempObj.attributes = {};
        for (let name in obj.attributes) {
            let attr = obj.attributes[name];
            let tempAttr = attr.saveJSON();
            tempObj.attributes[name] = tempAttr;
        }
        tempObj.associations = {};
        for (let name in obj.associations) {
            let assoc = obj.associations[name];
            let tempAssoc = assoc.saveJSON();
            tempObj.associations[name] = tempAssoc;
        }
        tempObj.statenet = {};
        if (obj.statenet) {
            // Check if statenet is a proxy object
            try {
                tempObj.statenet = obj.statenet.toJSON();
            } catch (e) {
                tempObj.statenet = {};
            }
        }
        let tempString = `
class ${obj.name} {
    static definition = ${JSON.stringify(tempObj, null, 2)}
}
module.exports = ${obj.name};`;
        let filename = path.resolve(obj.dir, 'index.js');
        if (!fs.existsSync(filename)) {
            // This is the first time it is being created.
            fs.mkdirSync(obj.dir, {recursive: true});
            // Add the Default Class files.
        }
        fs.writeFileSync(filename, tempString);

        return obj;
    }
};


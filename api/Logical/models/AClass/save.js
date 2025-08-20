const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");
const obj = require("./get");

module.exports = {
    friendlyName: 'save',
    description: 'Save and actor to the directory',
    static: false,
    inputs: {
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        let name = obj.name;
        let nameNoSpace = name.replace(/ /g, '');
        obj.dir = obj.dir || path.resolve(obj.package.dir, nameNoSpace);
        let tempObj = {
            name: obj.name,
            description: obj.description,
        };
        if(obj.extends) { tempObj.extends = obj.extends; }
        if(obj.unique) { tempObj.unique = obj.unique; }
        tempObj.attributes = {};
        for(let i in obj._attributes) {
            let attr = obj._attributes[i];
            let tempAttr = attr.toJSON();
            tempObj.attributes[attr.name] = tempAttr;
        }
        tempObj.associations = {};
        for(let i in obj._associations) {
            let assoc = obj._associations[i];
            let tempAssoc = assoc.toJSON();
            tempObj[assoc.name] = tempAssoc;
        }
        tempObj.statenet = {};
        if(obj.statenet) {
            tempObj.statenet = obj.statenet.toJSON();
        }
        let tempString = `
class ${obj.name} {
    static definition = ${JSON.stringify(tempObj)}
    }
};
module.exports = ${obj.name}`;
        let filename = path.resolve(tempObj.dir, 'index.js');
        if(!fs.existsSync(filename)) {
            // This is the first time it is being created.
            fs.mkdirSync(obj.dir, { recursive: true });
            // Add the Default Class files.
        }
        fs.writeFileSync(filename, tempString);

        return obj;
    }
};


module.exports = {
    friendlyName: 'save',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        "type": "string",
        "description": "My Return Value"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let usecaseDef = {};
        obj.definition.attributes.forEach(attr => {
            if (!attr.transient) {
                usecaseDef[attr.name] = attr.value;
            }
        });
        usecaseDef.extends = [];
        for (let i in obj.extends) {
            let uc = obj.extends[i];
            usecaseDef.extends.push(uc.name);
        }
        usecaseDef.includes = [];
        for (let i in obj.includes) {
            let uc = obj.includes[i];
            usecaseDef.includes.push(uc.name);
        }
        let filename = obj.owner.dir + `/usecases/${obj.name.replace(/\s/g, '')}/index.js`;
        fs.writeFileSync(filename, `module.exports = ${JSON.stringify(usecaseDef, null, 4)}`);
        return {retval: obj};
    }
};

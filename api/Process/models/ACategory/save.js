const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
            "type": "ACategory",
            "description": "Return the saved Category",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        let file = path.resolve(obj.dir, `index.js`);
        let def = obj._attributes;
        fs.writeFileSync(file, `module.exports = ${JSON.stringify(def, null, 4)}`);
        return obj;
    }
};

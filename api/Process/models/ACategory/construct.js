const fs = require("fs");
const path = require("path");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Category for the workflows',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "name": {
            "type": "string",
            "description": "Name of the Use Case",
            "required": true,
        },
        "dir": {
            type: "string",
            description: "Directory of the Use Case",
            required: true
        },
    },
    outputs: {
            "type": "ACategory", "description": "Category Object",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let { name, dir } = inputs;

        let def = { name: name, description: `The ${name} Category is used for...` };
        let file = path.resolve(dir, `index.js`);
        if(!fs.existsSync(file)) {
            fs.writeFileSync(file, `module.exports = ${JSON.stringify(def, null, 4)}`);
        }
        let retval = ACategory.load({file:file});
        return retval;
    }
};
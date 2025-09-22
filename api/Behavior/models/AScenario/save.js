const fs = require("fs");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Scenario for the usecase',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
            "type": "string", "description": "My Return Value"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let scenarioDef = {}
        for(let aname in obj.definition.attributes) {
            scenarioDef[attr.name] = obj[aname];
        }
        scenarioDef.steps = obj.steps.map(step => {
            let stepObj = new AStep(step);
            let retval = {};
            for(let aname in step.definition.attributes) {
               retval[attr.name] = step[aname];
            }
            return retval;
        });
        let filename = usecase.dir + `${obj.name.replace(/\s/g, '')}.js`;
        fs.writeFileSync(filename, `module.exports = ${JSON.stringify(scenarioDef, null, 4)}`);
        return { retval: obj };
    }
};
function existsDir(dir) {
    try {
        if (fs.statSync(dir).isDirectory()) {
            return true;
        }
    } catch (e) {
        if (e) {
            return false;
        }
    }
}
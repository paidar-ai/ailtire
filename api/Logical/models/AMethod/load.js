const funcHandler = require("../../../../src/Proxy/MethodProxy");
const path = require("node:path");

module.exports = {
    friendlyName: 'load',
    description: 'Load an actor from the directory',
    static: true,
    inputs: {
        file: {
            description: 'File to use as the method to load',
            type: 'string',
            required: true
        },
        cls: {
            description: 'Class of the Method.',
            type: 'AClass',
            required: true
        }
    },

    exits: {
    },

    fn: function (inputs, env) {

        let file = inputs.file;
        let cls = inputs.cls;
        let methodObj = require(file);
        methodObj.owner = cls;
        methodObj.name = path.basename(file, '.js');
        methodObj.uid = `${cls.uid}.${methodObj.name}`;
        let method = new AMethod(methodObj);
        cls.definition.methods[methodObj.name] = method;
        return method;
    }
};


const Generator = require("../../../../src/Documentation/Generator");
const fs = require("fs");
const path = require("path");
module.exports = {
    friendlyName: 'construct', description: `Construct an application directory heirarchy`, static: true, inputs: {
        name: {
            description: 'Name of the method', type: 'string', required: true
        },
        model: {
            description: 'Model of the method being created', type: 'AClass', required: true
        },
        inputs: {
            description: 'Inputs of the method', type: 'json', required: false,
        },
        outputs: {
            description: 'Outputs of the method', type: 'json', required: false,
        }
    }, outputs: {
            type: 'AMethod', description: 'A new method for the model is created and returned',
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let name = inputs.name;
        let model = inputs.model;
        let package = inputs.package;
        let output = model.definition.dir;

        let targetDir = output;
        let workingDir = process.cwd();
        let modelFile = path.resolve(process.cwd() + '/index.js');
        let inputsParams = inputs.inputs || {
            input1: {
                type: "string",
                description: "MY Description of the input",
                required: false
            }
        };
        let outputsParams = inputs.outputs || { retval: {type: "string", description: "My Return Value"}};
        let nameNoSpace = name.replace(/ /g, '');
        let files = {
            context: {
                name: name,
                nameNoSpace: nameNoSpace,
                inputs: inputsParams,
                outputs: outputsParams
            },
            targets: {
                ':nameNoSpace:.js': {template: `${__dirname}/templates/method.js`},
            }
        };
        Generator.process(files, output);
        let method = AMethod.load({cls: model, file: path.resolve(output, `${nameNoSpace}.js`)});
        return method;
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
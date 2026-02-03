const Generator = require("../../../../src/Documentation/Generator");
const path = require("path");

module.exports = {
    friendlyName: 'construct',
    description: `Construct an interface for the package or application`,
    static: true,
    inputs: {
        name: {
            description: 'Name of the method', type: 'string', required: true
        },
        package: {
            description: 'Package of the interface being created. If not specified it will be created at the application level.',
            type: 'APackage',
            required: false,
        },
        inputs: {
            description: 'Inputs of the method', type: 'json', required: false,
        },
        outputs: {
            description: 'Outputs of the method', type: 'json', required: false,
        }
    },
    outputs: {
            type: 'AInterface', description: 'A new interface for the packlage/application is created and returned',
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let name = inputs.name;
        let package = inputs.package;

         // Get the directory for the application
        if(!package) {
            package = global.topPackage;
        }
        if (typeof package === 'string') {
            package = APackage.get({name: package});
        }
        if (!package) {
            package = APackage.construct({name: name});
        }
        let output = package.dir;

        let targetDir = output;
        let workingDir = process.cwd();
        let inputsParams = inputs.inputs || {
            input1: {
                type: "string", description: "MY Description of the input", required: false
            }
        };
        let outputsParams = inputs.outputs || {retval: { type: "string", description: "My Return Value"}};
        let nameNoSpace = name.replace(/ /g, '');
        let files = {
            context: {
                name: name, nameNoSpace: nameNoSpace, inputs: inputsParams, outputs: outputsParams
            }, targets: {
                ':nameNoSpace:.js': {template: `${__dirname}/templates/interface.js`},
            }
        };
        let outputDir = path.resolve(output, "interface");
        Generator.process(files, outputDir);
        let retval = AInterface.load({package: package, dir: outputDir});
        return retval;
    }
};
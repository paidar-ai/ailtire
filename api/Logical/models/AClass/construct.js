const Generator = require("../../../../src/Documentation/Generator");
const fs = require("fs");
const path = require("path");
module.exports = {
    friendlyName: 'construct',
    description: `Construct a AClass in the models directory of the package`,
    static: true,
    inputs: {
        name: {
            description: 'Name of the application', type: 'string', required: true
        },
        description: {
            description: 'Description of the model', type: 'string', required: false,
        },
        package: {
            description: 'Package of the model being created.',
            type: "APackage",
            required: false,
        },
    },
    outputs: {
        type: 'AClass', description: 'A new AClass is created and returned',
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let name = inputs.name;
        let package = inputs.package;
        let output = './api';

        let nameNoSpace = name.replace(/ /g, '');
        let modelDir;
        if (package) {
            if (typeof package === 'string') {
                package = APackage.construct({name: package});
            }
            output = package.dir;
        } else {
            output = process.cwd();
        }
        modelDir = package.dir + `/models/${nameNoSpace}`;
        if (!existsDir(modelDir)) {
            let files = {
                context: {
                    name: name, nameNoSpace: nameNoSpace,
                }, targets: {
                    'models/:nameNoSpace:/index.js': {template: `${__dirname}/templates/index.js`},
                }
            };
            Generator.process(files, output);
        }
        let cls = AClass.load({dir: path.resolve(output, "models", nameNoSpace), package: package});
        cls.definition.description = inputs.description;
        AClass.save(cls);
        return cls;
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
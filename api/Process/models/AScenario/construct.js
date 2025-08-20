const fs = require("fs");
const path = require("path");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Scenario for the usecase',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "name": {
            "type": "string",
            "description": "Name of the Use Case",
            "required": true,
        },
        "package": {
            type: "APackage",
            description: "Package for the use case. If this is not there then the use case will be created against the application",
            required: false
        },
        description: {
            type: "string",
            description: "Description of the Use Case",
            required: false
        },
        given: {
            type: "string",
            description: "Given steps of the scenario",
            required: false
        },
        when: {
            type: "string",
            description: "When steps of the scenario",
            required: false
        },
        then: {
            type: "string",
            description: "Then steps of the scenario",
            required: false
        },
        actors: {
            type: 'json',
            description: 'List of actors that this scenario uses',
            required: false,
            properties: {
                name: {description: "Name of the actor", type: "string", required: false},
                actions: {description: "List of actions that the actor can perform", type: "string", required: false},
            }
        },
        steps: {
            type: 'Array',
            description: 'List of steps that this scenario uses',
            required: false,
            properties: {
                action: {description: "Name of the action", type: "string", required: false},
                parameters: {description: "List of parameters for the action", type: "json", required: false},
                description: {description: "Description of the action", type: "string", required: false},
            }
        },
        usecase: {
            type: "AUseCase",
            description: "Use case for the scenario",
            required: true
        },
    },
    outputs: {
        type: "AScenario",
        description: "The Scenario Object based on the inputs",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {name, description, actors, package, usecase, when, given, then, steps} = inputs;

        if (!package) {
            package = global.topPackage;
        }
        if (typeof package === 'string') {
            package = APackage.get({name: package});
            if (!package) {
                package = APackage.construct({name: package});
            }
        }

        // Now get the use case from the package.
        if (typeof usecase === 'string') {
            let usecaseName = usecase;
            usecase = AUseCase.find({name: usecaseName});
            if (!usecase) {
                usecase = AUseCase.construct({name: usecaseName, package: package});
            }
        }
        let targetDir = usecase.dir;
        let scenarioDef = {
            name: name,
            description: description || `${name} is a scenario of ${usecase.name}`,
            given: given || "The scenario assumes the given conditions.",
            when: when || "The scenario runs when the following occurs.",
            then: then || "Perform the following to the system.",
            actors: actors || {Actor: 'uses the system'},
            steps: steps || [{action: `${name}`, parameters: {}, description: `The Actor ${name} to the system.`}]
        }

        let nameNoSpace = name.replace(/ /g, '');
        let filename = path.resolve(usecase.dir, `${nameNoSpace}.js`)
        if (!fs.existsSync(filename)) {
            let myString = `module.exports = ${JSON.stringify(scenarioDef)};`;
            fs.writeFileSync(filename, myString);
        }
        let retval = AScenario.load({usecase: usecase, file: filename});
        return retval;
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
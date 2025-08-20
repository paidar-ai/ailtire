const fs = require("fs");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Use Case for the application or package',
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
        extends: {
            type: "Array",
            description: "List of use cases that this use case extends",
            required: false,
        },
        includes: {
            type: "Array",
            description: "List of use cases that this use case includes",
            required: false,
        },
        actors: {
            type: "Array",
            description: "List of actors that this use case uses",
            required: false,

        }
    },
    outputs: {
            "type": "AUseCase", "description": "My Return Value"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {name, description, includes, actors, package} = inputs;

        if(!package) {
            package = global.topPackage;
        }
        if(typeof package === 'string') {
            package = APackage.get({name: package});
            if(!package) {
                package = APackage.construct({name: package});
            }
        }
        let nameNoSpace = name.replace(/ /g, '');
        let ucFile = package.dir + `/usecases/${nameNoSpace}/index.js`;
        let usDef = {
            name: name,
            description: description || `${name} is a use case of ${package.name}`,
            extends: [],
            includes: includes || [],
            actors: actors || {"Actor": "uses"}
        }
        if(!fs.existsSync(ucFile)) {
            fs.mkdirSync(package.dir + `/usecases/${nameNoSpace}`, {recursive: true});
            fs.writeFileSync(ucFile, `module.exports = ${JSON.stringify(usDef, null, 4)};`);
        }
        let retval = AUseCase.load({file: ucFile, package: package});

        // obj has the obj for the method.
        return retval;
    }
};
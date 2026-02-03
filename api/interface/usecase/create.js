module.exports = {
    friendlyName: 'create',
    description: 'Create an UseCase',
    static: true,
    inputs: {
        name: {
            description: 'The name of the usecase',
            type: 'string',
            required: true
        },
        package: {
            description: 'The name of the package',
            type: 'string',
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
            type: "AUseCase",
            description: "UseCase created by the function call."
    },
    exits: {
    },

    fn: function (inputs, env) {
        let package = null;
        if(inputs.package) {
            package = APackage.get({name: inputs.package});
            if(!package) {
                package = APackage.construct({name: inputs.package});
            }
        }
        let retval = AUseCase.construct({name: inputs.name, package: package, description: inputs.description, extends: inputs.extends, includes: inputs.includes, actors: inputs.actors});

        return `UseCase: ${retval.name} created`;
    }
};


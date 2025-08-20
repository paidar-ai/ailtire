module.exports = {
    friendlyName: 'create',
    description: 'Create a Method in a Model',
    static: true,
    inputs: {
        name: {
            description: 'The name of the scenario',
            type: 'string',
            required: true
        },
        package: {
            description: 'The name of the package of the interface. If not specified, the interface is created in the top level package.',
            type: 'string',
            required: false
        },
        inputs: {
            description: 'The inputs to the method',
            type: 'json',
            required: false,
        },
        outputs: {
            description: 'The outputs to the method',
            type: 'json',
            required: false,
        }
    },

    exits: {
        json: (obj) => { return obj; },
    },
    outputs: {
        type: "AInterface",
        description: "Interface created by the function call."
    },

    fn: function (inputs, env) {
        // Find the Model first.
        let package = null;
        if(inputs.package) {
            package = APackage.get({name: inputs.package});
            if(!package) {
                package = APackage.construct({name: inputs.package});
            }
        }
        let retval = AInterface.construct({name: inputs.name, package: package, inputs: inputs.inputs, outputs: inputs.outputs});
        return retval;
    }
};


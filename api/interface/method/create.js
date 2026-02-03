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
        model: {
            description: 'The name of the model',
            type: 'string',
            required: false
        },
        package: {
            description: 'The name of the package',
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
    },
    outputs: {
        type: "AMethod",
        description: "Method created by the function call."
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
        let model = inputs.model;
        if(typeof model === 'string') {
            model = AClass.get({id: model});
        }
        if(!model) {
            model = AClass.construct({name: inputs.model, package: package});
        }
        let method = AMethod.construct({name: inputs.name, model: model});
        return method;
    }
};


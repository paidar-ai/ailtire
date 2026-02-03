module.exports = {
    friendlyName: 'create',
    description: 'Create a Handler for an evetn by Package',
    static: true,
    inputs: {
        event: {
            description: 'The name of the event to be handled',
            type: 'string',
            required: true
        },
        package: {
            description: 'The name of the package to add the event handler',
            type: 'string',
            required: false
        },
        handlers: {
            description: 'The handlers to be added',
            type: 'json',
            required: false,
        },
    },
    outputs: {
        type: "AHandlers",
        description: "Handlers created for the package to handle the event.",
    },
    exits: {
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
        let handlers = AHandlers.construct({event: inputs.event, package: package, handlers: inputs.handlers});
        return handlers;
    }
};


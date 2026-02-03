module.exports = {
    friendlyName: 'addResource',
    description: 'Add a resource to the team',
    static: false,
    inputs: {
        resource: {
            type: 'AResource',
            description: 'Existing resource instance',
            required: false
        },
        resourceDef: {
            type: 'json',
            description: 'Resource definition to construct and add',
            required: false
        },
        name: {
            type: 'string',
            description: 'Resource name (used if resourceDef is not provided)',
            required: false
        },
        description: {
            type: 'string',
            description: 'Resource description (used if resourceDef is not provided)',
            required: false
        },
        type: {
            type: 'string',
            description: 'Resource type (used if resourceDef is not provided)',
            required: false
        },
        metadata: {
            type: 'json',
            description: 'Resource metadata (used if resourceDef is not provided)',
            required: false
        },
        url: {
            type: 'string',
            description: 'Resource URL (used if resourceDef is not provided)',
            required: false
        }
    },
    outputs: {
        type: 'ATeam',
        description: 'The updated team'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (obj, inputs, env) {
        let resourceObj = inputs.resource;
        if (!resourceObj) {
            let resourceDef = inputs.resourceDef;
            if (!resourceDef) {
                resourceDef = {
                    name: inputs.name,
                    description: inputs.description,
                    type: inputs.type,
                    metadata: inputs.metadata,
                    url: inputs.url
                };
            }
            if (resourceDef && resourceDef.name) {
                resourceObj = new AResource(resourceDef);
            } else {
                throw new Error('No resource provided to add.');
            }
        }
        obj.addToResources(resourceObj);
        return obj;
    }
};

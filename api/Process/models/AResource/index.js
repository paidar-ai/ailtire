class AResource {
    static definition = {
        name: 'AResource',
        description: 'A resource that can be used by a team or process.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the resource'
            },
            description: {
                type: 'string',
                description: 'Description of the resource'
            },
            type: {
                type: 'string',
                description: 'Type of resource (service, dataset, system, etc.)'
            },
            metadata: {
                type: 'json',
                description: 'Additional metadata for the resource'
            },
            url: {
                type: 'string',
                description: 'Resource URL'
            }
        },
        associations: {}
    }
}

module.exports = AResource;

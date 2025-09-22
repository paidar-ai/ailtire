class ALocation {
    static definition = {
        name: 'ALocation',
        description: 'A physical or logical site within an environment.',
        attributes: {
            ltype: {
                type: 'string',
                description: 'Type of location, e.g. "site", "rack", "room", "data center", "cloud", "edge"',
            },
            description: {
                type: 'string',
                description: 'Description of the location',
            },
            name: {
                type: 'string',
                description: 'Name of the location',
            },
            contact: {
                type: 'string',
                description: 'Contact information or owner of this location',
            },
            default: {
                type: 'boolean',
                description: 'Whether this is the default location for its environment',
            }
        },
        associations: {
            // no further associations
        }
    }
}

module.exports = ALocation;


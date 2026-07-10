class AService {
    static definition = {
        name: 'AService',
        description: 'A deployable service or nested stack service.',
        attributes: {
            name: {
                type: 'string',
                required: true,
                description: 'Service name'
            },
            type: {
                type: 'enum',
                values: ['service', 'stack'],
                description: 'Type of deployable unit'
            },
            state: {
                type: 'string',
                default: 'Created',
                description: 'Current lifecycle state'
            },
            baseDir: {
                type: 'string',
                description: 'Base directory for the service source tree'
            },
            interface: {
                type: 'json',
                description: 'Interface definitions and route mappings exposed by the service'
            },
            policies: {
                type: 'json',
                description: 'Deployment and retry policies for the service'
            },
            volumes: {
                type: 'json',
                description: 'Volume mappings used by the service'
            },
            deployments: {
                type: 'json',
                description: 'Normalized deployment configuration for the service'
            }
        },
        associations: {
            image: {
                type: 'AImage',
                cardinality: '1',
                composition: false,
                owner: false,
                description: 'Container image used when launching the service'
            },
            environment: {
                type: 'AEnvironment',
                cardinality: '1',
                composition: false,
                owner: false,
                description: 'Environment where the service runs'
            },
            stack: {
                type: 'AStack',
                cardinality: '1',
                composition: false,
                owner: false,
                description: 'Stack that contains this service'
            }
        }
    }
}

module.exports = AService;

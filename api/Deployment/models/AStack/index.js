class AStack {
    static definition = {
        name: 'AStack',
        description: 'A deployable stack composed of services, networks, policies, and shared data.',
        attributes: {
            name: {
                type: 'string',
                required: true,
                description: 'Stack name'
            },
            environment: {
                type: 'string',
                description: 'Owning environment name'
            },
            composeFile: {
                type: 'string',
                description: 'Resolved docker compose file used by this stack'
            },
            dockerFile: {
                type: 'string',
                description: 'Resolved dockerfile used to build this stack'
            },
            interface: {
                type: 'json',
                description: 'Interface mappings for the stack'
            },
            policies: {
                type: 'json',
                description: 'Policies applied to the stack'
            },
            data: {
                type: 'json',
                description: 'Shared data and volume definitions for the stack'
            }
        },
        associations: {
            environmentRef: {
                type: 'AEnvironment',
                cardinality: '1',
                composition: false,
                owner: false,
                description: 'Environment that contains this stack'
            },
            services: {
                type: 'AService',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Services contained in this stack'
            },
            networks: {
                type: 'ANetwork',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Networks used by this stack'
            }
        }
    }
}

module.exports = AStack;

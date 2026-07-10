class AEnvironment {
    static definition = {
        name: 'AEnvironment',
        description: 'A deployment environment containing locations, networks, compute devices, and storage volumes.',
        attributes: {
            name: {
                type: 'string',
                required: true,
                description: 'Logical name of the environment, such as local or prod'
            },
            description: {
                type: 'string',
                description: 'Human-readable description of the environment'
            },
            color: {
                type: 'string',
                description: 'Visualization color for this environment'
            },
            definition: {
                type:'json',
                description: 'JSON definition of the environment'
            },
            file: {
                type: 'string',
                description: 'Path to the file containing the environment definition'
            },
            package: {
                type: 'string',
                description: 'Package name associated with this environment'
            }
        },
        associations: {
            locations: {
                type: 'ALocation',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Physical or logical sites that belong to this environment'
            },
            networks: {
                type: 'ANetwork',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Subnet or VLAN segments defined in this environment'
            },
            networkDevices: {
                type: 'ANetworkDevice',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Switches, routers, firewalls, and related devices present in this environment'
            },
            computeDevices: {
                type: 'AComputeDevice',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Virtual or physical compute nodes in this environment'
            },
            storageVolumes: {
                type: 'AStorageDevice',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Block or object storage resources in this environment'
            },
            stack: {
                type: 'AStack',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'Stack deployed into this environment'
            },
            services: {
                type: 'AService',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Standalone services deployed into this environment'
            }
        }
    }
}

module.exports = AEnvironment;

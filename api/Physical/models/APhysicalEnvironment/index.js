// index.js
class APhysicalEnvironment {
    static definition = {
        name: 'AEnvironment',
        description: 'A deployment environment containing locations, networks, compute nodes, and storage volumes.',
        attributes: {
            name: {
                type: 'string',
                description: 'Logical name of the environment (e.g. "local", "prod")',
            },
            description: {
                type: 'string',
                description: 'Human-readable description of this environment',
            },
            color: {
                type: 'string',
                description: 'Visualization color for this environment (e.g. "#aa44aa")',
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
                description: 'Switches, routers, firewalls, etc. present in this environment'
            },
            computeDevices: {
                type: 'AComputeDevice',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'VMs or bare-metal nodes in this environment'
            },
            storageVolumes: {
                type: 'AStorageDevice',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Block or object storage resources in this environment'
            }
        }
    }
}

module.exports = APhysicalEnvironment;
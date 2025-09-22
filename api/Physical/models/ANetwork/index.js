
class ANetwork {
    static definition = {
        name: 'ANetwork',
        description: 'A subnet or VLAN segment within an environment. Defines addressing and routing properties.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the network',
            },
            description: {
                type: 'string',
                description: 'Description of the network',
            },
            network: {
                type: 'string',
                description: 'CIDR block for this network, e.g. "10.0.0.0/24"',
            },
            gateway: {
                type: 'string',
                description: 'Default gateway IP address for the network',
            },
            mask: {
                type: 'string',
                description: 'Subnet mask, e.g. "255.255.255.0"',
            },
            ipaddr: {
                type: 'string',
                description: 'Representative IP address within the network (optional)',
            }
        },
        associations: {
            // devices attach via their ComputeDevice.networks or NetworkDevice.networks
        }
    }
}

module.exports = ANetwork;


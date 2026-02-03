
class ADevice {
    static definition = {
        name: 'ADevice',
        description: 'Base class for all physical devices (compute, network, storage). ' +
                     'Defines common attributes and associations.',
        attributes: {
            id: {
                type: 'string',
                description: 'Unique identifier of the device',
            },
            name: {
                type: 'string',
                description: 'Name of the device',
            },
            mtype: {
                type: 'string',
                description: 'Physical module type, e.g. "compute/medium", "network/switch", "storage/cloud"',
            }
        },
        associations: {
            environment: {
                type: 'APhysicalEnvironment',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'The environment in which this device resides'
            },
            location: {
                type: 'ALocation',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'The site or location where this device resides'
            },
            networks: {
                type: 'ANetwork',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Zero or more networks to which this device is attached'
            }
        }
    }
}

module.exports = ADevice;


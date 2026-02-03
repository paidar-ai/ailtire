
// index.js

class AStorageDevice {
    static definition = {
        extends: "ADevice",
        name: 'AStorageDevice',
        description: 'Standalone storage (block or object) accessible over the network.',
        attributes: {
            // inherits id, name, mtype from ADevice
            size: {
                type: 'string',
                description: 'Capacity of the volume, e.g. "1T", "500G"',
            },
            stype: {
                type: 'enum',
                description: 'Type of storage, e.g. "block", "object"',
                values: ['block', 'object']
            }
        },
        associations: {
            // inherits location, networks from ADevice
            // no extra associations
        }
    }
}

module.exports = AStorageDevice;


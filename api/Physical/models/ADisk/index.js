
class ADisk {
    static definition = {
        name: 'ADisk',
        description: 'Represents a disk attached to a compute device; maps to a standalone StorageDevice.',
        attributes: {
            volume: {
                type: 'string',
                description: 'Identifier of the StorageDevice to attach',
            },
            mount: {
                type: 'string',
                description: 'Filesystem mount point inside the compute device',
            }
        },
        associations: {
            storageVolume: {
                type: 'AStorageDevice',
                cardinality: 1,
                composition: false,
                owner: false,
                description: 'The StorageDevice instance that this disk references'
            }
        }
    }
}

module.exports = ADisk;


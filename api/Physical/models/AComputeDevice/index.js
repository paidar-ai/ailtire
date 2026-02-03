class AComputeDevice {
    static definition = {
        dextends: "ADevice",
        name: 'AComputeDevice',
        description: 'Represents a VM or bare-metal node in a physical environment.',
        attributes: {
            // inherits id, name, mtype from ADevice
        },
        associations: {
            // inherits location, networks from ADevice
            disks: {
                type: 'ADisk',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'One or more disks attached to this compute device'
            }
        }
    }
}

module.exports = AComputeDevice;


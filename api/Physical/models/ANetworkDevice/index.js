
class ANetworkDevice {
    static definition = {
        extends: "ADevice",
        name: 'ANetworkDevice',
        description: 'A network appliance (switch, router, firewall, etc.) in a physical environment.',
        attributes: {
            // inherits id, name, mtype from ADevice
            speed: {
                type: 'string',
                description: 'Interface speed, e.g. "1G", "10G"',
            },
            ports: {
                type: 'number',
                description: 'Number of physical ports on the device',
            }
        },
        associations: {
            // inherits location, networks from ADevice
            // no additional associations
        }
    }
}

module.exports = ANetworkDevice;


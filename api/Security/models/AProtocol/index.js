class AProtocol {
    static definition = {
        "name": "AProtocol",
        description: 'AProtocol allows the developer to define a protocol for communication with other systems.',
        "attributes": {
            name: {type: 'string', required: true, description: 'Unique protocol name'},
            description: {type: 'string', description: 'Description of the protocol'},
        },
        "associations": {},
    }
}

module.exports = AProtocol;
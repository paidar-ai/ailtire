
class AEvent {
    static definition = {
        name: 'AEvent',
        description: 'This represents an event in the system. Events are captured by handlers.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the event',
            },
            data: {
                type: 'json',
                description: 'Data of the event',
            }
        },
        associations: {
            handlers: {
                type: 'AHandlers',
                cardinality: 'n',
                composition: false,
                owner: false,
                transient: true,
            },
        },
    }
}

module.exports = AEvent;

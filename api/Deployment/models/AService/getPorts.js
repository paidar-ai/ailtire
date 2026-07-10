module.exports = {
    friendlyName: 'getPorts',
    description: 'Return the exposed ports for a service',
    static: false,
    inputs: {},
    outputs: {
        type: 'array',
        description: 'List of exposed ports'
    },
    exits: {},
    fn: function (obj, inputs, env) {
        return Object.values(obj.interface || {})
            .filter((item) => item.port !== undefined)
            .map((item) => item.port);
    }
};

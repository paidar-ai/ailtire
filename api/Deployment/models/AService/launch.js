module.exports = {
    friendlyName: 'launch',
    description: 'Launch a service',
    static: false,
    inputs: {
        opts: {
            type: 'json',
            description: 'Launch options'
        },
        env: {
            type: 'json',
            description: 'Launch environment'
        }
    },
    outputs: {
        type: 'json',
        description: 'Launch result'
    },
    exits: {},
    fn: function (obj, inputs, env) {
    }
};

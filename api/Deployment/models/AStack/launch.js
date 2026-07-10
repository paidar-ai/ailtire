module.exports = {
    friendlyName: 'launch',
    description: 'Launch the stack',
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
        if (typeof obj.launch === 'function') {
            return obj.launch(inputs, env);
        }
        return obj;
    }
};

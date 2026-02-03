module.exports = {
    friendlyName: 'load',
    description: 'Load a StatTransition from a AClass definition',
    static: true,
    inputs: {
        definition: {
            description: 'json definition of the state net', type: 'json', required: true,
        },
        name: {
            description: 'Name of the transition', type: 'string', required: true,
        },
        fromState: {
            description: 'From State of the transition', type: 'AState', required: true,
        },
        event: {
            description: 'Event that triggers the transition', type: 'string', required: true,
        }
    },
    outputs: {
        type: "AStateNet", description: "A AStateNet object is returned that matches the input.",
    },
    exits: {},
    fn: function (inputs, env) {
        let defi = inputs.definition;

        let retVal = new ATransition({name: inputs.name, fromState: inputs.fromState, eventName: inputs.event});
        if(defi.condition) {
            retVal.condition = new AStateCondition(defi.condition);
        }
        if(defi.action) {
            retVal.action = new AStateAction({
                name: defi.action.name,
                description: defi.action.description,
                fn: defi.action.fn
            });
        }
        return retVal;
    }
};


module.exports = {
    friendlyName: 'load',
    description: 'Load a StateNet from a AClass definition',
    static: true,
    inputs: {
        definition: {
            description: 'json definition of the state net',
            type: 'json',
            required: false,
        },
        file: {
            description: 'A file that represents the state net',
            type: 'file',
            required: false,
        }
    },
    outputs: {
        type: "AStateNet",
        description: "A AStateNet object is returned that matches the input.",
    },
    exits: {
    },

    fn: function (inputs, env) {

        let def = inputs.definition;

        if(inputs.file) {
            def = require(inputs.file);
        }
        // Create the objects from the definition.
        let stateNet = new AStateNet({})
        for(let sname in def) {
            let state = def[sname];
            state.name = sname;
            let stateObj = new AState.load({definition: state});
            stateNet.addToStates(stateObj);
        }
        // Transitions need to be resolved now that all of the states have been loaded.
        // It should validate that all of the states are correct.
        for(let sname in stateNet.states) {
            let state = stateNet.states[sname];
            for(let ename in state.events) {
                let transition = state.events[ename];
                let toState = stateNet.states[ename];
                if(!toState) {
                    console.error("State:", ename, "not found in statenet");
                } else {
                    transition.toState = toState;
                }
            }
        }
        return stateNet;
    }
};


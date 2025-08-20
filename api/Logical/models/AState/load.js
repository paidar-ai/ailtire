module.exports = {
    friendlyName: 'load', description: 'Load a StateNet from a AClass definition', static: true, inputs: {
        definition: {
            description: 'json definition of the state net', type: 'json', required: true,
        },
    },
    outputs: {
        type: "AStateNet", description: "A AStateNet object is returned that matches the input.",
    },
    exits: {},
    fn: function (inputs, env) {

        let defi = inputs.definition;

        // Create the objects from the definition.
        let stateDef = {
            description: defi.description || "TBD",
            color: defi.color || "#ffffff",
            name: defi.name
        }
        let stateObj = new AState(stateDef);

        for (let ename in defi.events) {
            let eventDef = defi.events[ename];
            for (let sname in eventDef) {
                let stateDef = eventDef[sname];
                let transitionObj = new ATransition.load({
                    name: sname,
                    definition: stateDef,
                    fromState: stateObj,
                    event: ename
                });
                stateObj.addToEvents(transitionObj);
            }
        }
        if (defi.actions) {
            if (defi.actions.entry) {
                for (aname in defi.actions.entry) {
                    let actionObj = new AStateAction({
                        name: aname,
                        description: defi.actions.entry[aname].description || "Entry Action for the State",
                        fn: defi.actions.entry[aname].fn
                    });
                    stateObj.addToEntry(actionObj);
                }
            }
            if (defi.actions.exit) {
                for (aname in defi.actions.exit) {
                    for (aname in defi.actions.exit) {
                        let actionObj = new AStateAction({
                            name: aname,
                            description: defi.actions.exit[aname].description || "Exit Action for the State",
                            fn: defi.actions.exit[aname].fn
                        });
                        stateObj.addToEntry(actionObj);
                    }
                }
            }
        }
        return stateObj;
    }
};


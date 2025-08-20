
class AState {
    static definition = {
        name: 'AState',
        description: 'State of a StateNet for the AClass',
        attributes: {
            name: {
                type: "string",
                description: "This is the name of the state",
                required: true
            },
            description: {
                type: 'string',
                description: 'Desciprtion of the state',
            },
            color: {
                type: "string",
                description: "Color of the state, used for user interfaces.",
            },
        },
        associations: {
            events: {
                unique: (obj) => { return obj.name },
                description: "Events that can be handled while in this state.",
                type: 'ATransition',
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            entry: {
                type: "AStateAction",
                unique: (obj) => {return obj.name;},
                description: "Actions to be performed on the entry of this state.",
                cardinality: "n",
                composition: true,
                owner: true,
            },
            exit: {
                type: "AStateAction",
                unique: (obj) => {return obj.name;},
                description: "Actions to be performed when exiting this state.",
                cardinality: "n",
                compsition: true,
                owner: true
            }
        },
    }
}

module.exports = AState;


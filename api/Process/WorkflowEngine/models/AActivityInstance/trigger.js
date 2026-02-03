module.exports = {
    friendlyName: 'trigger',
    description: 'Trigger the event for the Workflow Instamnce.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "event": {
            "type": "AEvent",
            "description": "The event to trigger.",
            "required": true
        }
    },
    outputs: {
            "type": "boolean",
            "description": "The trigger was succesful or not based on the trigger condition."
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        let {event} = inputs;

        // find the trigger that matches the event and evaluate it.
        if (obj.triggers[event.name]) {
            return obj.triggers[event.name].eval(event);
        }
        return false;
    }
};

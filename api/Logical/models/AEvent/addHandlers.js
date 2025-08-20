const path = require('path');

module.exports = {
    friendlyName: 'addHandlers',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "handlers": {
            "type": "AHandlers",
            "description": "Handlers for events added to the system",
            "required": true
        }
    },
    outputs: {
            "type": "boolean",
            "description": "Return true if the handlers are added",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (inputs, env) {
        let { handlers } = inputs;

        for (let event in global.handlers) {
            // Make sure the handlers are only installed once. per socket.
            if (!global.handlers[event].hasOwnProperty('adaptors')) {
                global.handlers[event].adaptors = {};
            }
            if (!global.handlers[event].adaptors[handlers.id]) {
                global.handlers[event].adaptors[handlers.id] = true;
                await adaptor.subscribe(event);
            }
        }
        return true;
    }
};

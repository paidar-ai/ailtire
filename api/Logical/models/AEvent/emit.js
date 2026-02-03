const Action = require("../../../../src/Server/Action");
const funcHandler = require("../../../../src/Proxy/MethodProxy");
module.exports = {
    friendlyName: 'emit',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "event": {
            "type": "string",
            "description": "The Event to emit",
            "required": true
        },
        "data": {
            "type": "json",
            "description": "The data to send with the event",
            "required": false
        },
    },
    outputs: {
            "type": "AEvent",
            "description": "An AEvent is created and returned",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let { event, data } = inputs;
        try {
            const nevent = event.toLowerCase();
            let sdata = data.toJSON;
            if (!sdata) {
                if (data.hasOwnProperty('obj')) {
                    sdata = data.obj.toJSON;
                }
            }
            sdata = sdata || data;
            try {
                sdata = _toJSON(sdata);
            } catch (e) {
                console.error("Problem converting event message to JSON", e);
            }
            if (global.ailtire?.comms?.services) {
                for (let i in global.ailtire.comms?.services) {
                    let commsService = global.ailtire.comms.services[i];
                    commsService.publish(nevent, sdata);
                }
            }
            // Check to see if the current server handles this event.
            // If it does then call the Call the handlers defined.
            // This allows for a server to have events handled.
            if (global.handlers?.hasOwnProperty(nevent)) {
                callActions(nevent, data);
            }
        } catch (e) {
            console.log("Error on Event Emit:", e);
        }
    }
};

const callActions = async (event, data) => {
    // This is first class object assigned to a class.
    if (data.obj.hasOwnProperty('definition') && data.obj.hasOwnProperty('_attributes')) {
        let cls = AClass.getClass({name: data.obj.definition.name});
        data.obj = await cls.findDeep(data.obj._attributes.id);
    }
    // Ok now call the handlers.
    for (let i in global.handlers[event].handlers) {

        let handler = global.handlers[event].handlers[i];
        if (handler.hasOwnProperty('action')) {
            let action = Action.find(handler.action);
            if (action) {
                let convertedData = data;
                if (handler.hasOwnProperty('fn')) {
                    convertedData = handler.fn(data);
                }
                funcHandler.run(action, convertedData, event);
            } else {
                console.error("Action not found, for event!", handler)
            }
        } else {
            handler.fn(data, event);
        }
    }
}
const sanitizeString = (input) => input.replace(/"/g, ``).replace(/'/g, ``);
function _toJSON(obj) {
    let cache = new Set();

    function clone(obj) {
        // if it is a primitive or function, return as is
        if (obj === null || typeof obj !== 'object') {
            if (typeof obj === 'string') {
                return sanitizeString(obj);
            } else {
                return obj;
            }
        }
        // if circular detected, return undefined
        if (cache.has(obj)) {
            return undefined;
        }
        cache.add(obj);
        // handle Array
        if (Array.isArray(obj)) {
            let newArray = [];
            for (let value of obj) {
                newArray.push(clone(value));
            }
            return newArray;
        }
        // handle generic object
        let newObj = {};
        for (let key in obj) {
            newObj[key] = clone(obj[key]);
        }
        return newObj;
    }

    return clone(obj);
}
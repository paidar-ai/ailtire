const path = require('path');
const funcHandler = require("../../../../src/Proxy/MethodProxy");
const AEvent = require("../../../../src/Server/AEvent");
const Action = require("../../../../src/Server/Action");
const AClass = require("../../../../src/Server/AClass");


// ┌───Order of Actions───────────────────────────┐
// │ 1) eventMethod()                             │
// │ 2) for each transition:                      │
// │      if condition(returnValue) →  this one   │
// ├──────────────────────────────────────────────┤
// │ 3) exitStateActions()                        │
// │ 4) transitionAction()                        │
// │ 5) set currentState = nextState              │
// │ 6) entryStateActions()                       │
// └──────────────────────────────────────────────┘

module.exports = {
    friendlyName: 'processEvent', description: 'Process event based on the state net.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "event": {
            "type": "string",
            "description": "Event to process in the statenet",
            "required": true
        },
        args: {
            type: "json",
            description: "Args to pass to the event",
            required: true
        },
        proxy: {
            type: "ref",
            description: "Proxy object that is running the state net",
            required: true,
        }
    },
    outputs: {
            "type": "string", "description": "My Return Value"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let {proxy, event, args} = inputs;
        let currentState = proxy.state;

        // If the current state is not defined then log an error and return.
        if(!obj.states[currentState]) {
            console.error("Unknown State:", currentState);
            return;
        }

        // If the current state does not have any events then just run the method.
        if(!obj.states[currentState].events) {
            return _runMethod(proxy, event, args);
        }

        // Check if the event handled is a defined transition. If not then log a warning or reject the call based on
        // configuration in the ailtire config file.
        let eventObj = obj.states[currentState].events[event];
        if (!eventObj) {
            let retval = undefined;
            // Check the configuration to see if this is a strict mode.
            if (global.ailtire.config.statenet && global.ailtire.config.statenet === "strict") {
                console.error(`There is not a transistion from current state ${currentState} with the event ${event} for ${proxy.id}`);
            } else {
                return _runMethod(proxy, event, args);
            }
            // No call to the method because of the strict mode.
            return retval;
        } else {
            // Call the method for the event first take the output of running the method and pass it to the conditions of the transistions.
            let eventRetVal = _runMethod(proxy, event, args);
            // Now iterate over all of the potential states and check the conditions.
            let transition = _checkTransitions(eventObj, obj, eventRetVal);
            if (transition) {
                return _processTransition(obj, currentState, transition, event, proxy, eventRetVal);
            }
        }
    }
};

function _runMethod(proxy, event, arg) {
    if (proxy.definition.methods.hasOwnProperty(event)) {
        return funcHandler.run(proxy.definition.methods[event], proxy, arg);
    }
}
async function _processTransition(statenet, currentState, transition, event, proxy, args) {
    // Note that the event action has already been called.
    _handleExitActions(statenet[currentState], proxy);

    // This is the transistion action for the state.
    let transistionRetVal = await _executeAction(transition.action, proxy, args);

    // Now handle new State and all of the entry actions in the new state.
    proxy._state = transition.state;
    proxy._persist = { dirty: true };

    // Handle all of the entry actions for the new state.
    _handleEntryActions(statenet, statenet[transition.state], proxy);

    // Emit the events of the new state.
    AEvent.emit({event:`${proxy.definition.name}.${proxy._state}`, data: {obj: proxy.toJSON} });
    _emitInheritanceEvents(proxy);

    return  transistionRetVal;
}
function _checkTransitions(eventObj, proxy, results) {
    for (let stateName in eventObj) {
        let eventI = eventObj[stateName];
        if (eventI.hasOwnProperty('condition')) {
            if (_executeAction(eventI.condition, proxy, results)) {
                return { ...eventObj[stateName], state: stateName };
            }
        } else {
            return { ...eventObj[stateName], state: stateName };
        }
    }
    return null;
}
function _handleExitActions(stateObj, proxy) {
    if (stateObj.hasOwnProperty('actions') && stateObj.actions.hasOwnProperty('exit')) {
        for (let aname in stateObj.actions.exit) {
            let action = stateObj.actions.exit[aname];
            _executeAction(action, proxy);
        }
    }
}

function _handleEntryActions(statenet, stateObj, proxy) {
    if(!stateObj) {
        throw new Error("Invalid State transition. Trying to move to a state that does not exist.");
    }
    if (stateObj.hasOwnProperty('actions') && stateObj.actions.hasOwnProperty('entry')) {
        for (let aname in stateObj.actions.entry) {
            let action = stateObj.actions.entry[aname];
            try {
                let retval = _executeAction(action, proxy);
                // Check the current stateObject events to see if there is an entry.${aname}
                // If there is then proceses the event.
                let eventName = `entry.${aname}`;
                let eventObj = stateObj.events[eventName];
                if(eventObj) {
                    let transition = _checkTransitions(eventObj,{status: 'successful', obj: proxy});
                    return _processTransition(statenet, stateObj.name, transition, eventName, proxy, retval);
                }
            } catch(e) {
                // set the retval status to failed.
            }
        }
    }
}

function _executeAction(paction, pobj, pargs) {
    if(paction) {
        // Check to see if the action is a function or an action.
        // this is if the user just wants to pass the name of the action to call and not use the function variable.
        if (paction.hasOwnProperty('action')) {
            let action = Action.find(paction.action);
            // Check to see if the action is found. Then call the funcHandler to run the action.
            if (action) {
                return funcHandler.run(action, pobj, pargs);
            } else {
                console.error("Action not found, ", action.action);
                return null;
            }
        } else if (paction.hasOwnProperty('fn')) { // Check to see if the action is a function. If so then call the function.
            return paction.fn(pobj, pargs);
        } else { // Call the paction function directly.
            return paction(pobj.pargs);
        }
    }
    return;
}

function _emitInheritanceEvents(obj) {
    let definition = obj.definition;
    while (definition.extends) {
        let cls = AClass.getClass({name:definition.extends});
        definition = cls.definition;
        AEvent.emit({event:`${definition.name}.${obj._state}`, data: { obj: obj } });
    }
}

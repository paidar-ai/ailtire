module.exports = {
    friendlyName: 'evalTriggerGuard',
    description: 'Evaluate the trigger policy of the activity. Return true if the trigger is met.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "event": {
            "type": "AEvent",
            "description": "this is the even that triggered the activity",
            "required": false
        }
    },
    outputs: {
            "type": "boolean",
            "description": "True if the trigger is met."
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        let event = inputs.event;
        if(event) {
            switch (obj.policy.triggerMode) {
                case 'immediate':
                    return true;
                case 'timer': // Check if timer interval has elapsed
                    return obj.policy.timerMs && Date.now() >= obj.lastTriggerTime + obj.policy.timerMs;
                case 'trigger-any': // Return true if any trigger condition is met
                    let trigger = obj.triggers[event.name];
                    if(trigger.state === "Passed") {
                        return true;
                    }
                    return false;
                case 'trigger-all': // Must meet all trigger conditions
                    return _evaluateTriggerGuard(obj, event);
                case 'condition': // Evaluate custom condition if defined
                   return _evaluateTriggerGuardWithConditions(obj, event, obj.policy.condition);
                default: // If a trigger mode is not specified, assume immediate trigger
                    return true;
            }
        }
        return false;
    }
};

function _evaluateTriggerGuard(obj, event) {
    // Only If all of the triggers.state === "Passed", then the activity is triggered. Return True.
    let triggers = obj.triggers;
    if (!triggers) return false;

    let allPassed = true;
    for (let triggerName in triggers) {
        if (triggers[triggerName].state !== "Passed") {
            allPassed = false;
            break;
        }
    }
    return allPassed;

}

function _evaluateTriggerGuardWithConditions(obj, event, condition) {
    // the condition contains a function to be called for each trigger and the Activity Instance.
    // The function should return true if the condition is met.
    if(condition) {
        return condition(obj, obj.triggers, event);
    } else {
        return false;
    }
}
const path = require('path');

module.exports = {
    friendlyName: 'start',
    description: 'Start the workflow instance with the inputs. It will return the workflow instance that was started.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "inputs": {
            "type": "json",
            "description": "Input parameters for the workflow instance.",
            "required": false
        }
    },
    outputs: {
            "type": "AActivityInstance",
            "description": "Return the activity instance that was started.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let params = inputs.inputs;

        // First check the activity run policy. Do things run sequentially or in parallel?
        if(obj.def.policy.actionsMode === 'sequential') {
            for(let i in obj.def.actions) {
                let actionDef = obj.def.actions[i];
                let actionObj = new AActionInstance({def: actionDef,createdDate: new Date(), uid: `action-${obj.uid}-${i}`});
                obj.addToActions(actionObj);
                actionObj.start({inputs: params});
            }
        } else {
            for(let i in obj.def.actions) {
                let actionDef = obj.def.actions[i];
                let actionObj = new AActionInstance({def: actionDef,createdDate: new Date(), uid: `action-${obj.uid}-${i}`});
                obj.addToActions(actionObj);
            }
            for(let i in obj.actions) {
                let action = obj.actions[i];
                action.start({inputs: params});
            }
        }
    }
};

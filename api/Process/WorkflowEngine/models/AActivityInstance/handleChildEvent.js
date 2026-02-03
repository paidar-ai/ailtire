const path = require('path');

module.exports = {
    friendlyName: 'handleChildEvent',
    description: 'This handles the event from the runnable child activity that is now in a end state.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    "action": {
        "type": "ARunnable",
        "description": "Action that has changed state",
        "required": false
    }
},
    outputs: {
        "type": "AActivityInstance",
        "description": "this is the activity instance that was launched",
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let { action } = inputs;
        // obj has the obj for the method.
        // look at the activity policy and see what to do next. If the actionMode is sequential, then we need to move on to the next action.
        if(obj.def.policy.actionsMode === 'sequential') {
            switch (action.state) {
               case 'Succeeded': {
                   for(let i in obj.actions) {
                       let action = obj.actions[i];
                       if(action.state === 'Init') {
                           action.start();
                           break;
                       }
                   }
               }
               case 'Failed': {
                   for(let i in obj.actions) {
                       let action = obj.actions[i];
                       if(action.state === 'Init') {
                           action.cancelled();
                           break;
                       }
                   }
                   obj.failed({message: `Action ${action.name} failed!`});
               }
            }
        } else {
            switch (action.state) {
                case 'Succeeded': {
                    let flag = true;
                    for(let i in obj.actions) {
                        let action = obj.actions[i];
                        if(action.state !== 'Succeeded') {
                            flag = false;
                            break;
                        }
                    }
                    if(flag) {
                        obj.succeed();
                    }
                }
                case 'Failed': {
                    let flag = true;
                    for(let i in obj.actions) {
                        let action = obj.actions[i];
                        if(action.state !== 'Failed' || action.state !== 'Cancelled' || action.state !== 'Succeeded') {
                            flag = false;
                            break;
                        }
                    }
                    if(flag) {
                        obj.failed();
                    }
                }
            }
        }
        return obj;
    }
};

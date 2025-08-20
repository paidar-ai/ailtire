const path = require('path');
const AActivityInstance = require("../AActivityInstance");

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
        "type": "AWorkflowInstance",
        "description": "Return the workflow instance that was started.",
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let params = inputs.inputs;

        // Ok iterate over the activities in the workflow and create an activity instance for each.
        for(let i in obj.def.activities) {
            let activity = obj.def.activities[i];
            const ts = Date.now.toString(36);
            const rand = Math.random().toString(36).substr(2, 6);
            const number = `${ts}${rand}`;
            let activityInstance = new AActivityInstance({
                def: activity,
                uid: `activity-${activity.name}-${obj.uid}-${number}`,
                createdDate: new Date(),
            });
            obj.addToActivities(activityInstance);
        }
        // Instead of there being a start activity, All of the activity instances should be moved into the Waiting State.
        // This will make it so they can be fired off when the appropriate event occurs.
        let startEvent = new AEvent({name: 'workflow.start', data: {workflow: obj.id, inputs: params}});
        for(let i in obj.activities) {
            let activity = obj.activities[i];
            activity.trigger({event:startEvent});
        }
    }
};

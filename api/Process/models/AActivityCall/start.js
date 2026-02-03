module.exports = {
    friendlyName: 'start',
    description: 'Start the activity with the inputs. It will return true if the activity was started. ' +
        'A Workflow will be found to run based on the name.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "inputs": {
            "type": "json",
            "description": "The inputs for the activity call to launch",
            "required": false
        }
    },
    outputs: {
            "type": "boolean",
            "description": "Start was called and it started.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let params = inputs.inputs;
        // obj has the obj for the method.
        let activity = AActivity.get({name: obj.name});
        if(!activity) {
            console.error(`Activity ${obj.name} not found!`);
            obj.failed({message: `Activity ${obj.name} not found!`});
            return false;
        }
        obj.activity = activity;
        activity.start(inputs);
        return true;
    }
};

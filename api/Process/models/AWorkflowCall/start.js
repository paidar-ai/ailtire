const path = require('path');
const AWorkflow = require("../AWorkflow");

module.exports = {
    friendlyName: 'start',
    description: 'Start the workflow with the inputs. It will return true if the workflow was started. ' +
        'A Workflow will be found to run based on the name.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "inputs": {
            "type": "json",
            "description": "The inputs for the workflow call to launch",
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
        let workflow = AWorkflow.get({name: obj.name});
        if (!workflow) {
            console.error(`Workflow ${obj.name} not found!`);
            obj.failed({message: `Workflow ${obj.name} not found!`});
            return false;
        }
        obj.workflow = workflow;
        workflow.start(inputs);
        return true;
    }
};

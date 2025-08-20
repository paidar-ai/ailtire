module.exports = {
    friendlyName: 'launch',
    description: 'Launch a Workflow in a UseCase',
    static: true,
    inputs: {
        name: {
            description: 'The id of the scenario',
            type: 'string',
            required: true
        },
        inputs: {
            description: 'The inputs to the workflow',
            type: 'json',
            required: true
        }
    },

    exits: {
    },

    fn: function (inputs, env) {
        // Find the Workflow
        let name = inputs.name;
        let params = inputs.inputs;
        let workflow = AWorkflow.find({name: name});
        if(workflow) {
            let instance = AWorkflowEngine.launch({workflow: workflow, inputs:params});
            return instance;
        } else {
            AEvent.emit({event:"workflow.failed", data: {message:"Workflow not found"} });
        }
        return null;
    }
};


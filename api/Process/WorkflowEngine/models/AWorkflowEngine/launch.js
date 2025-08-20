module.exports = {
    friendlyName: 'launch',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    "workflow": {
        "type": "AWorkflow",
        "description": "This is the workflow that is to be launched",
        "required": true
    },
        inputs: {
            type: "json",
            description: "Inputs to the workflow",
        }
},
    outputs: {
        "type": "AWorkflowInstance",
        "description": "this is the workflow instance that was launched",
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let workflow = inputs.workflow;
        let params = inputs.inputs;
        // Need to create a new UID for the workflow instance.
        const ts = Date.now.toString(36);
        const rand = Math.random().toString(36).substr(2, 6);
        const number = `${ts}${rand}`;
        let wfInstance = new AWorkflowInstance({def: workflow, uid: `workflow-${workflow.name}-${number}`, createdDate: new Date()});
        wfInstance.start({inputs: params});
        return wfInstance;
    }
};

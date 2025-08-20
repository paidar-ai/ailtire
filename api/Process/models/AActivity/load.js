module.exports = {
    friendlyName: 'load',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "definition": {
            "type": "json",
            "description": "Definiiton of the Activity",
            "required": true
        },
        workflow: {
            type: "AWorkflow",
            description: "The workflow that owns the activity",
            required: true
        }
    },
    outputs: {
            "type": "AActivity",
            "description": "An activity object as defined in the definition",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let workflow = inputs.workflow;
        let def = inputs.definition;
        const activity = new AActivity({
            name: def.name,
            description: def.description,
            triggers: def.triggers || [],
            dedupeKey: def.dedupeKey,
            inputs: def.inputs || {},
            variables: def.variables || {},
            outputs: def.outputs || {},
            onError: def.onError,
            onStart: def.onStart,
            onComplete: def.onComplete
        });

        if (def.policy) {
            let policy = AActivityPolicy.load({definition: def.policy});
            activity.policy = policy;
        }

        if (def.actions) {
            for (let i in def.actions) {
                let action = def.actions[i];
                let actionObj;
                switch (action.type) {
                    case "action": {
                        actionObj = new AAction(action);
                        break;
                    }
                    case "activity": {
                        actionObj = AActivityCall.load({definition: action, workflow: workflow});
                        break;
                    }
                    case "workflow": {
                        actionObj = AWorkflowCall.load({definition: action, workflow: workflow});
                        break;
                    }
                    default: {
                        console.error("Could not find the action type: ", action.type, "in the definition for the activity: ", activity.name);
                        throw new Error(`Unknown action type: ${action.type}`);
                        break;
                    }
                }
                activity.addToActions(actionObj);
            }
        }
        return activity;
    }
};

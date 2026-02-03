module.exports = {
    friendlyName: 'load',
    description: 'Load a workflow from a file',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "file": {
            "type": "file",
            "description": "The file that represents the workflow definition",
            "required": true
        },
        package: {
            type: "APackage",
            description: "The package that owns the workflow",
            required: true
        }
    },
    outputs: {

        "type": "AWorkflow",
        "description": "A workflow object as defined in the file",

    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let def = require(inputs.file);
        let package = inputs.package;
        if (!package) {
            package = global.topPackage;
        }
        if (typeof package === 'string') {
            package = APackage.get({name: package});
            if (!package) {
                package = APackage.construct({name: package});
            }
        }
        const workflow = {
            name: def.name,
            description: def.description,
            precondition: def.precondition,
            postcondition: def.postcondition,
            category: def.category,
            inputs: def.inputs || {},
            outputs: def.outputs || {},
            activities: {}
        };
        workflowObj = new AWorkflow(workflow);

        if (def.activities) {
            for (const activityName in def.activities) {
                const activity = def.activities[activityName];
                activity.name = activityName;
                try {
                    let activityObj = AActivity.load({definition: activity, workflow: workflowObj});
                    workflowObj.addToActivities(activityObj);
                } catch (e) {
                    console.error(e);
                    console.error("Error loading activity: ", activityName, "in workflow: ", workflowObj.name);
                }
            }
        }
        return workflowObj;
    }
};

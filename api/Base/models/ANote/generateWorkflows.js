const path = require('path');
const AEvent = require("../../../../src/Server/AEvent");

module.exports = {
    friendlyName: 'generateWorkflows',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        prompt: {
            type: "string",
            description: "The prompt is added to the current note to generate items from",
            required: false
        },
    },
    outputs: {
            "type": "ANote",
            "description": "The Note with the workflows attached to it",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        AEvent.emit({event: "generate.started", data: {message: "Generating Workflows from Notes"}});
        const workflowFormat = `
{
    name: 'Workflow Name',
    description: 'Description of the Workflow',
    precondition: 'precondition of the workflow',
    postcondition: 'postcondition of the workflow',
    category: 'level1/level2/...', // This shows the category of the workflow groupings by levels with / separating the groupings.
    activities: {
        // Each activity should map to a use case, scenario, or another workflow.
        // This is the initial activity in the workflow. Everything starts here
        Init: {
            description: "Initial state for the workflow",
            actor: 'Actor', // This could be an actor or package.
            package: "My Package", // Either actor or package is defined here. They are mutually exclusive.
            inputs: {
                param1: {
                    description: 'This is a description of the parameter', // Description of the parameter
                    type: 'string', // Type of parameter string, number, ref, json,
                    default: 'This is a default', // This is a default value for the parameter
                    required: true // true or false
                }   
            },
            variables: {
                myVariable: {
                    description: "Variable for the activity",
                    fn: (activity) => { // This is how the variable is calculated. activity represents the current activity in the workflow at runtime.
                        return activity.id;
                    }
                }
            },
            next: {
                "Next Activity": {
                    inputs: {
                        input1: "Hard coded String", // This is a string hard coded for the Next Activity when it is called.
                        input2: (activity) => { return activity.inputs.param1; } // This calculates the input2 for the Next Activity
                    }
                },
                "Next Activity Bad Case": {
                    condition: {
                        test: "Is this good?" // this is the condition to test, Used for documentation.
                        value: "No", // This is the value expected. Used for documentation.
                        fn: (activity) => { return activity.inputs.param1;// returns true or false }
                    }
                },
                "Next Activity Good Case": {
                    condition: {
                        test: "Is this good?",
                        value: "Yes",
                    }
                }
            },
            outputs: {
                output1: {
                    description: "Output 1 from the activity.",
                    fn: (activity) => { return activity.variables}
                },
                output2: {
                    description: "Output 1 from the activity.",
                    fn: (activity) => { return "Made It"; }
                },
            }
        },
        "Next Activity": {
            inputs: {
                name: {
                    description: "Name of the team",
                    type: "string",
                },
            } 
        },
        "Next Activity Good Case": {
            description: "This is the good flow!",
            package: "My Package",
        },
        "Next Activity Good Case": {
            description: "This is the good flow!",
            package: "My Other Package"
        },
    }
}`;
        let messages = [];
        let package = global.topPackage;
        // Get the current usecases, class definitions, and workflows
        // Put them into a string and put them as system information.
        let items = ["usecases", "workflows"];
        for (i in items) {
            let content = `Use the following ${items[i]} for analysis of the user prompt:`;
            for (let name in package[items[i]]) {
                let obj = package[items[i]][name];
                content += JSON.stringify(obj);
                // content += `{ name:${obj.name}, description:${obj.description} }\n`;
            }
            messages.push({role: 'system', content: content});
        }
        // Get the current documentation. Add it as system information.
        let docString = package.getDocumentation();
        messages.push({role: 'system', content: "Use the following as the package documentation: " + docString});

        // Now ask to show the changes to the documentation based on all of the information.
        messages.push({
            role: 'system',
            content: `Assume the role of a system architect. Identify and generate potenital workflows of the application using the following as a` +
                ` javascript output template: ${workflowFormat}. Workflows are processes that are used to automate the processes of the system.` +
                ` The steps in the workflow should map to scenarios, usecases or other workflows where possible.` +
                ` The results should be in an json array of json objects following the output template that will be passed to javascript eval function.` +
                ` Any non-code should be commented using javascript comments. Take the user prompt as input to generate workflows`
        });
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        messages.push({
            role: 'user',
            content: obj.text
        });
        let workflows = await AIHelper.askForCode(messages);
        try {
            // Iterate over the list of use cases and save them.
            if (Array.isArray(workflows)) {
                for (let i in workflows) {
                    let workflow = workflows[i];
                    obj.addToItems({type: 'AWorkflow', json: workflow});
                }
            } else {
                obj.addToItems({type: 'AWorkflow', json: workflow});
            }
            obj.save();
            AEvent.emit({
                event: "generate.completed",
                data: {message: `Generating ${workflows.length} Workflows from Notes`}
            });
            return obj;
        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    }
};

```jscript
{
  "name": "Create Project",
  "description": "Create a Project to process documents with mappings",
  "precondition": "Data Curator needs to start a new project with mappings, documents and schemas",
  "postcondition": "A project is created so mappings, schemas and documents can be leveraged",
  "category": "Project/Setup",
  "inputs": {
    "name": {
      "description": "The name of the project",
      "type": "string",
      "required": true
    },
    "description": {
      "description": "Description of the project",
      "type": "string",
      "required": false
    }
  },
  "outputs": {},
  "activities": {
    "Init": {
      "description": "Initial state for the workflow",
      "actor": "Data Curator",
      "inputs": {
        "name": {
          "description": "The name of the project",
          "type": "string",
          "required": true
        },
        "description": {
          "description": "Description of the project",
          "type": "string",
          "required": false
        }
      },
      "policy": {
        "executeMode": "wait",
        "retryPolicy": {
          "maxAttempts": 3,
          "backoff": "exponential",
          "initialDelayMs": 500
        }
      },
      "actionsMode": "sequential",
      "actions": [
        {
          name: "CreateProjectRecord",
          description: "Create a new project record",
          fn: (obj) => { return obj; },
        }
      ],
      "outputs": {
        "project": {
          "description": "The newly created project",
          fn: (obj) => { return obj;}
        }
      }
    },
    "ValidateProject": {
        "description": "Validate a project that has been created",
        "package": "Repository",
        "inputs": {
            "project": {"description":"The project to validate", "type": "ref" }
        },
        "outputs": {
            "result": {
                "description": "Validation result",
                "fn": (ctx) => ctx.actions[0].outputs.result
            }
        }
        "triggers": {
            "Init.succeeded": {
                description: "When the project has been created, validate it",,
                "condition": (obj, event) => { return true; }
            }       
        },
        "policy": {
            "executeMode": "wait",
            "retryPolicy": {
                "maxAttempts": 3,
                "backoff": "exponential",
                "initialDelayMs": 500
            }       
        },
        "actionsMode": "sequential", // sequential or parallel, default is sequential
        "actions": [ 
            { // This calls anoter workflow in the architecture.
                "name": "CheckProjectDuplicationWorkflow",
                type: "workflow",
                "description": "Create a new project record",
                inputs: {
                    "project": fn(obj) => { return obj.project; }
                },
            },
            { // This calls another activity in the same workflow.
                "name": "RunValidation",
                type: "activity",
                "description": "Run validation on the project",
                inputs: {
                    "project": fn(obj) => { return obj.project; }
                },
            },
            { // This calls an action/function
                type: "action"
                name: "UpdateProjectRecord",
                "description": "Update the project record",
                fn: (ctx) => { return ctx; },
            }       
        ],
    }
}
```
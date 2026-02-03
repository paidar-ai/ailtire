const fs = require("fs");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Action for an Activity  in a Workflow',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            type: 'string',
            description: 'Name of the executable',
            required: true,
        },
        description: {
            type: 'string',
            description: 'Description of the executable',
            required: true,
        },
        inputs: {
            type: 'json',
            description: 'Input parameters for this executable'
        },
        timeoutMs: {
            type: 'number',
            description: 'Optional max time (ms) before this action is considered failed',
            required: false
        },
        retryPolicy: {
            type: 'json',
            description: '{ maxAttempts, backoff: "fixed"|"exponential", initialDelayMs } – overrides activity policy if present.',
            required: false
        },
        outputs: {
            type: 'json',
            description: 'Outputs for this executable. Including a description of the output parameters.',
        },
        fn: {
            type: 'function',
            description: 'Function to execute when this executable is invoked. It should take in the inputs and return the outputs.',
        }
    },
    outputs: {
        "type": "AWorkflow", "description": "My Return Value"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {name, description, workflow} = inputs;

        let nameNoSpace = name.replace(/ /g, '');
        let wfFile = "";
        let wfDef = inputs;

        for (let aname in wfDef) {

        }
        if (!fs.existsSync(wfFile)) {
            fs.mkdirSync(path.dirname(wfFile), {recursive: true});
            fs.writeFileSync(ucFile, `module.exports = ${JSON.stringify(wfDef, null, 4)};`);
        }
        let retval = AWorkflow.load({file: wfFile, package: package});

        // obj has the obj for the method.
        return retval;
    }
};


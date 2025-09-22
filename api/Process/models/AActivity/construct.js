const fs = require("fs");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Use Case for the application or package',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            type: 'string',
            description: 'Unique activity name. If the name is Init it will automatically trigger when the workflow starts.',
            required: true
        },
        description: {type: 'string', description: 'What this activity does'},
        triggers: {
            type: 'json',
            description: 'List of triggers that can be used to start this activity. Most triggers are events generated ' +
                'from the workflow including the ActivityName.stateName where stateName is one of the following states.' +
                '[Init, Waiting, Blocked, Triggered, Running, TimedOut, Failed, Succeeded, Cancelled]',
            required: true
        },

        inputs: {type: 'json', description: 'Input parameter definitions'},
        variables: {type: 'json', description: 'Computed variables during execution'},
        outputs: {type: 'json', description: 'Output parameter definitions'},

        onError: {
            type: 'json',
            description: 'Called when the Activity moves into an error state. Should follow this format: { description: "...", fn: (obj) => { ... }'
        },
        onStart: {
            type: 'json',
            description: 'Called when the Activity moves into a started state. Should follow this format: { description: "...", fn: (obj) => { ... }'
        },
        onComplete: {
            type: 'json',
            description: 'Called when the Activity moves into a finished state. Should follow this format: { description: "...", fn: (obj) => { ... }'
        },
        actionsMode: {
            type: 'enum',
            description: 'How to handle actions: "parallel", "sequential"',
            values: ['parallel', 'sequential']
        },
        actions: {type: 'json', description: 'List of actions that can be used to complete this activity'},
        policies: {type: 'json', description: 'List of policies that can be used to complete this activity'},
        workflow: {type: 'AWorkflow', description: 'The workflow that this activity is part of', required: true},
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


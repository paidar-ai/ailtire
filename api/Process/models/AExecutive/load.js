const path = require('path');
const {workflow} = require("../../../../src/Documentation/api");

module.exports = {
    friendlyName: 'load',
    description: 'Load the executable from the definition.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    "definition": {
        "type": "string",
        "description": "MY Description of the input",
        "required": false
    },
        activity: {
        type: "AActivity",
        description: "The activity that owns the executable",
        required: true
        }
},
    outputs: {
        "type": "AExecutable",
        "description": "The appropriate concreate executable.",
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let { input1 } = inputs;
        let def = inputs.definition;
        let retval;

        // obj has the obj for the method.
        switch (def.type) {
            case "action": {
                retval = new AAction(def);
                break;
            }
            case "activity": {
               retval = new AActivityCall(def);
                break;
            }
            case "workflow": {
               retval = new AWorkflowCall(def);
                break;
            }
        }
        return retval;
    }
};

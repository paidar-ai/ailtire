const AOpenAI = require("../../../../src/AI/AOpenAI");
const AOVMS = require("../../../../src/AI/AOVMS");
const AOLlama = require("../../../../src/AI/AOLlama");

module.exports = {
    friendlyName: 'create',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},
    outputs: {
        "retval": {
            "type": "GenAIProvider",
            "description": "A newly created GenAIProvider instance."
        }
    },
    exits: {},

    fn: function (obj, inputs, env) {
        if (!obj.adaptorName) {
            obj.adaptorName = "ollama";
        }
        switch (obj.adaptorName) {
            case "ollama":
                obj._adaptor = new AOLlama(obj._attributes);
                break;
            case 'openai':
                obj._adaptor = new AOpenAI(obj._attributes);
                break;
            case 'ovms':
                obj._adaptor = new AOVMS(obj._attributes);
                break;
            default:
                obj._adaptor = new AOLlama(obj._attributes);
                break;
        }
        return obj;
    }
};

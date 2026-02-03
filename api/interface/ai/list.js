const AIHelper = require('../../../src/Server/AIHelper.js');

module.exports = {
    friendlyName: 'list',
    description: 'List the ai models that are available',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
        type: 'Array',
        description: "List of LLM Models available",
        properties: {
            adaptor: {
                type: 'string',
                description: "The Adaptor of LLM Model",
            },
            name: {
                type: 'string',
                description: "The name of the LLM Model",
            }
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        }
    },

    fn: async function (inputs, env) {
        let aiModels = global.ailtire.config.aiModels;
        let retval = {};
        for(let aname in aiModels) {
            retval[aname] = aiModels[aname].models;
        }
        return retval;
    }
};

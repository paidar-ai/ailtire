
const fs = require("fs");
module.exports = {
    friendlyName: 'generateAssociations',
    description: 'Generate Associations',
    static: true,
    inputs: {
        id: {
            description: 'The id of the model',
            type: 'string',
            required: true
        },
        scope: {
            description: 'The scope of the generation',
            type: 'string',
            required: true
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (inputs, env) {
        // Find the scenario from the usecase.
        let cname = inputs.id;
        let scope = inputs.scope;
        switch (scope) {
            case "attributes":
                return await AClass.generateAttributes(cname);
                break;
            case "description":
                return await AClass.generateDescription(cname);
                break;
            case "associations":
                return await AClass.generateAssociations(cname);
                break;
            case "documentation":
                return await AClass.generateDocumentation(cname);
                break;
            case "methods":
                return await AClass.generateMethods(cname);
                break;
            case "statenet":
                return await AClass.generateStateNet(cname);
                break;
            default:
                return await AClass.generateDocumentation(cname);
                break;
        }
    }
};

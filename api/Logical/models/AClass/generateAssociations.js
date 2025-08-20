const fs = require("fs");
const AIHelper = require("../../../../src/Server/AIHelper");
module.exports = {
    friendlyName: 'generateAssociations',
    description: 'Generate Associations',
    static: false,
    inputs: {
        prompt: {
            type: 'string',
            description: 'The prompt to use for the generation',
            required: false
        }
    },

    exits: {
        json: (obj)  => { return obj; },
    },

    fn: async function (obj, inputs, env) {
        // Find the scenario from the usecase.
        let json = JSON.stringify(obj);
        let messages = [];
        messages.push({role: 'system', content: `Use the following class for analysis of the user prompt: ${json}`});
        messages.push({
            role: 'system',
            content: `Use the following association definition for the generation of any associations: ${associationFormat}`
        });
        messages.push({
            role: 'user', content: "Generate a associations for the class. Create JSON structure for the" +
                " statenet following the Association Format. Only return the json."
        });
        let associations = await AIHelper.askForCode(messages);
        obj.definition.associations = associations;
        _save(obj);
        return obj;
    }
};

const associationFormat = `
    assocName1: {
        name: "assocName1",
        description: "description 1",
        type: "ModelName" // Name of the class in the association.
        cardinality: 1 // This is 1 or 'n'
        composition: true | false // True if the model controls the object in this relationship.
        owner: true | false // True if propigation of create and destroy happens
        via: 'name of association' // Only set if the owner is true and will create a association on the child  object.
    },
    assocName2 : { ... }
    ...
`;
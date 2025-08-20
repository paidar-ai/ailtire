const path = require('path');

module.exports = {
    friendlyName: 'generateModels',
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
        "description": "ANote with the models attached to it"
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {

        const modelFormat = `
    {
        name: 'class name',
        description: 'class description',
        package: 'package name',
        attributes: {
            "attributeName1": {
                name: "attributeName1",
                description: "attributeName1 description",
                type: "Attribute1Type",
            },
            "attributeName2: { ... },
            ...
        }
        associations: {
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
        },
    };
    `;
        let messages = [];
        let package = global.topPackage;
        // Get the current usecases, class definitions, and workflows
        // Put them into a string and put them as system information.
        let items = ["classes", "packages"];
        for (i in items) {
            let content = `Use the following ${items[i]} for analysis of the user prompt:`;
            for (let name in global[items[i]]) {
                let obj = global[items[i]][name];
                content += JSON.stringify(obj);
                // content += `{ name:${obj.name}, description:${obj.description} }\n`;
            }
            messages.push({role: 'system', content: content});
        }
        // Get the current documentation. Add it as system information.
        messages.push({role: 'system',
            content: `From the user prompt identify and generate classes using the following as a` +
                ` template: ${modelFormat}. Output should be in an array of json objects. Only return the json.`});
        if(inputs.prompt) {
            messages.push({role: 'user', content: inputs.prompt});
        }
        messages.push({ role: 'user', content: obj.text });
        let models = await AIHelper.askForCode(messages);
        try {
            // Iterate over the list of use cases and save them.
            for (let i in models) {
                let model = models[i];
                obj.addItem({type: 'AClass', json: model});
            }
            return obj;
        } catch (e) {
            console.error("Error parsing JSON:", response, e);
        }
    }
};

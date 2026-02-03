const AIHelper = require('../../../src/Server/AIHelper.js');

module.exports = {
    friendlyName: 'ask',
    description: 'Asks Gear AI something',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        prompt: {
            description: 'The User Prompt for ailtire design.',
            type: 'string', // string|boolean|number|json
            required: true,
        },
        context: {
            description: 'Context of the prompt',
            type: 'string',
            required: false,
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        }
    },

    fn: async function (inputs, env) {
        let messages = [];
        let context = inputs.context || ':';
        let systemPrompt= "";
        let systemInfo = "";
        let event = context.split(':')[0];
        switch (event) {
            case 'Layer': {
                    let [event, layerName] = context.split(':');
                    systemPrompt = "You are a enterprise architect that is helping an organization map their current environment" +
                        " including people, process and technology to the GEAR Architecture. The GEAR architecture is a " +
                        "conceptual architecture that is used to capture and map current environments and identify gaps. " +
                        "The GEAR Architecture is has the following layers. Use this architecture to help map the organization's " +
                        "organizational architecture, process, technology and physical hardware environments. Here are the layers: "
                    let layer = await Layer.find(layerName)
                    let layersJSON = layer.convertJSON();
                    systemInfo = JSON.stringify(layersJSON);
                }
                break;
            case 'Element': {
                    let [event, elementName] = context.split(':');
                    systemPrompt = "You are a enterprise architect that is helping an organization map their current environment" +
                        " including people, process and technology to the GEAR Architecture. The GEAR architecture is a " +
                        "conceptual architecture that is used to capture and map current environments and identify gaps. " +
                        "The GEAR Architecture is has the following layers. Use this architecture to help map the organization's " +
                        "organizational architecture, process, technology and physical hardware environments. Here are the layers: "
                    let element = await Element.find(elementName);
                    let elementJSON = element.convertJSON();
                    systemInfo = JSON.stringify(elementJSON);
                }
                break;
            case 'Partner': {
                    let [event, partnerName] = context.split(':');
                    systemPrompt = "You are a enterprise architect that is helping an organization map their current environment" +
                        " including people, process and technology to the GEAR Architecture. The GEAR architecture is a " +
                        "conceptual architecture that is used to capture and map current environments and identify gaps. " +
                        "The GEAR Architecture is has the following layers. Use this architecture to help map the organization's " +
                        "organizational architecture, process, technology and physical hardware environments. Here are the layers: "
                    if(partnerName) {
                        let partner = await Partner.find(partnerName);
                        let partnerJSON = partner.convertJSON();
                        systemInfo = JSON.stringify(partnerJSON);
                    } else {
                        let partners = await Partner.instances();
                        let partnerJSON = {};
                        for (let pname in partners) {
                            partnerJSON[pname] = partners[pname].convertJSON();
                        }
                        systemInfo = JSON.stringify(partnerJSON);
                    }
                }
                break;
            case 'Customer': {
                    let [event, customerName] = context.split(':');
                    systemPrompt = "You are a enterprise architect that is helping an organization map their current environment" +
                        " including people, process and technology to the GEAR Architecture. The GEAR architecture is a " +
                        "conceptual architecture that is used to capture and map current environments and identify gaps. " +
                        "The GEAR Architecture is has the following layers. Use this architecture to help map the organization's " +
                        "organizational architecture, process, technology and physical hardware environments. Here are the layers: "
                    if(customerName) {
                        let customer = await Customer.find(customerName);
                        let customerJSON = customer.convertJSON();
                        systemInfo = JSON.stringify(customerJSON);
                    } else {
                        let customers = await Customer.instances();
                        let customerJSON = {};
                        for (let cname in customers) {
                            customerJSON[cname] = customers[cname].convertJSON();
                        }
                        systemInfo = JSON.stringify(customerJSON);
                    }
                }
                break;
            default:
                systemPrompt = "You are a enterprise architect that is helping an organization map their current environment" +
                    " including people, process and technology to the GEAR Architecture. The GEAR architecture is a " +
                    "conceptual architecture that is used to capture and map current environments and identify gaps. " +
                    "The GEAR Architecture is has the following layers. Use this architecture to help map the organization's " +
                    "organizational architecture, process, technology and physical hardware environments. Here are the layers: "
                let layers = await Layer.instances();
                let layersJSON = {};
                for (let lname in layers) {
                    if(!lname.includes('-')) {
                        layersJSON[lname] = layers[lname].convertJSON();
                    }
                }
                systemInfo = JSON.stringify(layersJSON);
                break;

        }
        messages.push({
            role: 'system',
            content: systemPrompt,
        });
        messages.push({
            role: 'system',
            content: systemInfo,
        });

        messages.push({
            role: 'user',
            content: inputs.prompt,
        });
        let results = await AIHelper.ask(messages);
        return results;
    }
};

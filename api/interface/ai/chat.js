// src/Command/interactivePrompt.js
const readline = require('readline');
const AIHelper = require('../../../src/Server/AIHelper.js');

module.exports = {
    friendlyName: 'chat',
    inputs: {
        prompt: {
            type: 'string',
            description: 'The prompt to send to the AI.',
            required: true
        }
    },
    outputs: {
        type: 'string',
        description: 'The response from the AI.',
    },
    exits: {},
    description: 'Open an interactive prompt→response session',
    fn: async (inputs,env) => {
        // First, ensure AI is initialized
        let messages = [];
        messages.push({role: 'system', content: 'You are AI Assistant. Respond concisely.'});
        messages.push({role: 'user', content: inputs.prompt});
        let retval = await AIHelper.ask(messages,env);
        return retval;
    }
};
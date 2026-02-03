const fs = require('fs');
const path = require('path');

module.exports = {
    friendlyName: 'load',
    description: 'Load a GenAIProvider from .ailtire/GenAIProvider/',
    static: true, // Class method that returns a new instance
    inputs: {
        fileName: {
            type: 'string',
            required: true,
            description: 'The filename of the provider to load (filename without .json)'
        }
    },
    outputs: {
        retval: {
            type: 'GenAIProvider',
            description: 'The loaded GenAIProvider instance'
        }
    },
    exits: {
        notFound: {
            description: 'No saved provider file was found by that name'
        },
        json: (obj) => obj
    },

    fn: function (inputs, exits) {
        // Build the file path

        const filePath = path.resolve(inputs.fileName);

        // Check existence
        if (!fs.existsSync(filePath)) {
            return exits.notFound();
        }

        // Read and parse
        const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Reconstruct the provider
        let provider;
        provider = new GenAIProvider({
            name: json.name,
            adaptorName: json.adaptorName,
            apiKey: json.apiKey,
            defaultModelName: json.defaultModelName
        });

        // Return the instance
        return provider;
    }
};
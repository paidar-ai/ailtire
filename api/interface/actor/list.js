// const renderer = require('../../src/Documentation/Renderer.js');

module.exports = {
    friendlyName: 'list',
    description: 'List the Actors',
    inputs: {
        
    },
    outputs: {
        type: "array",
        description: "Array of Actors",
        properties: {
            type: "json",
            description: "AActor Objects, {name: description}"
        }
    },
    exits: {
        json: (obj) => { return obj; },
        success: (obj) => { return obj; }
    },

    fn: function (inputs, env) {

        // Return the name and description of each actor. from the global.actors
        let result = '';
        for (let name in global.actors) {
            result += `${name}: ${global.actors[name].description}\n`;
        }
        return result;
    }
};



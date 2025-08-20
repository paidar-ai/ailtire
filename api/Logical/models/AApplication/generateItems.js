const path = require('path');

module.exports = {
    friendlyName: 'generateItems',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "note": {
            "type": "ANote",
            "description": "This is a note about the project used to generate items.",
            "required": true
        },
        "filter": {
            type: 'string',
            description: 'Filter to use to selected the types of items returned. this is a comma separated list of types.',
            required: false
        },
        "prompt": {
            type: 'string',
            description: 'Prompt to use to generate the items. Inconjunction with the note, this is used to generate the items.',
            required: false
        }
    },
    outputs: {
        "type": "Array",
        "description": "Return an array of suggestions of items to create in the applications",
        "schema": {
            type: 'AItem',
            description: 'A suggestion of an item to create in the application'
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let {note, filters, prompt} = inputs.note;

        await note.generateItems({prompt: prompt, filters: filters});
        return note;
    }
};

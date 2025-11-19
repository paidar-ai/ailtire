const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a new note',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "text": {
            "type": "string",
            "description": "Text of the note",
            "required": true
        },
        "name": {
            "type": "string",
            "description": "Name of the note",
            "required": false
        },
    },
    outputs: {
            "type": "ANote",
            "description": "A new note created for the application"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function(inputs, env) {
        // inputs contains the obj for the this method.
        let { name, text } = inputs;
        let noteDef = {
            name: name,
            text: text,
            createdDate: new Date()
        }
        // obj has the obj for the method.
        let note = new ANote(noteDef);

        let filename = path.resolve(global.ailtire.config;.baseDir, ".notes", note.id + ".js");
        fs.writeFileSync(filename, `module.exports = ${JSON.stringify(noteDef, null, 2)};`);

        await note.generateSummary();

        return note;
    }
};

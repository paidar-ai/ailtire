const fs = require('fs');
const path = require('path');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "dir": {
            "type": "string",
            "description": "Load All of the notes of the applications.",
            "required": true
        }
    },
    outputs: {
            "type": "Array",
            "description": "An array of ANotes loaded from the directory",
            properties: {
                type: "ANote",
                description: "The ANote loaded from the file"
            }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {dir} = inputs;
        // obj has the obj for the method.
        let files = fs.readdirSync(dir);
        let notes = [];
        for(let i in files) {
            let filename = path.resolve(dir, files[i]);
            let note = ANote.load({file: filename});
            notes.push(note);
        }
        return notes;
    }
};

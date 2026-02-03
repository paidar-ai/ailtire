const path = require('path');
module.exports = {
    friendlyName: 'load',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "file": {
            "type": "file",
            "description": "Load the note of the applications.",
            "required": true
        }
    },
    outputs: {
            "type": "ANote",
            "description": "The ANote loaded from the file"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {file} = inputs;
        // obj has the obj for the method.
        let noteDes = require(file);
        let noteDef = {
            name: noteDes.name,
            text: noteDes.text,
            createdDate: new Date(noteDes),
            id: path.basename(file).replace(/\.js/,'')
        }
        let note = new ANote(noteDef);
        for (let i in noteDes.items) {
            let itemObj = AItem.load({definition: noteDes.items[i]});
            note.addToItems(itemObj);
            itemObj.note = note;
        }
        return note;
    }
};

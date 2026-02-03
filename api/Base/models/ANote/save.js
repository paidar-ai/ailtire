const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
    description: 'Save the note to the file system',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
        "type": "ANote",
        "description": "ANote is saved to the file system"
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let filename = path.resolve(global.ailtire.config.baseDir, ".notes", obj.id + ".js");
        let noteDef = {}
        for(let i in obj._attributes) {
            if(i !== 'id') {
                noteDef[i] = obj._attributes[i];
            }
        }
        noteDef.items = [];
        let items = obj.items;
        for(let i in items) {
            let myItem = items[i];
            let myItemJSON = myItem.save();
            noteDef.items.push(myItemJSON);
        }
        fs.writeFileSync(filename, `module.exports = ${JSON.stringify(noteDef, null, 2)};`);
        return obj;
    }
};

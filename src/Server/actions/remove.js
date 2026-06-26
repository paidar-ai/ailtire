const AClass = require('../AClass');

module.exports = {
    friendlyName: 'remove',
    description: 'Remove items from the object',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'Name of the object',
            type: 'string',
            required: false
        },
        items: {
            description: "Name of the items to remove",
            type: 'string',
            required: false
        },
    },

    exits: {},

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let modelName = env.req.url.split(/\//)[1];
        if (inputs.mode === 'json') {
            // Items
            let name = env.req.body.name; // name of the object to remove items.
            let obj = AClass.getClass({name: modelName}).find(name);
            if (!obj) {
                env.res.json({results: `Could not find ${modelName} named ${name}`});
                return;
            }
            if (env.req.body.hasOwnProperty('items')) {
                let items = env.req.body.items.split(',');
                let assocName = this.assocName;
                let assoc = obj.definition.associations[assocName];
                let assocUpper = assocName[0].toUpperCase() + assocName.slice(1);
                let removeMethod = `removeFrom${assocUpper}`;

                for (let i in items) {
                    // Try to find the item first if it's an ID
                    let item = items[i];
                    // Call the removeFromXXX method
                    if (obj[removeMethod]) {
                        obj[removeMethod](item);
                    }
                }
            }
            let jobj = obj.toJSON;
            global.io.emit(modelName + '.update', {obj: jobj});
            env.res.json({results: "Removed items from: " + obj.name});
        } else {
             env.res.json({results: "Remove only supported via JSON for now"});
        }
    }
};

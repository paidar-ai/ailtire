const path = require('path');
module.exports = {
    friendlyName: 'create',
    description: 'Create an actor',
    static: false,
    inputs: {
        name: {
            description: 'The name of the actor',
            type: 'string',
            required: true
        },
        shortName: {
            description: 'The name of the actor',
            type: 'string',
            required: false
        },
        description: {
            description: 'The description of the actor',
            type: 'string',
            required: false
        },
        dontSave: {
            description: 'Do not save the actor. This is used to prevent recursive writting of the object to the directory. Typicaly passed by the load method',
            type: 'boolean',
            default: false
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        for(let aname in inputs) {
            if(aname !== 'dontSave') {
                obj[aname] = inputs[aname];
            }
        }
        global.actors[obj.name.replace(/\s/g, '')] = obj;
        if(!inputs.dontSave) {
            obj.save();
        }
        return obj;
    }
};


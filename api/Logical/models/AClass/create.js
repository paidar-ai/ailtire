const path = require('path');
module.exports = {
    friendlyName: 'create',
    description: 'Create an model',
    static: true,
    inputs: {
        name: {
            description: 'The name of the model',
            type: 'string',
            required: true
        },
        package: {
            description: 'The name of the package',
            type: 'string',
            required: false
        },
        dontSave: {
            description: 'Use this to tell the new object being created does not need to be saved. Typically used for the load function',
            type: 'boolean',
        }
    },

    exits: {
    },

    fn: function (inputs, env) {
        for(let aname in inputs) {
            if(aname !== 'dontSave') {
                obj[aname] = inputs[aname];
            }
        }
        global.classes[obj.name.replace(/\s/g, '')] = obj;
        if(!dontSave) {
            obj.save();
        }
        return obj;
        /* api.model(inputs.package, inputs.name, '.');
        return `Model: ${inputs.name} created`;

         */
    }
};


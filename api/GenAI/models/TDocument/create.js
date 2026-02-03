const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'create',
    description: 'Create the TDocument into Memory',
    static: false,
    inputs: {
    },

    exits: {
        json: (obj) => {
            return obj;
        },
        success: (obj) => {
            return obj;
        },
        notFound: (obj) => {
            console.error("Object not Found:", obj);
            return null;
        },
    },


    fn: function (obj, inputs, env) {

        for(let iname in inputs) {
            obj[iname] = inputs[iname];
        }
        obj.uploadedAt = new Date();

        if(inputs.loading) {
            obj._state = obj._state;
        }

        return obj;
    }
};
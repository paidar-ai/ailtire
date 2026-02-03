const path = require('path');
const fs = require('fs');


module.exports = {
    friendlyName: 'getNode',
    description: 'Get Node by Name',
    static: false,
    inputs: {
        name: {
            type: 'string',
            description: "Name of the Node",
        }
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


    fn: async function (obj, inputs, env) {
        for(let i in obj.nodes) {
            if(obj.nodes[i].name === inputs.name) {
                return obj.nodes[i];
            }
        }
        return null;
    }
};
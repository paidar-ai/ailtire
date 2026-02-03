const path = require('path');
const fs = require('fs');
const keytar = require('keytar');
const SERVICE = 'ailtire';

module.exports = {
    friendlyName: 'loggedIn',
    description: 'The Identity has Logged In',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
            "type": "AIdentity",
            "description": "The AIdentity from the file object stored.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        let now = new Date();
        obj.lastLoggedIn = now;
        obj.save();
        return obj;
    }
};

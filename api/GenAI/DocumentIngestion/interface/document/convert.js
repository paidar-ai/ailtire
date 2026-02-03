const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'convert',
    description: 'Convert the document into a set of DocumentNodes attached to the document specified',
    static: false,
    inputs: {
        document: {
            type: 'ref',
            description: 'The document to convert',
            required: true,
        },
        config: {
            type: 'json',
            description: 'The configuration for the conversion',
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
            return {status: 401, message: "notFound"};
        },
    },


    fn: function (obj, inputs, env) {
        let document = inputs.document;
        if(!document) {
            throw "notFound not found";
        }
        if(typeof document === 'string') {
            document = Document.get(document);
        }

        let retval = DocumentReader.convert({document: document, config: inputs.config});

        return retval;
    }
};
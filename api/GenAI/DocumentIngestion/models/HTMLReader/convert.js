const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'convert',
    description: 'Convert the document into a set of DocumentNodes attached to the document specified',
    static: true,
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
            console.error("Object not Found:", obj);
            return null;
        },
    },


    fn: async function (obj, inputs, env) {

        let document = inputs.document;
        document.docType = "HTML";

        if (typeof document === 'string') {
            document = TDocument.find({id: document});
        }
        let url = document.url;

        const reader = new llamaindex.HTMLReader();
        const documents = await reader.loadData(url);

        for(let i in documents) {
            let doc = documents[i];
            let node = document.addToNodes({text: doc.text,name: doc.id_, metadataSeparator: '\n', metadata: doc.metadata});
            node.save();
        }
        document.save();
        return document;
    }
};
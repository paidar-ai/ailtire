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

        if (typeof document === 'string') {
            document = TDocument.find({id: document});
        }
        document.docType = "CSV";
        let url = document.url;

        let ext = path.extname(url);
        let filename = path.resolve(url);
        fileText = fs.readFileSync(filename, 'utf-8');
        let lines = fileText.split("\n");
        document.save();
        for(let i in lines) {
            let node = document.addToNodes({text: lines[i],name: `row_${i}`, metadataSeparator: '\n', metadata: {row: i,url: url}});
            node.save();
        }
        document.save();
        return document;
    }
};
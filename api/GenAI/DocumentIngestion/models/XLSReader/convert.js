const path = require('path');
const fs = require('fs');
// const xlsx = require("xlsx");

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
        document.docType = "XLS";

        if (typeof document === 'string') {
            document = TDocument.find({id: document});
        }
        let url = document.url;


        let workbook = xlsx.readFile(url);
        let textArray = [];
        for (let i in workbook.SheetNames) {
            const sheetName = workbook.SheetNames[i];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: 1});
            for(let j in jsonData) {
                let node = document.addToNodes({
                    text: jsonData[j].join(','),
                    name: `${sheetName}_${j}`,
                    metadataSeparator: '\n',
                    metadata: {sheetName: sheetName, row: j, url: url}
                });
                node.save();
            }
        }
        document.save();
        return document;
    }
};
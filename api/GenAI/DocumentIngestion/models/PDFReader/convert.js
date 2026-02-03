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

            // PDF + Vision LLM imports
            const { PDFReader } = await import('@llamaindex/readers/pdf');

            let document = inputs.document;
            document.docType = "PDF";

            if (typeof document === 'string') {
                document = TDocument.find({ id: document });
            }
            let url = document.filename;


            // PDF reader with OCR + image parsing
            const reader = new PDFReader({
                ocr: "tesseract",   // fallback OCR for scanned pages
                parseImages: false,  // extract images
            });

            // Load and chunk the PDF into documents
            const documents = await reader.loadData(url);

            for (let i in documents) {
                let doc = documents[i];

                // Ensure metadata object exists
                doc.metadata = doc.metadata || {};

                // Preserve page if provided by the reader, otherwise default to 1
                const page = doc.metadata.page ?? 1;
                doc.metadata.position = { paragraph: Number(i), page };

                // Create a node on your document
                let node = document.addToNodes({
                    text: doc.text,
                    name: doc.id_ || `chunk-${i}`,
                    metadataSeparator: '\n',
                    metadata: doc.metadata,
                });
                node.save();
            }

            document.save();
            return document;
        }
    };
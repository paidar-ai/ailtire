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
            document = Document.find({id: document});
        }
        let url = document.name;
        // document.state = "Converting";
        document.convert();
        document.save();

        let ext = path.extname(url);
        let filename = path.resolve(document.filename);
        let retval;
        switch (ext) {
            case '.pdf':
                try {
                    retval = await PDFReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing PDF Error: ", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.docx':
                try {
                    retval = await WordReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Word Doc Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.doc':
                try {
                    retval = await WordReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Word Doc Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.html':
                try {
                    retval = await HTMLReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing HTML Doc Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.xlsx':
                try {
                    retval = await XLSReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Excel Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.xls':
                try {
                    retval = await XLSReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Excel Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.csv':
                try {
                    retval = await CSVReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Comma Separated Value File Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.js':
                try {
                    retval = await JSONReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Javascript File Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.json':
                try {
                    retval = await JSONReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Javascript File Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            case '.md':
                try {
                    retval = await MDReader.convert({document: document, config: inputs.config});
                } catch (e) {
                    console.error("Processing Javascript File Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
            default:
                try {
                    retval = fs.readFileSync(filename, 'utf-8');
                }
                catch(e) {
                    console.error("Processing Javascript File Error:", e);
                    document.failed();
                    document.save();
                    return {status: "Error", message: e.message};
                }
                break;
        }
        document.complete();
        document.save();

        return {status: "Completed", message: "Document Converted"};
    }
};
const path = require('path');
/* const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
*/

module.exports = {
    friendlyName: 'runConversion',
    description: 'Convert TDocument to text',
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


    fn: async function (obj, inputs, env) {
        // look at the extension on how to process it.
        let url = obj.url;
        let ext = path.extname(url);
        let filename = path.resolve(url);
        let fileText = "";
        switch (ext) {
            case '.pdf':
                try {
                    let dataBuffer = fs.readFileSync(filename);
                    let data = await pdf(dataBuffer);
                    fileText = data.text;
                } catch (e) {
                    console.error("Processing PDF Error: ", e);
                }
                break;
            case '.docx':
                try {
                    let dataBuffer = fs.readFileSync(filename);
                    let data = await mammoth.extractRawText({buffer: dataBuffer});
                    fileText = data.value;
                } catch (e) {
                    console.error("Processing Word Doc Error:", e);
                }
                break;
            case '.doc':
                try {
                    let dataBuffer = fs.readFileSync(filename);
                    let data = await mammoth.extractRawText({buffer: dataBuffer});
                    fileText = data.value;
                } catch (e) {
                    console.error("Processing Word Doc Error:", e);
                }
                break;
            case '.html':
                try {
                    let dataText = fs.readFileSync(filename, 'utf8');
                    const $ = cheerio.load(dataText);
                    fileText = $('body').text();
                } catch (e) {
                    console.error("Processing HTML Error:", e);
                }
                break;
            case '.xlsx':
                try {
                    let workbook = xlsx.readFile(filename);
                    let textArray = [];
                    for (let i in workbook.SheetNames) {
                        const sheetName = workbook.SheetNames[i];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: 1});
                        textArray.push(`{ sheetName: ${sheetName}, table: ${JSON.stringify(jsonData)} }`);
                    }
                    fileText = textArray.join(',\n');
                } catch (e) {
                    console.error("Processing XLSX Error:", e);
                }
                break;
            case '.xls':
                try {
                    let workbook = xlsx.readFile(filename);
                    let textArray = [];
                    for (let i in workbook.SheetNames) {
                        const sheetName = workbook.SheetNames[i];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = xlsx.utils.sheet_to_json(worksheet, {header: 1});
                        textArray.push(`{ sheetName: ${sheetName}, table: ${JSON.stringify(jsonData)} }`);
                    }
                    fileText = textArray.join(',\n');
                } catch (e) {
                    console.error("Processing XLSX Error:", e);
                }
                break;
            default:
                fileText = fs.readFileSync(filename, 'utf-8');
                break;
        }
        // Now store the text in a file for the mappings.
        let textFileName = path.resolve(`./.uploads/mapping/${url}.txt`);
        fs.writeFileSync(textFileName, fileText);
        obj.rep = textFileName;
        obj.save();
        return obj;
    }
};
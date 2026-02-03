const fs = require('fs');

module.exports = {
    friendlyName: 'upload',
    description: 'Upload a document to be used by the AI',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        file: {
            description: 'File to upload',
            type: 'file',
            required: true
        }
    },

    exits: {
        json: (obj) => { return obj; },
    },

    fn: function (inputs, env) {
        let file = inputs.file;

        const filePath = file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const doc = new TDocument({
            name: file.originalname,
            filename: file.path});
        return doc.id;
    }
};

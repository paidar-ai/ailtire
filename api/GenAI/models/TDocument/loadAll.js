const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'loadAll',
    description: 'Load all of the the documents from the database. This only loads the metadata. The DocumentNodes are loaded as when accessed',
    static: true,
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


    fn: function (obj, inputs, env) {

        let dname = path.resolve(`.database/TDocument/`);
        fs.mkdirSync(dname, { recursive: true });
        let docFiles = fs.readdirSync(dname);
        for(let i in docFiles) {
            TDocument.load({directory: path.resolve(dname, docFiles[i])});
        }
        return;
    }
};
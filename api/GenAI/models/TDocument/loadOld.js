const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'load',
    description: 'Load the document from the database',
    static: true,
    inputs: {
        directory: {
            description: 'Directory to load the document from',
            type: 'string',
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


    fn: function (obj, inputs, env) {

        let directory = inputs.directory;
        let indexFile = path.resolve(`${directory}/index.js`);
        let tempObj = require(indexFile);
        tempObj._loading = true;
        let retval = new TDocument(tempObj);
        _loadNodes(obj, directory);
        retval._state = tempObj.state;
        return retval;
    }
};
function _loadNodes(obj, directory) {
    let files = fs.readdirSync(directory);
    if(!obj._nodes) {
        obj._nodes = [];
    }
    for(let i in files) {
        let file = files[i];
        if(file.startsWith('TDocumentNode')) {
           obj._nodes.push(file);
        }
    }
}
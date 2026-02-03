const fs = require("fs");
const AIHelper = require('../../../../src/Server/AIHelper');
const path = require("path");

module.exports = {
    friendlyName: 'getDocumentation',
    description: 'Return a string representing the documentation.',
    static: false,
    inputs: {
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        let actor = obj;
        let retval = "";
        let bdir = actor.doc.basedir;
        for (let i in actor.doc.files) {
            let dfile = path.resolve(`${bdir}/${actor.doc.files[i]}`);
            let extName = path.extname(dfile);
            if (extName === '.puml' || extName === '.emd' || extName === '.md') {
                retval += fs.readFileSync(dfile, 'utf-8');
            }
        }
        return retval;
    }
};
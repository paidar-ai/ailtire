const fs = require("fs");

module.exports = {
    friendlyName: 'set',
    description: 'Set an Package documentation',
    static: true,
    inputs: {
        id: {
            description: 'Id of the Package',
            type: 'string',
            required: true
        },
        summary: {
            descritpion: 'Summary of the Package',
            type: 'string',
            required: false
        },
        document: {
            descritpion: 'Documentation of the Package',
            type: 'string',
            required: false
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        // Find the actor from the usecase.
        console.log("INPUTS:", inputs);
        let package = APackage.getPackage(inputs.id);
        if(package) {
            package.description = inputs.summary;
            if(package.doc && package.doc.basedir) {
                fs.writeFileSync(package.doc.basedir + '/doc.emd', inputs.documentation)
            }
            let depends = [];
            for(let i in package.depends) {
               depends.push(package.depends[i].name);
            }
            let savepackage = {
                shortname: package.shortname,
                name: package.name,
                description: package.description,
                color: package.color,
                depends: depends,
            }
            let pkgDef = `module.exports = ${JSON.stringify(savepackage, null, 3)} ;`;
            let filename = package.dir + '/index.js';
            fs.writeFileSync(filename, pkgDef);

            if(env.res) {
                env.res.end('updated');
            }
            return package;
        } else {
            console.error("Could not find the UseCaser:", ucname);
            env.res.status(500).send({error: "UseCase could not be found"});
        }
        return null;
    }
};

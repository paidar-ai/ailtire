const APackage = require('../../src/Server/APackage');
const fs = require("fs");

module.exports = {
    friendlyName: 'get',
    description: 'Get the Packages',
    inputs: {
        id: {
            description: 'The name of the package',
            type: 'string',
            required: true
        },
        doc: {
            description: 'Get the documentation of the package',
            type: 'boolean',
            required: false
        }
    },

    fn: function (inputs, env) {
        try {
            let package = APackage.getPackage(inputs.id);
            let jpackage = processPackage(package, true);
            if(env.res) {
                if(inputs.doc) {
                    if(package.doc && package.doc.basedir) {
                        if(fs.existsSync(package.doc.basedir + '/doc.emd')) {
                            jpackage.document = fs.readFileSync(package.doc.basedir + '/doc.emd', 'utf8');
                        } else {
                            jpackage.document = "Enter documentation here.";
                        }
                    }
                }
                env.res.json(jpackage);
            }
        }
        catch(e) {
            console.error(e);
            env.res.json({error:`Package not found ${inputs.id}`});
        }
    }
};
function processPackage(package, depth = false) {
    let jpackage = {
        name: package.name,
        shortname: package.shortname,
        description: package.description,
        color: package.color,
        prefix: package.prefix,
        listenPort: package.listenPort,
        deploy: package.deploy,
        doc: package.doc,
        depends: {},
        interface: {},
        classes: {},
        usecases: {},
        subpackages: {},
        handlers: {},
        workflows: {}
    }

    for(let iname in package.interface) {
        let intrface = package.interface[iname];
        jpackage.interface[iname] = {
            friendlyName: intrface.friendlyName,
            description: intrface.description,
            inputs: intrface.inputs,
            static: intrface.static
        };
    }
    if(depth) {
        for (let dname in package.depends) {
            let depend = package.depends[dname];
            jpackage.depends[depend.shortname] = processPackage(depend);
        }
        for (let spackage in package.subpackages) {
            jpackage.subpackages[spkg] = processPackage(package.subpackages[spkg]);
        }
    }
    for(let cname in package.classes) {
        let cls = package.classes[cname].definition;
        jpackage.classes[cname] = { name: cls.name, description: cls.description, methods: cls.methods, attributes: cls.attributes, associations: cls.associations };
    }
    for(let uname in package.usecases) {
        jpackage.usecases[uname] = package.usecases[uname];
    }
    for(let hname in package.handlers) {
        jpackage.handlers[hname] = package.handlers[hname];
    }
    for(let wname in package.workflows) {
        jpackage.workflows[wname] = package.workflows[wname];
    }
    return jpackage;
}

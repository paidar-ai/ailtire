// const generator = require('../../src/Documentation/puml');

module.exports = {
    friendlyName: 'uml',
    description: 'plantuml diagram of the Package',
    inputs: {
        id: {
            description: 'The name of the package',
            type: 'string',
            required: true
        },
    },

    fn: async function (inputs, env) {
        try {
            // Generate the plantuml diagram
            // Or get it from the doc directory.
            
            let package = APackage.getPackage(inputs.id);
            let results = await generator.package(package, inputs.diagram);
            
            env.res.json(results);
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
        handlers: {}
    }

    for(let iname in package.interface) {
        let interface = package.interface[iname];
        jpackage.interface[iname] = {
            friendlyName: interface.friendlyName,
            description: interface.description,
            inputs: interface.inputs,
            static: interface.static
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
        let uc = package.usecases[uname];
        jpackage.usecases[uname] = uc;
    }
    for(let hname in package.handlers) {
        jpackage.handlers[hname] = package.handlers[hname];
    }
    return jpackage;
}

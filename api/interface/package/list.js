// const renderer = require('../../src/Documentation/Renderer.js');

module.exports = {
    friendlyName: 'list',
    description: 'List the Packages',
    inputs: {
    },
    outputs: {
        type: "json",
        description: "Map of Packages",
    },

    fn: function (inputs, env) {
        let pkg = global.topPackage;
        if(pkg) {
            let jpackage = processPackage(pkg);
            return jpackage;
        }
        return null;
    }
};
function processPackage(package) {
    let jpackage = {
        name: package.name,
        shortname: package.shortname,
        description: package.description,
        color: package.color,
        prefix: package.prefix,
        deploy: package.package,
        doc: package.doc,
        interface: {},
        classes: {},
        usecases: {},
        subpackages: {},
        handlers: {}
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
    for(let hname in package.handlers) {
        let handler = package.handlers[hname];
        jpackage.interface[hname] = {
            friendlyName: handler.friendlyName,
            description: handler.description,
        };
    }

    for(let cname in package.classes) {
        let cls = package.classes[cname].definition;
        jpackage.classes[cname] = { name: cls.name, description: cls.description, methods: cls.methods, attributes: cls.attributes, associations: cls.associations };
    }
    for(let uname in package.usecases) {
        jpackage.usecases[uname] = package.usecases[uname];
    }
    for(let spkg in package.subpackages) {
        jpackage.subpackages[spkg] = processPackage(package.subpackages[spkg]);
    }
    // Only push the shortname of the depends to prevent circular references.
    jpackage.depends = [];
    for(let dname in package.definition.depends) {
        let dpnd = package.definition.depends[dname];
        jpackage.depends.push(dpnd.shortname);
    }
    return jpackage;
}

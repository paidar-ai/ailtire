const path = require("node:path");
const fs = require("fs");

module.exports = {
    friendlyName: 'load',
    description: 'Load a AClass from the models directory',
    static: true,
    inputs: {
        dir: {
            description: 'Class Directory to load the class definition',
            type: 'string',
            required: true
        },
        package: {
            description: 'Package that is the owner of the class.',
            type: 'APackage',
            required: true
        }
    },
    outputs: {
        type: "AClass",
        description: "An AClass is returned that matches the name input."
    },
    exits: {
    },

    fn: function (inputs, env) {
        const classProxy = require("../../../../src/Proxy/ClassProxy");
        let dir = inputs.dir;
        let package = inputs.package;
        let indexFile = path.resolve(dir, 'index.js');
        if(!fs.existsSync(indexFile)) {
            console.log("Skipping Class: " + dir);
            console.log("index.js file is missing!");
            return;
        }
        let myClass = require(indexFile);

        myClass.package = package;
        myClass.dir = dir;
        if(myClass.definition?.name) {
            myClass.uid = `${package.name}.${myClass.definition.name}`;
        } else {
            console.error("Class name is missing!");
            myClass = require(path.resolve(dir,'index.js'));
            
            return;
        }

        if(!global.hasOwnProperty("classes")) {
            global.classes = {};
        }
        let myProxy = null;
        if(global.classes.hasOwnProperty(myClass.definition.name)) {
            // Replace the current definition with the new one.
            for(let name in myClass.definition) {
                global.classes[myClass.definition.name].definition[name] = myClass.definition[name];
            }
            myProxy = global.classes[myClass.definition.name];
        } else {
            myProxy = new Proxy(myClass, classProxy);
            // set the owners array for persistence.
            myClass.definition.owners = new Array();
            myClass.definition.dir = dir;
            global.classes[myClass.definition.name] = myProxy;
            global[myClass.definition.name] = myProxy;
            myClass.definition.methods = {};
        }

        package.classes[myClass.definition.name] = myProxy;
        if(myClass.definition.statenet) {
            let stateNet = AStateNet.load({definition:myClass.definition.statenet});
            myProxy.statenet = stateNet;
        }
        if(myClass.definition.attributes) {
            for(let name in myClass.definition.attributes) {
                let attr = null;
                if(global.hasOwnProperty("AAtribute")) {
                    attr = new AAtribute(myClass.definition.attributes[name]);
                } else {
                    attr = myClass.definition.attributes[name];
                }
                attr.parent = myProxy;
                attr.name = name;
                attr.uid = `${myProxy.uid}.${name}`;
                myProxy.definition.attributes[name] = attr;
            }
        }
        if(myClass.definition.associations) {
            for(let name in myClass.definition.associations) {
                let attr = null;
                if (global.hasOwnProperty("AAssociation")) {
                    attr = new AAssociation(myClass.definition.associations[name]);
                    attr.name = name;
                } else {
                    attr = myClass.definition.associations[name];
                }
                // let attr = new AAssociation(myClass.definition.associations[name]);
                attr.parent = myProxy;
                attr.name = name;
                attr.uid = `${myProxy.uid}.${name}`;
                myProxy.definition.associations[name] = attr;
            }
        }
        AMethod.loadAll({cls: myProxy});
        // myClass.loadDocs();
        return myProxy;
    }
};


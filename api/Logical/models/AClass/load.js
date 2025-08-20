const path = require('path');
const helper = require('../../../../src/utils/helper');
const classProxy = require("../../../../src/Proxy/ClassProxy");
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
        let myClass = require(dir + '/index.js');

        myClass.package = package;
        myClass.dir = dir;
        myClass.uid = `${package.uid}.${myClass.definition.name}`;

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
            package.classes[myClass.definition.name] = myProxy;
            global.classes[myClass.definition.name] = myProxy;
            global[myClass.definition.name] = myProxy;
            myClass.definition.methods = {};
        }
        if(myClass.definition.statenet) {
            let stateNet = AStateNet.load({definition:myClass.definition.statenet});
            myProxy.statenet = stateNet;
        }
        AMethod.loadAll({cls: myProxy});
        // myClass.loadDocs();
        return myProxy;
    }
};


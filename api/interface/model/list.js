// const renderer = require('../../src/Documentation/Renderer.js');

module.exports = {
    friendlyName: 'list',
    description: 'List the Models',
    inputs: {
    },
    outputs: {
            type: "Array",
            description: "Array of Classes.",
            properties: {
                type: "AClass",
                description: "AClass Objects"
            }
    },
    exits: {
        json: (obj)  => { return obj; },
        success: (obj)  => { return obj; }
    },
    fn: function (inputs, env) {
        let classes = processClasses(global.classes);
        return classes;
    }
};
function processClasses(classes) {
    let retval = {};
    for(let cname in classes) {
        let cls = classes[cname].definition;
        let noi = 0;
        if(global._instances && global._instances.hasOwnProperty(cname)) {
            noi = Object.keys(global._instances[cname]).length;
        }
        retval[cname] = {
            name: cls.name,
            description: cls.description,
            methods: cls.methods,
            attributes: cls.attributes,
            associations: cls.associations,
            count: noi
        };
    }
    return retval;
}

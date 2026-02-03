const fs = require("fs");

module.exports = {
    friendlyName: 'construct',
    description: 'Construct a Use Case for the application or package',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "package": {
            type: "APackage",
            description: "Package for the use case. If this is not there then the use case will be created against the application",
            required: true
        },
        name: {
            type: 'string',
            description: 'The name of the workflow',
            required: true,
        },
        description: {
            type: 'string',
            description: 'Detailed description of what the workflow does',
            required: true,
        },
        precondition: {
            type: 'string',
            description: 'Global precondition under which this workflow may start',
        },
        postcondition: {
            type: 'string',
            description: 'Global postcondition guaranteed when workflow completes',
        },
        category: {
            type: 'string',
            description: 'Hierarchical category (level1/level2/…) for grouping',
        },
        inputs: {
            type: 'json',
            description: 'Definition of input parameters when this workflow is invoked by another workflow. Map with  { name: { type: string, description: string, required: boolean }, ...}',
        },
        outputs: {
            type: 'json',
            description: 'Definition of output parameters produced by this workflow for its caller. Map with  { name: { type: string, description: string, required: boolean }, ...}',
        },
    },
    outputs: {
            "type": "AWorkflow", "description": "My Return Value"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {package, name, description, precondition, postcondition, category} = inputs;


        if(!package) {
            package = global.topPackage;
        }
        if(typeof package === 'string') {
            package = APackage.get({name: package});
            if(!package) {
                package = APackage.construct({name: package});
            }
        }
        let nameNoSpace = name.replace(/ /g, '');
        let wfFile = "";
        if(category) {
            wfFile = package.dir + `/workflows/${nameNoSpace}/index.js`;
        } else {
            wfFile = package.dir + `/workflows/${category}/${nameNoSpace}/index.js`;
        }
        let wfDef = {
            name: name,
            description: description || `${name} is a use case of ${package.name}`,
            precondition: precondition || "",
            postcondition: postcondition || "",
            category: category || "",
            inputs: inputs.inputs || {},
            outputs: inputs.outputs || {},
        }
        if(!fs.existsSync(wfFile)) {
            fs.mkdirSync(path.dirname(wfFile), {recursive: true});
            fs.writeFileSync(ucFile, `module.exports = ${JSON.stringify(wfDef, null, 4)};`);
        }
        let retval = AWorkflow.load({file: wfFile, package: package});

        // obj has the obj for the method.
        return retval;
    }
};
module.exports = {
    friendlyName: 'load',
    description: 'Load handlers file for a package from the file',
    static: true,
    inputs: {
        file: {
            description: 'File to use as the method to load',
            type: 'string',
            required: true
        },
        package: {
            description: 'Package of the collection AHandlers.',
            type: "APackage",
            require: true
        }
    },
    outputs: {
        type: "AHandlers",
        description: "An AHandlers is returned that matches the file to be loaded."
    },
    exits: {
    },

    fn: function (inputs, env) {
        let { file, package} = inputs;
        let tempItem = require(file);
        let ename = tempItem.name;
        if(package) {
            if(typeof package === 'string') {
                package = APackage.get({name: package});
            }
        }

        let returnObj = new AHandlers({description: tempItem.description, package: package});
        if(!global.handlers) {
            global.handlers = {};
        }
        if (!global.handlers.hasOwnProperty(ename)) {
            global.handlers[ename] = {name: ename, handlers: []};
        }
        let handlers = [];
        for (let j in tempItem.handlers) {
            let handler = new AHandler(tempItem.handlers[j]);
            handlers.push(handler);
            global.handlers[ename].handlers.push(handler);
        }
        returnObj.handlers = handlers;

        return returnObj;
    }
};
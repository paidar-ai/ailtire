const path = require('path');
const Generator = require("../../../../src/Documentation/Generator");
const fs = require("fs");
const AHandlers = require("./index");
module.exports = {
    friendlyName: 'save',
    description: 'Save the collection of handlers in the package',
    static: false,
    inputs: {
    },
    outputs: {
        type: 'boolean', description: "The handlers have been saved to the package handlers directory",
    },
    exits: {
    },

    fn: function (obj, inputs, env) {
        let event = obj.name;
        let package = obj.package;
        let handlers = obj.handlers;
        let targetDir = package.dir + '/handlers';

        let tempHandlers = "["
        for (let i in handlers) {
            let handler = handlers[i];
            if (typeof handler.fn === 'function') {
                handler.fn = handler.fn.toString();
            }
            tempHandlers += `\t{ description: "${handler.description}",\n\t\tfn: ${handler.fn}\n\t}\n`;
        }
        tempHandlers += ']';
        handlers = tempHandlers;
        let files = {
            context: {
                eventName: event,
                handlers: handlers
            }, targets: {
                ':eventName:.js': {template: `${__dirname}/templates/eventname.js`},
            }
        };
        Generator.process(files, targetDir);
        let retval = AHandlers.load({event: event, package: package});
        return retval;
    }
};
const Generator = require("../../../../src/Documentation/Generator");
const path = require('path');
const fs = require("fs");

module.exports = {
    friendlyName: 'construct',
    description: `Construct an event handler for the package`,
    static: true,
    inputs: {
        event: {
            description: 'Name of the event to handle', type: 'string', required: true
        },
        package: {
            description: 'Package of the event handler', type: 'APackage', required: true
        },
        handlers: {
            type: "Array",
            description: 'List of description of the handlers',
            properties: {
                description: {type: "string", description: "Description of the handler"},
                fn: {type: "string", description: "Function that will run for the handler"}
            },
            required: false
        }
    },
    outputs: {
        type: 'AHandlers', description: "A Collection of handlers for the event for the package",
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let { event, package, handlers } = inputs;

        let targetDir = package.dir + '/handlers';
        if(!handlers) {
            handlers = [];
            handlers.push({
                "description": "This id the default handler and prints event and data to stdout.",
                "fn": (data) => {
                    console.log(`Event ${event} contains ${data}`);
                }
            })
        }
        if(typeof handlers !== 'string') {
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
        }
        const files = {
            context: {
                eventName: event,
                handlers: handlers
            }, targets: {
                ':eventName:.js': {template: `${__dirname}/templates/eventname.js`},
            }
        };
        Generator.process(files, targetDir);
        let fileName = path.resolve(targetDir, `${event}.js`);
        let retval = AHandlers.load({file: fileName, package: package});
        return retval;
    }
};

function existsDir(dir) {
    try {
        if (fs.statSync(dir).isDirectory()) {
            return true;
        }
    } catch (e) {
        if (e) {
            return false;
        }
    }
}
const axios = require('axios');

module.exports = {
    friendlyName: 'call',
    description: 'Call a deployment service action',
    static: true,
    inputs: {
        actionName: {
            type: 'string',
            required: true,
            description: 'Action path to invoke'
        },
        opts: {
            type: 'json',
            description: 'Input payload passed to the action'
        },
        env: {
            type: 'json',
            description: 'Optional execution environment'
        }
    },
    outputs: {
        type: 'json',
        description: 'Action result'
    },
    exits: {},
    fn: async function (inputs, env) {
        const Action = require('../../../../src/Server/Action.js');
        const action = _findAction(inputs.actionName);
        let execEnv = inputs.env || env;
        if (!execEnv) {
            execEnv = {req: {url: `/${inputs.actionName}`}};
        }
        if (!execEnv.req) {
            execEnv.req = `/${inputs.actionName}`;
        }
        if (action && action.fn) {
            const args = _processArguments(action, inputs.opts || {});
            try {
                return await Action.execute(action, args, execEnv);
            } catch (e) {
                console.error(inputs.actionName);
                console.error("Action Execute Error:", e);
                throw e;
            }
        }

        const service = _findService(inputs.actionName);
        if (!service) {
            throw new Error(`Could not find local Service: ${inputs.actionName}`);
        }
        console.log("Could not find local Service:", inputs.actionName);
        console.log("Running via REST service!");
        return await _invoke(service, inputs.actionName, inputs.opts || {});
    }
};

const path = require('path');
const fs = require('fs');

const _invoke = async (service, actionName, opts) => {
    const inter = _findInterface(service, actionName);
    const host = inter.host || 'localhost';
    const port = inter.port || 3000;
    const protocol = inter.protocol || 'http';

    actionName = `/${actionName}`.replace(/^\/+/, '/');
    const normalizedName = (inter.name && inter.path && inter.name !== inter.path) ? actionName.replace(inter.name, inter.path).replace(/^\/+/, '/') : actionName.replace(/^\/+/, '/');

    const url = `${protocol}://${host}:${port}${normalizedName}`;
    const retry = 5;
    let attempts = 0;

    // Validate and transform opts (POST data)
    while (attempts < retry) {
        attempts++;
        try {
            // Perform the POST request
            let response =  await axios.post(url, opts);
            return response.data;
        } catch (e) {
            console.error(`Attempt ${attempts}/${retry} failed for POST ${url}:`, e.message);
            if(attempts > retry) {
                service.launchContainer();
            }
            await new Promise(res => setTimeout(res, 1000)); // Delay 1 second
        }
    }
    throw new Error(`Failed to POST ${url} after ${retry} attempts.`);
}
const _findInterface = (service, actionName) => {
    // Find the service.interface[path] that is a subset of the actionName
    for(let path in service.interface) {
        if (actionName.startsWith(path)) {
            return service.interface[path];
        }
    }
}
const _findAction = (name) => {
    if (global.interface.hasOwnProperty(name)) {
        return global.interface[name];
    } else if (global.interface.hasOwnProperty('/' + name)) {
        return global.interface['/' + name];
    } else if (global.interface.hasOwnProperty(name.replace('/', ''))) {
        return global.interface[name.replace('/', '')];
    } else {
        let items = name.replace(/[\/\\]/g, '/').replace(/^\//, '').split('/');
        let nName = global.topPackage.shortname + '/' + items.join('/');
        if (global.interface.hasOwnProperty(nName)) {
            return global.interface[nName];
        } else if (global.interface.hasOwnProperty('/' + nName)) {
            return global.interface['/' + nName];
        } else {
            return null;
        }
    }
}

const _findService = (actionName) => {
    if (!global._servicePaths) {
        return null;
    }
    let paths = actionName.split('/');
    while (paths.length > 0) {
        let pathCheck = `${paths.join('/')}`;
        if (global._servicePaths.hasOwnProperty(pathCheck)) {
            return global._servicePaths[pathCheck];
        } else {
            paths.pop();
        }
    }
    return null;
}

const _processArguments = (action, opts) => {
    let retval = {};
    for (let name in opts) {
        if (action.inputs.hasOwnProperty(name)) {
            if (action.inputs[name].type === 'file') {
                try {
                    let apath = path.resolve(process.cwd() + '/' + opts[name]);
                    let contents = fs.readFileSync(apath, 'utf-8');
                    retval[name] = {data: contents};
                } catch (e) {
                    console.error("File error:", e);
                    throw new Error(e);
                }
            } else {
                retval[name] = opts[name];
            }
        } else {
            retval[name] = opts[name];
        }
    }
    return retval;
}

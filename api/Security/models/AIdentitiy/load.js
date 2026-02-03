const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'load',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "identifier": {
            "type": "string",
            "description": "Identifier of the Identity",
            "required": true
        },
        "file": {
            "type": "string",
            "description": "File name",
            "required": true
        }
    },
    outputs: {
        "type": "AIdentity",
        "description": "The AIdentity from the file object stored.",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
        success: (obj) => {
            return obj;
        }
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        const {identifier} = inputs;
        const dir = path.resolve(global.ailtire.config?.baseDir || global.ailtire.config.baseDir, ".database", "AIdentity");
        const filename = path.resolve(dir, `${identifier}.json`);
        const json = fs.readFileSync(filename, "utf8");
        const def = JSON.parse(json);
        const retval = new AIdentity(def);

        if(retval.actorNames) {
            if(typeof retval.actorNames === 'string') {
                retval.actorNames = retval.actorNames.split(',');
            }
            // Load the actors and their roles to create a calculatedPermissions.
            let calcPermissions = {};
            for (let i in retval.actorNames) {
                let actorName = retval.actorNames[i];
                let actor = AActor.find(actorName);
                let roles = actor.roles;
                for (let j in roles) {
                    let permissions = roles[j].permissions;
                    for (let k in permissions) {
                        calcPermissions[permissions[k]] = true;
                    }
                }
            }
            let permissions = Object.keys(calcPermissions);
            retval.permissions = permissions;
        } else {
            retval.permissions = "";
        }

        return retval;
    }
};

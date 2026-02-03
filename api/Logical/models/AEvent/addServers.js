const path = require('path');

module.exports = {
    friendlyName: 'addServers',
    description: 'Add servers to the event emission system',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "servers": {
            "type": "json",
            "description": 'This contains the server definition to add to the event system. I the following formation ' +
                `[ {name: 'server1', url: 'http://server1.com'}, {name: 'server2', url: 'http://server2.com', patterns: " "}, ...] `,
            "required": false,
        }
    },
    outputs: {
            "type": "boolean",
            "description": "Server are added to the event system"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let { servers } = inputs;

        for (let i in servers) {
            let server = servers[i];
            for (let j in global.ailtire.comms.services) {
                let commsService = global.ailtire.comms.services[j];
                commsService.connect(server);
            }
        }
        return true;
    }
};

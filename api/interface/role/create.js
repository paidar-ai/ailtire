module.exports = {
    friendlyName: 'create',
    description: 'Create a role',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "name": {
            "type": "string",
            "description": "Name of the Role",
            "required": true
        },
        "description": {
            "type": "string",
            "description": "Description of the Role",
            "required": false
        },
        "permissions": {
            "type": "array",
            description: 'Permissions for this role. The permissions are an array of strings that show what the role ' +
                ' is allowed to do with the interface of the system. "actor/list" allows the role to list the actors.' +
                ' "actor/*" allows the role to perform all interfaces starting with actor/. "*/list" allows the role' +
                ' to access all of the interfaces with list as the endpoint. This should be a comma separated list.',
            required: false,
        }
    },
    outputs: {
        "type": "ARole",
        "description": "The Role is returned",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        let {name, description, permissions} = inputs;
        let retval = ARole.construct({name: name, description: description, permissions: permissions});
        return retval;
    }
};

module.exports = {
    friendlyName: 'addService',
    description: 'Add a service to the stack',
    static: false,
    inputs: {
        service: {
            type: 'AService',
            required: true,
            description: 'Service to add'
        }
    },
    outputs: {
        type: 'AStack',
        description: 'Updated stack'
    },
    exits: {},
    fn: function (obj, inputs, env) {
        obj.services[inputs.service.name] = inputs.service;
        return obj;
    }
};

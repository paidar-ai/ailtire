module.exports = {
    friendlyName: 'load',
    description: 'Load a deployment stack design',
    static: true,
    inputs: {
        name: {
            type: 'string',
            required: true,
            description: 'Stack name'
        },
        environment: {
            type: 'string',
            required: true,
            description: 'Environment name'
        },
        design: {
            type: 'json',
            required: true,
            description: 'Deployment design for the stack'
        }
    },
    outputs: {
        type: 'AStack',
        description: 'Loaded AStack instance'
    },
    exits: {},
    fn: function (inputs, env) {
        const design = inputs.design || {};
        if (!design.networks) {
            design.networks = {};
        }
        if (!design.networks.hasOwnProperty('parent')) {
            design.networks.parent = {external: true, name: "Parent"};
        }
        if (!design.networks.hasOwnProperty('children')) {
            design.networks.children = {driver: "overlay", attachable: true, name: "Children"};
        }
        if (!design.networks.hasOwnProperty('siblings')) {
            design.networks.siblings = {driver: "overlay", name: "Siblings"};
        }

        let stack = new AStack({name: inputs.name, environment: inputs.environment});
        stack.networks = design.networks;
        stack.policies = design.policies || {};
        stack.data = design.data || {};
        stack.interface = design.interface || {};

        for (let sname in design.services || {}) {
            let service = design.services[sname];
            if (service.type === 'stack') {
                if (service.networks) {
                    if (service.networks.hasOwnProperty('children')) {
                        service.networks.children = {};
                    }
                } else {
                    service.networks = {children: {}};
                }
            }
            if (service.networks) {
                if (service.networks.hasOwnProperty('siblings')) {
                    service.networks.siblings = {};
                }
            } else {
                service.networks = {siblings: {}};
            }
            let serviceObj = AService.load({name:sname, design:service});
            stack.addToServices(serviceObj);
        }
        return stack;
    }
};

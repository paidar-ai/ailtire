// const renderer = require('../../src/Documentation/Renderer.js');

module.exports = {
    friendlyName: 'get',
    description: 'get an Environment',
    inputs: {},

    fn: function (inputs, env) {
        let envname = inputs.id;
        let pkgs = global.packages;
        let stacks = {};
        let services = {};
        // Go through all of the stack deployments and get the definitions by environment.
        for(let pname in pkgs) {
            let package = pkgs[pname];
            if(package.deploy.envs.hasOwnProperty(envname)) {
                let stack = package.deploy.envs[envname];
                stacks[package.deploy.name] =  {
                    name: stack.tag,
                    id: `${envname}.${package.deploy.name}`,
                    services: {},
                    data: stack.design.data,
                    networks: stack.design.networks,
                    interface: stack.design.interface
                };
                for(let sname in stack.design.services) {
                    let service = stack.design.services[sname];
                    let id = `${envname}.${package.deploy.name}.${sname}`;
                    stacks[package.deploy.name].services[id] = service;
                }
                
            }
        }
        env.res.json({name: envname, id: envname, stacks: stacks, services: services});
    }
};

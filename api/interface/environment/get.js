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
                stacks[package.deploy.name] = package.deploy.envs[envname];
                stacks[package.deploy.name].id = package.deploy.name;

            }
        }
        env.res.json({stacks: stacks, services: services});
    }
};

// const renderer = require('../../src/Documentation/Renderer.js');

module.exports = {
    friendlyName: 'list',
    description: 'List the Deployment',
    inputs: {
    },

    fn: function (inputs, env) {
        let environments = global.deploy.envs;
        env.res.json(environments);
    }
};
function processDeployment(packages) {
    let retval = {environments:{}, images:{}};

    for(let pname in packages) {
        let package = packages[pname];
        for(let ename in package.deploy.envs) {
            let env = package.deploy.envs[ename];
            if(!retval.environments.hasOwnProperty(ename)) {
                retval.environments[ename] = { stacks: {}};
            }
            retval.environments[ename].stacks[env.tag] = processStack(`${ename}.${pname}.${ename}`, env.definition);
        }
        for(let bname in package.deploy.build) {
            let bld = package.deploy.build[bname];
            retval.images[bld.tag] = bld;
        }
    }
    return retval;
}

function processStack(id, stack) {
   return {id: id, services: stack.services, networks: stack.networks};
}

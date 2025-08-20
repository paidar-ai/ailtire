// const renderer = require('../../src/Documentation/Renderer.js');

module.exports = {
    friendlyName: 'list',
    description: 'List the Deployment',
    inputs: {
    },

    fn: function (inputs, env) {
        let environments = _processDeployment(global.packages);
        _processPhysical(environments);
        env.res.json(environments);
    }
};
function _processDeployment(packages) {
    let retval = {environments:{}, images:{}};

    for(let pname in packages) {
        let package = packages[pname];
        for(let ename in package.deploy.envs) {
            let env = package.deploy.envs[ename];
            if(!retval.environments.hasOwnProperty(ename)) {
                retval.environments[ename] = { name: ename, stacks: {}, physical: {}};
            }
            retval.environments[ename].stacks[env.tag] = processStack(`${pname}.${ename}`, env.definition);
        }
        for(let bname in package.deploy.build) {
            let bld = package.deploy.build[bname];
            retval.images[bld.tag] = bld;
        }
    }
    return retval;
}

function _processPhysical(environments) {
    let envs = global.physical.environments;
    for(ename in envs) {
        let env = environments[ename];
        if(!environments.hasOwnProperty(ename)) {
            environments[ename] = { name: ename, stacks: {}, physical: {} };
        }
        environments[ename].physical = env;
    }
    return environments;
}
function processStack(id, stack) {
   return {id: id, services: stack.services, networks: stack.networks};
}

class ADeployment {
    constructor(opts = {}) {
        this.name = opts.name;
        this.dir = opts.dir;
        this.prefix = opts.prefix;
        this.build = opts.build || {};
        this.envs = opts.envs || {};
        return this;
    }

    static definition = {
        name: 'ADeployment',
        description: 'A deployment package that contains build definitions and environment-specific stack designs.',
        attributes: {
            name: {
                type: 'string',
                required: true,
                description: 'Deployment name'
            },
            dir: {
                type: 'string',
                description: 'Directory containing the deployment definition'
            },
            prefix: {
                type: 'string',
                description: 'Package prefix used to resolve the deployment'
            },
            build: {
                type: 'json',
                description: 'Build definitions for container images'
            }
        },
        associations: {
            envs: {
                type: 'AEnvironment',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Environments defined for this deployment',
                unique: (obj) => { obj.name; }
            }
        }
    }
}

module.exports = ADeployment;

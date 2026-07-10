module.exports = {
    friendlyName: 'findByPath',
    description: 'Resolve a deployment service path',
    static: true,
    inputs: {
        path: {
            type: 'string',
            required: true,
            description: 'Path to resolve'
        }
    },
    outputs: {
        type: 'AService',
        description: 'Resolved service object'
    },
    exits: {},
    fn: function (inputs, env) {
        let paths = inputs.path.split('/');
        while (paths.length > 0) {
            let pathCheck = `/${paths.join('/')}`;
            if (global._servicePaths && global._servicePaths.hasOwnProperty(pathCheck)) {
                return global._servicePaths[pathCheck];
            } else {
                paths.pop();
            }
        }
        return null;
    }
};

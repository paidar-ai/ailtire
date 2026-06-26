const fs = require('fs');
const path = require('path');

module.exports = {
    friendlyName: 'views',
    description: 'Get available views for the model',
    static: true,
    inputs: {},
    exits: {},
    fn: function (inputs, env) {
        let modelName = env.req.url.split(/\//)[1];
        if (!global.classes || !global.classes[modelName]) {
            return env.res.status(404).json({ status: 'error', message: `Model ${modelName} not found` });
        }

        let cls = global.classes[modelName];
        let modelDir = cls.definition.dir;
        let viewsDir = path.join(modelDir, 'views');
        let views = {};

        if (fs.existsSync(viewsDir)) {
            // Check for svelte views
            let svelteDir = path.join(viewsDir, 'svelte');
            if (fs.existsSync(svelteDir)) {
                let indexFile = path.join(svelteDir, 'index.js');
                if (fs.existsSync(indexFile)) {
                    // We found a svelte index.
                    // If it was built, it should be in dist/index.js
                    let distFile = path.join(viewsDir, 'dist', 'index.js');
                    views.svelte = {
                        path: `/views/${modelName}/svelte/index.js`,
                        compiled: fs.existsSync(distFile) ? `/views/${modelName}/dist/index.js` : null
                    };
                    
                    // Let's also list individual components if possible, 
                    // though usually the index is the entry point.
                    let files = fs.readdirSync(svelteDir);
                    views.svelte.components = files.filter(f => f.endsWith('.svelte'));
                }
            }

            // Check for CLI views
            let cliDir = path.join(viewsDir, 'cli');
            if (fs.existsSync(cliDir)) {
                let indexFile = path.join(cliDir, 'index.js');
                if (fs.existsSync(indexFile)) {
                    views.cli = {
                        path: `/views/${modelName}/cli/index.js`
                    };
                }
            }
        }

        if (env.res) {
            env.res.json({
                status: 'success',
                model: modelName,
                views: views
            });
        }
    }
};

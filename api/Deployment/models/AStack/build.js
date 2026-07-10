const {spawnSync: spawn} = require("child_process");
const Generator = require("../../../../src/Documentation/Generator");

module.exports = {
    friendlyName: 'build',
    description: 'Build the stack deployment artifacts',
    static: false,
    inputs: {
        opts: {
            type: 'json',
            description: 'Build options'
        }
    },
    outputs: {
        type: 'json',
        description: 'Build result'
    },
    exits: {},
    fn: function (obj, inputs, env) {
        _buildServiceFiles(obj, inputs || {});
        const imageTag = obj.tag || obj.name;
        let proc = spawn('docker', ['build', '-t', imageTag, '-f', obj.dockerFile, '.'], {
            cwd: obj.baseDir || process.cwd(),
            stdio: [process.stdin, process.stdout, process.stderr],
            env: process.env
        });
        if (proc.status != 0) {
            console.error("Error Building Service Container", imageTag);
            console.error(proc.stdout.toString('utf-8'));
            console.error(proc.stderr.toString('utf-8'));
        }
    }
};

const _buildServiceFiles = (stack, opts) => {
    let repo = '';
    if (opts.repo) {
        repo = opts.repo + '/';
    }
    let files = {
        context: {
            stack: stack,
            repo: repo
        },
        targets: {
            './.tmp-dockerfile': {template: '/templates/Package/deploy/Dockerfile-Service'},
            './.tmp-stack-compose.yml': {template: '/templates/Package/deploy/stack-compose.yml'},
            './.router.js': {template: '/templates/Package/deploy/router.ejs'},
        }
    };
    Generator.process(files, stack.baseDir || process.cwd());
    if (!stack.composeFile) {
        stack.composeFile = './.tmp-stack-compose.yml';
    }
    stack.dockerFile = './.tmp-dockerfile';
    return;
}

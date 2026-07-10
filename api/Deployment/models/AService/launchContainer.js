const {execSync} = require('child_process');

module.exports = {
    friendlyName: 'launchContainer',
    description: 'Launch the service container',
    static: false,
    inputs: {
        opts: {
            type: 'json',
            description: 'Launch options'
        },
        env: {
            type: 'json',
            description: 'Launch environment'
        }
    },
    outputs: {
        type: 'json',
        description: 'Container launch result'
    },
    exits: {},
    fn: function (obj, inputs, env) {
        let image = obj.deployments.container.image;
        let cmd = obj.deployments.container.cmd || '';
        let ports = obj.getPorts();
        let portString = ports.map((port) => `-p ${port}:${port}`).join(' ');
        let launchCmd = `docker run -d --rm --name ${obj.name} ${portString} ${image} ${cmd}`;
        try {
            console.log("Launching Container:", launchCmd);
            execSync(launchCmd, {stdio: [process.stdin, process.stdout, process.stderr]});
            return;
        } catch (e) {
            console.error("Error launching container:", e);
        }
    }
};

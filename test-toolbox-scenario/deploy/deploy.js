
module.exports = {
    name: 'test-toolbox-scenario',
    contexts: {
        dev: {
            type: 'swarm',
            tag: 'test-toolbox-scenario_dev',
            file: 'docker-compose.yml',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: 'test-toolbox-scenario_test',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: 'test-toolbox-scenario_prod',
            file: 'docker-compose.yml',
            env: {}
        }
    }
}

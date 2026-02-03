
module.exports = {
    name: 'test-team-scenario',
    contexts: {
        dev: {
            type: 'swarm',
            tag: 'test-team-scenario_dev',
            file: 'docker-compose.yml',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: 'test-team-scenario_test',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: 'test-team-scenario_prod',
            file: 'docker-compose.yml',
            env: {}
        }
    }
}

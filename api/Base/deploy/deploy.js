
module.exports = {
    name: '_b',
    contexts: {
        local: {
            type: 'swarm',
            tag: '_b_dev',
            design: 'services.js',
            env: {}
        },
        dev: {
            type: 'swarm',
            tag: '_b_dev',
            design: 'services.js',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: '_b_test',
            design: 'services.js',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: '_b_prod',
            design: 'services.js',
            env: {}
        }
    }
}

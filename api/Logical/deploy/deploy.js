
module.exports = {
    name: '_l',
    contexts: {
        local: {
            type: 'swarm',
            tag: '_l_dev',
            design: 'services.js',
            env: {}
        },
        dev: {
            type: 'swarm',
            tag: '_l_dev',
            design: 'services.js',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: '_l_test',
            design: 'services.js',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: '_l_prod',
            design: 'services.js',
            env: {}
        }
    }
}


module.exports = {
    name: '_d',
    contexts: {
        local: {
            type: 'swarm',
            tag: '_d_dev',
            design: 'services.js',
            env: {}
        },
        dev: {
            type: 'swarm',
            tag: '_d_dev',
            design: 'services.js',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: '_d_test',
            design: 'services.js',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: '_d_prod',
            design: 'services.js',
            env: {}
        }
    }
}

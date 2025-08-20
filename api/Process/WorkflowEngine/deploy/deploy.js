
module.exports = {
    name: 'p_w',
    contexts: {
        local: {
            type: 'swarm',
            tag: 'p_w_dev',
            design: 'services.js',
            env: {}
        },
        dev: {
            type: 'swarm',
            tag: 'p_w_dev',
            design: 'services.js',
            env: {}
        },
        test: {
            type: 'swarm',
            tag: 'p_w_test',
            design: 'services.js',
            file: 'docker-compose.yml',
            env: {}
        },
        prod: {
            type: 'swarm',
            tag: 'p_w_prod',
            design: 'services.js',
            env: {}
        }
    }
}


module.exports = {
    web: {
        dir: '..',
        file: 'deploy/web/Dockerfile',
        tag: 'test-toolbox-scenario_web',
        env: {

        }
    },
    doc: {
        dir: '../docs',
        file: '../deploy/doc/Dockerfile',
        tag: 'test-toolbox-scenario_doc',
        env: {

        }
    }
}

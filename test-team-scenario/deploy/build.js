
module.exports = {
    web: {
        dir: '..',
        file: 'deploy/web/Dockerfile',
        tag: 'test-team-scenario_web',
        env: {

        }
    },
    doc: {
        dir: '../docs',
        file: '../deploy/doc/Dockerfile',
        tag: 'test-team-scenario_doc',
        env: {

        }
    }
}

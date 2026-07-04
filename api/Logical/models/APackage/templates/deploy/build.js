module.exports = {
    microservice: {
        dir: 'microservice',
        cmd: 'node server.js',
        file: 'Dockerfile',
        tag: '<%= ancestors %>_<%= shortname %>_microservice',
        env: {

        }
    },
    webserver: {
        dir: 'webserver',
        cmd: 'npm run dev -- --host 0.0.0.0',
        file: 'Dockerfile',
        tag: '<%= ancestors %>_<%= shortname %>_webserver',
        env: {

        }
    },
}

const fs = require('fs');
const path = require('path');
const GitHubStorage = require('ailtire/src/Persist/GitHubStorage');
const server = require('ailtire');

const appBaseDir = path.resolve(__dirname, '../..');
const repoBaseDir = path.resolve(__dirname, '../../../..');

if (!fs.existsSync(path.join(repoBaseDir, 'node_modules'))) {
    console.error('Error: you must run "npm install" first');
    return;
}

global.ailtire = global.ailtire || {};

const storageConfig = {
    repo: process.env.GITHUB_REPO || '<%= ancestors %>/<%= shortname %>',
    localDir: process.env.GITHUB_LOCAL_DIR || repoBaseDir,
    cloneDir: process.env.GITHUB_CLONE_DIR || path.join(repoBaseDir, '<%= nameNoSpace %>'),
    modelPaths: {},
    blobStorage: {
        default: 'external',
        fileDefault: 'github',
        useHeuristics: false,
        attributes: {}
    }
};

const storage = new GitHubStorage(storageConfig);
storage.init();
global.storage = storage;

server.listen({
    name: '<%= name %>',
    version: '1.0.0',
    baseDir: appBaseDir,
    urlPrefix: '/<%= shortname %>',
    target: 'microservice',
    packages: ['.'],
    persist: {
        adaptor: storage
    },
    prefix: '/<%= shortname %>',
    routes: {},
    listenPort: Number(process.env['<%= shortname.toUpperCase() %>_PORT'] || 3000),
    services: {}
});

const fs = require('fs');
// Check for node_modules directory. If it exists then continue. If not ask to run npm install.
if(!fs.existsSync('./node_modules')) {
    console.error('Error: you must run "npm install" first');
    return;
}
const path = require('path');
const AOpenAI = require('./src/AI/AOpenAI');
const BootStrap = require('./src/BootStrap');
const program = require('./src/Command/subcommander');

global.ailtire = {
    baseDir: process.cwd(),
    ai: {
        adaptor: AOpenAI,
        model: 'gpt-4o-mini',
        apiKey: process.env.AILTIRE_OPENAI_KEY,
    }
};
let ailtireBaseDir = path.resolve(__dirname, '.');
BootStrap.init(ailtireBaseDir);
ARole.loadAll();
AActor.loadAll({dir: path.resolve(ailtireBaseDir, "actors")});
console.log(global.ailtire.baseDir);
console.log(ailtireBaseDir);
// If the working directory is the same as the ailtire then do not load the application.
if(ailtireBaseDir !== global.ailtire.baseDir) {
    AApplication.load({dir: global.ailtire.baseDir});
} else {
    // global.topPackage = APackage.find({name:'ailtire'});
    AApplication.load({dir: global.ailtire.baseDir});
    console.log("Skipping loading");
}

const server = require('./index.js');

let host = process.env.AILTIRE_HOST || 'localhost';
let port = process.env.AILTIRE_PORT || 80;
let urlPrefix = process.env.AITIRE_BASEURL || '/web';
let config = {
    name: 'ailtire',
    authEnabled: true,
    version: '1.0.0',
    baseDir: '.',
    host: host,
    urlPrefix: urlPrefix,
    listenPort: port,
    internalURL: `${host}:${port}${urlPrefix}`,
    mcp: true,
    routes: {},
};
if(fs.existsSync('.ailtire.js')) {
    let overConfig = require('./.ailtire.js');
    for(let i in overConfig) {
        config[i] = overConfig[i];
    }
} else {
    let outputString = `module.exports = ${JSON.stringify(config)};`;
    fs.writeFileSync('.ailtire.js', outputString, 'utf8');
}

server.listen( config);

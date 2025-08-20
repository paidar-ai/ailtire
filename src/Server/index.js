const express = require('express');
const server = express();
const http = require('http').createServer(server);
const path = require('path');
const Action = require('./Action.js');
const multer  = require('multer');
const fs = require('fs');
// const redis = require('socket.io-redis');
const bodyParser = require("body-parser");
const upload = multer({dest: '.uploads/'});
const ASocketIOAdaptor = require('../Comms/ASocketIOAdaptor');

const {McpServer} = require('@modelcontextprotocol/sdk/server/mcp.js');
const {StreamableHTTPServerTransport} = require("@modelcontextprotocol/sdk/server/streamableHttp.js");

global.upload = upload;

const htmlGenerator = require('../Documentation/html');
const Renderer = require('../Documentation/Renderer');


// Here we are configuring express to use body-parser as middle-ware.

// server.set('json replacer', circularReplacer());

module.exports = {
    listen: async (config) => {

        server.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

// Increased to pass architecture definitions.
        server.use(bodyParser.urlencoded({limit:'100mb', extended: true}));
        server.use(bodyParser.json({limit:'100mb'}));
        server.use(bodyParser.raw());

        server.use((req, res, next) => {
            const oldJSON = res.json;
            res.json = function(obj) {
                arguments[0] = _toJSON(obj);
                oldJSON.apply(res, arguments);
            };
            next();
        });

        normalizeConfig(config);
        global.ailtire = { config: config };

        // Action.defaults(server);
        if(config.mcp) {
            let mcpServer = new McpServer({name: config.name, version: config.version});
            config.mcpServer = mcpServer;
        }

        Action.load(server, "/api/", config);
        // Action.mapRoutes(server, config);

        _setupAdaptors(config);
        _setupDefaultServices(config);

        try {
            let mdirs = fs.readdirSync(path.resolve(config.baseDir + '/views/layouts'))
            for(let i in mdirs) {
                if(path.extname(mdirs[i]) === '.ejs') {
                    let basename = path.basename(mdirs[i], '.ejs');
                    server.all(`/${basename}`, (req, res) => {
                        config.layout = basename;
                        let str = mainPage(config);
                        res.end(str);
                    });
                }
            }
        } catch(e) {
            console.error("No Web Interface found!");
        }
        /*
        server.all('*', (req, res) => {
            console.error(`Config: ${config.urlPrefix}`)
            console.error("Catch All", req.originalUrl);
            // Look in the views directly for items to load.
            let str = findPage(req.originalUrl, config);
            res.end(str);
        });

         */

        http.listen(config.listenPort, () => {
            console.log("Listening on port: " + config.listenPort);
            // call the post configuration script.
            if(config.hasOwnProperty('post')) {
                config.post(config);
                console.log("Done!");
            }
        });
    },
}

function mainPage(config) {
    let layout = config.layout || 'default';
    return Renderer.render(layout, './index', {
        app: {name: config.name},
        name: config.name,
    });
}
function findPage(page, config) {
    let npage = page.replace(config.urlPrefix, '');
    // Do not add the layout again.
    return Renderer.renderPage(npage, {
        app: {name: config.name},
        name: config.name,
    });
}

function normalizeConfig(config) {
    config.port = config.port || 3000;
    config.host = config.host || 'localhost';
    config.urlPrefix = config.urlPrefix || '/';
    config.name = config.name || 'service';
    config.externalURL = config.externalURL || `localhost/${config.urlPrefix}`;
    config.internalURL = config.internalURL || `${config.host}:${config.port}`;
    config.instanceName = config.instanceName || process.env.AILTIRE_STACKNAME;
}

function findStaticFile(config, apath) {
    config.staticPaths = config.staticPaths || [ path.resolve('.'), path.resolve(`./views`), path.resolve(`./assets`) ];
    let paths = config.staticPaths;
    paths.push(path.resolve(`${__dirname}/../../assets`));
    for(let i in paths) {
        let checkPath = path.resolve(`${paths[i]}/${apath}`);
        if(fs.existsSync(checkPath)) {
            return checkPath    
        }
    }
}
function standardFileTypes(config,server) {

    server.get(`${config.urlPrefix}/styles/*`, (req, res) => {
        let apath = findStaticFile(config, req._parsedUrl.pathname.replace(config.urlPrefix,''));
        // let str = fs.readFileSync(apath, 'utf8');
        res.sendFile(apath);
    });
    server.get(`${config.urlPrefix}/js/*`, (req, res) => {
        let apath = findStaticFile(config, req._parsedUrl.pathname.replace(config.urlPrefix,''));
        if(apath) {
            res.sendFile(apath);
        } else {
            console.log(req._parsedUrl.pathname, "Not found!");
        }
    });
    server.get(`${config.urlPrefix}/views/*`, (req, res) => {
        let apath = findStaticFile(config, req._parsedUrl.pathname.replace(config.urlPrefix,''));
        res.sendFile(apath);
    });
    server.get('*.html', (req, res) => {
        let apath = path.resolve('./docs/' + req._parsedUrl.pathname.replace(config.urlPrefix,'')).toLowerCase();
        apath = apath.toLowerCase();
        res.sendFile(apath);
    });
    server.get('*.png', (req, res) => {
        let apath = path.resolve('./docs/' + req._parsedUrl.pathname.replace(config.urlPrefix,''));
        apath = apath.toLowerCase();
        if (fs.existsSync(apath)) {
            res.sendFile(apath);
        }
        else {
            res.end(apath + " not found!!");
        }
    });
    server.get('*.jpg', (req, res) => {
        let apath = path.resolve('./docs/' + req._parsedUrl.pathname.replace(config.urlPrefix,''));
        apath = apath.toLowerCase();
        if (fs.existsSync(apath)) {
            res.sendFile(apath);
        }
        else {
            res.end(apath + " not found!!");
        }
    });
    server.get('*.puml', (req, res) => {
        let apath = path.resolve('./docs/' + req._parsedUrl.pathname.replace(config.urlPrefix,''));
        apath = apath.toLowerCase();
        let svgPath = apath.replace(/.puml$/, '.png');
        if (fs.existsSync(svgPath)) {
            res.set('Content-Type', 'image/svg+xml');
            res.sendFile(svgPath);
        } else {
            console.log(req._parsedUrl.pathname.replace(config.urlPrefix,'') + ' not found!');
            console.log(apath + ' file not found!');
            res.end(req._parsedUrl.pathname.replace(config.urlPrefix,'') + ' not found!');
        }
    });
}
function _toJSON(obj) {
    let cache = new Set();
    function clone(obj) {
        // if it is a primitive or function, return as is
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        // if circular detected, return undefined
        if (cache.has(obj)){
            return undefined;
        }
        cache.add(obj);
        // handle Array
        if (Array.isArray(obj)) {
            let newArray = [];
            for(let value of obj){
                newArray.push(clone(value));
            }
            return newArray;
        }
        // handle generic object
        let newObj = {};
        for(let key in obj){
            newObj[key] = clone(obj[key]);
        }
        return newObj;
    }
    let retval = clone(obj);
    return retval;
}

function _setupDefaultServices(config) {
    // const design = require(`${__dirname}/../Services/services.js`);
    
    // AStack.load('ailtire', 'local', design);
}
function _setupAdaptors(config) {
    global.ailtire.comms = { services: []};

    // Default should always be there. This is the websocket socket.io that communicates with the webinterface.
    let myconfig = {
        urlPrefix: config.urlPrefix,
        http: http,
    }
    global.ailtire.comms.services.push( new ASocketIOAdaptor(myconfig) );
    myconfig.urlPrefix = '/design';
    global.ailtire.comms.services.push( new ASocketIOAdaptor(myconfig) );
    if(config.comms) {
        for(let i in config.comms) {
            let comms = config.comms[i];
            comms.http = http;
            comms.urlPrefix = config.urlPrefix;
            global.ailtire.comms.services.push( new comms.adaptor(comms) );
        }
    }
    if(config.ai) {
        let aiAdaptor = config.ai.adaptor;
        global.ai = new aiAdaptor(config.ai);
        // this might need an await.
        global.ai.init();
    }
    if(config.persist) {
        let pAdaptor = config.persist.adaptor;
        pAdaptor.loadAll();
    }
}

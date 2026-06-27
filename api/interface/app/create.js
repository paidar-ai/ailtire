const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const keytar = require('keytar');
const classProxy = require(path.resolve(__dirname, '../../../src/Proxy/ClassProxy.js'));
const appConstruct = require(path.resolve(__dirname, '../../Logical/models/AApplication/construct.js'));
const registerAction = require(path.resolve(__dirname, '../auth/register.js'));
const loginAction = require(path.resolve(__dirname, '../auth/login.js'));

const CLI_CONFIG_DIR = path.join(os.homedir(), '.ailtire');
const CLI_CRED_FILE = path.join(CLI_CONFIG_DIR, 'credentials.json');
const DEFAULT_JWT_SECRET = 'changeme';

module.exports = {
    friendlyName: 'create',
    description: 'Create an app',
    static: true,
    inputs: {
        name: {
            description: 'The name of the application',
            type: 'string',
            required: true
        },
        dir: {
            description: 'The directory to install the application',
            type: 'string',
            required: false
        },
        bootstrapdev: {
            description: 'Bootstrap a local developer identity after app creation',
            type: 'boolean',
            required: false
        },
        identifier: {
            description: 'Developer identity identifier',
            type: 'string',
            required: false
        },
        secret: {
            description: 'Developer identity secret',
            type: 'string',
            required: false
        },
        displayname: {
            description: 'Developer display name',
            type: 'string',
            required: false
        },
        email: {
            description: 'Developer email address',
            type: 'string',
            required: false
        },
    },

    exits: {
        json: (obj) => { return obj; },
    },

    fn: async function (inputs, env) {
        const dir = path.resolve(inputs.dir || `./${inputs.name}`);
        await _createApplicationSkeleton(inputs.name, dir);

        if (_shouldBootstrapDeveloper(inputs)) {
            const bootstrap = await _collectBootstrapInputs(inputs, dir);
            if (bootstrap) {
                await _bootstrapDeveloperIdentity(dir, bootstrap);
                return `Application ${inputs.name} has been created at ${dir}.\nDeveloper identity ${bootstrap.identifier} has been registered and logged in.\nType 'npm install' to populate dependencies.\nThen 'npm start' to start the application.`;
            }
        }

        return `Application ${inputs.name} has been created at ${dir}.\nType 'npm install' to populate dependencies.\nThen 'npm start' to start the application.`;
    }
};

async function _createApplicationSkeleton(name, dir) {
    const previousConfig = global.ailtire?.config;
    const previousBaseDir = global.ailtire?.baseDir;

    global.ailtire = global.ailtire || {};
    global.ailtire.baseDir = dir;
    global.ailtire.config = {
        baseDir: dir,
        host: 'localhost',
        listenPort: 80,
        urlPrefix: '/web',
        prefix: name,
        version: '0.0.1',
    };

    try {
        await appConstruct.fn({name, dir}, {});
    } finally {
        if (previousConfig) {
            global.ailtire.config = previousConfig;
        }
        if (previousBaseDir) {
            global.ailtire.baseDir = previousBaseDir;
        }
    }
}

function _shouldBootstrapDeveloper(inputs) {
    if (inputs.bootstrapdev === false || inputs.bootstrapdev === 'false' || inputs.bootstrapdev === '0') {
        return false;
    }
    if (inputs.bootstrapdev === true || inputs.bootstrapdev === 'true' || inputs.bootstrapdev === '1') {
        return true;
    }
    return process.stdin.isTTY;
}

async function _collectBootstrapInputs(inputs, appDir) {
    if (!process.stdin.isTTY) {
        if (!inputs.bootstrapdev) {
            return null;
        }
        if (!inputs.identifier || !inputs.secret) {
            throw new Error('Non-interactive developer bootstrap requires --identifier and --secret.');
        }
        return {
            identifier: inputs.identifier,
            secret: inputs.secret,
            displayName: inputs.displayname || `${inputs.name} developer`,
            email: inputs.email || '',
            appDir
        };
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const ask = (question, fallback = '') => new Promise((resolve) => {
        rl.question(question, (answer) => {
            const value = (answer || '').trim();
            resolve(value || fallback);
        });
    });

    try {
        if (process.stdin.isTTY && inputs.bootstrapdev !== true && inputs.bootstrapdev !== 'true' && inputs.bootstrapdev !== '1') {
            const proceed = await ask('Bootstrap a developer identity now? [Y/n] ', 'y');
            if (!/^y(es)?$/i.test(proceed)) {
                return null;
            }
        }

        const defaultIdentifier = inputs.identifier || `${inputs.name}-dev`;
        const defaultDisplayName = inputs.displayname || `${inputs.name} developer`;
        const identifier = inputs.identifier || await ask(`Developer identifier [${defaultIdentifier}]: `, defaultIdentifier);
        let secret = inputs.secret || await ask('Developer secret: ');
        while (!secret) {
            secret = await ask('Developer secret: ');
        }
        const displayName = inputs.displayname || await ask(`Display name [${defaultDisplayName}]: `, defaultDisplayName);
        const email = inputs.email || await ask('Email (optional): ', '');

        return {
            identifier,
            secret,
            displayName,
            email,
            appDir
        };
    } finally {
        rl.close();
    }
}

async function _bootstrapDeveloperIdentity(appDir, bootstrap) {
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || DEFAULT_JWT_SECRET;
    process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || DEFAULT_JWT_SECRET;

    global.ailtire = global.ailtire || {};
    global.ailtire.baseDir = appDir;
    global.ailtire.config = global.ailtire.config || {};
    global.ailtire.config.baseDir = appDir;

    const AIdentityBase = require(path.resolve(__dirname, '../../Security/models/AIdentitiy/index.js'));
    const saveMethod = require(path.resolve(__dirname, '../../Security/models/AIdentitiy/save.js'));
    const loadMethod = require(path.resolve(__dirname, '../../Security/models/AIdentitiy/load.js'));
    const loggedInMethod = {
        friendlyName: 'loggedIn',
        description: 'The Identity has Logged In',
        static: true,
        inputs: {
            id: {
                type: 'string',
                description: 'Identifier of the Identity',
                required: true
            }
        },
        exits: {
            json: (obj) => obj,
            success: (obj) => obj,
        },
        fn: async function (inputs) {
            const identity = await AIdentity.load({identifier: inputs.id || inputs.identifier});
            if (!identity) {
                return null;
            }
            identity.lastLogin = new Date().toISOString();
            await identity.save();
            return identity;
        }
    };

    AIdentityBase.definition.methods = AIdentityBase.definition.methods || {};
    AIdentityBase.definition.methods.save = saveMethod;
    AIdentityBase.definition.methods.load = loadMethod;
    AIdentityBase.definition.methods.loggedIn = loggedInMethod;

    const AIdentity = new Proxy(AIdentityBase, classProxy);
    global.AIdentity = AIdentity;
    global.classes = global.classes || {};
    global.classes.AIdentity = AIdentity;

    const registerInputs = {
        id: bootstrap.identifier,
        identifier: bootstrap.identifier,
        secret: bootstrap.secret,
        kind: 'user',
        displayName: bootstrap.displayName,
        email: bootstrap.email || undefined,
        actors: ['root'],
        permissions: ['*'],
        metadata: {bootstrap: true, application: path.basename(appDir)}
    };

    const existing = AIdentity.find({identifier: bootstrap.identifier});
    if (!existing) {
        await registerAction.fn(registerInputs, {});
    }

    const loginResult = await loginAction.fn({
        identifier: bootstrap.identifier,
        secret: bootstrap.secret
    }, {});

    await _saveCliTokens({
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
        expiresAt: loginResult.expiresAt
    });
}

async function _saveCliTokens(tokens) {
    if (!fs.existsSync(CLI_CONFIG_DIR)) {
        fs.mkdirSync(CLI_CONFIG_DIR, {recursive: true});
    }
    fs.writeFileSync(CLI_CRED_FILE, JSON.stringify(tokens, null, 2));
    process.env.CLI_AUTH_TOKEN = tokens.accessToken;
    if (tokens.refreshToken) {
        process.env.CLI_REFRESH_TOKEN = tokens.refreshToken;
    }
}

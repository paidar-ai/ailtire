const axios = require('axios');
const YAML = require('yamljs');
const path = require('path');
const Action = require('../Server/Action');
const fs = require('fs');
const os = require('os');
const homeDir = os.homedir();
const protocols = require('../security/protocols/index.js');
const CLI_CONFIG_DIR = `${homeDir}/.ailtire`;
const CLI_CRED_FILE   = `${CLI_CONFIG_DIR}/credentials.json`;

// Helper to save tokens
async function _saveCliTokens(tokens) {
    if (!fs.existsSync(CLI_CONFIG_DIR)) {
        fs.mkdirSync(CLI_CONFIG_DIR, {recursive: true});
    }
    fs.writeFileSync(CLI_CRED_FILE, JSON.stringify(tokens, null, 2));
}

// helper to load tokens & inject into env
function _loadCliTokenEnv(env) {
  if (fs.existsSync(CLI_CRED_FILE)) {
    const {accessToken, refreshToken, expiresAt} =
      JSON.parse(fs.readFileSync(CLI_CRED_FILE));
    env.token      = accessToken;
    env.refresh    = refreshToken;
    env.expiresAt  = expiresAt;
    global.currentIdentity = env;
  }
}

const readline = require("readline");
const AIHelper = require("../Server/AIHelper");

let baseDir = __dirname;
let _commands = {};

module.exports = {
    execute: async (binDir) => {
        let args = process.argv.slice(2);
        let fullPath = process.argv[1];
        let program = path.basename(fullPath);
        baseDir = binDir;
        if (_hasAppContext()) {
            _normalizeInterface();
        } else {
            global.interface = global.interface || {};
        }
        await _executeCommand(program, args);
    }
}
const _executeCommand = async (program, args) => {
    let commands = [];
    while (args.length > 0) {
        if (args[0][0] === '-') {
            break;
        } else {
            commands.push(args.shift());
        }
    }
    if (commands.length > 0) {
        if (!_hasAppContext()) {
            if (commands[0] === 'version') {
                _helpVersion();
                return;
            }
            if (commands[0] === 'help') {
                _helpTopLevel(program);
                return;
            }
            if (commands[0] === 'app' && commands[1] === 'create') {
                await _runBuiltInAppCreate(args);
                return;
            }
            _helpNoApp(program);
            return;
        }
        await _runCommand(program, commands, args);
    } else {
        if (args.includes('--version') || args.includes('-v')) {
            _helpVersion();
            return;
        }
        _helpTopLevel(program);
    }
};
const _helpGetCommands = (program, topDir) => {
    let helpString = "";
    if (fs.existsSync(topDir)) {
        let dirs = fs.readdirSync(topDir);
        for (let i in dirs) {
            if (dirs[i] !== 'lib' && dirs[i] !== program) {
                if (dirs[i].includes('.js')) {
                    helpString += `\t${dirs[i].replace(/\.js/, '')}`;
                    let action = require(path.resolve(`${topDir}/${dirs[i]}`));
                    for (let iname in action.inputs) {
                        helpString += ` --${iname} <${action.inputs[iname].type}>`;
                    }
                    helpString += `\n\t\t${action.description}\n`;
                } else {
                    helpString += `\t${dirs[i]} [cmd] <args>\n`;
                }
            }
        }
    }
    return helpString;
}
const _helpTopLevel = (program) => {
    let helpString = `Usage: ${program} [cmd]\n`;
    if (_hasAppContext()) {
        for (let i in _commands) {
            helpString += `\t${i} [cmd] <args>\n`;
        }
    } else {
        helpString += `\tapp create --name <string> [--dir <string>]\n`;
        helpString += `\tversion\n`;
        helpString += `\thelp\n`;
    }
    helpString += '\n';
    console.log(helpString);
    process.exit(0);
}

const _helpNoApp = (program) => {
    console.error(`No Ailtire application found in ${global.ailtire.baseDir}.`);
    console.error(`Run "${program} app create --name <name>" or change to a root Ailtire application directory.`);
    process.exit(1);
};

const _hasAppContext = () => {
    return Boolean(global.ailtire?.hasApp);
};

function _existsDir(dir) {
    try {
        if (fs.statSync(dir).isDirectory()) {
            return true;
        }
    } catch (e) {
        return false;
    }
}

const _runCommand = async (program, commands, args) => {
    // Find the command in the current directory.
    let action = _findAction(commands, args, baseDir);
    if (action) {
        await _executeAction(action, args);
        return;
    }
    _helpTopLevel(program);
    return null;
};

const _searchAction = (commands, args, topDir) => {
    if (fs.existsSync(topDir)) {
        let myDirs = fs.readdirSync(topDir);
        let action = null;
        for (let i in myDirs) {
            let dirname = path.resolve(`${topDir}/${myDirs[i]}`);
            if (fs.existsSync(path.resolve(`${dirname}/index.js`))) {
                let package = require(path.resolve(`${dirname}/index.js`));
                let name = package.shortname;
                if (commands[0] === name) {
                    let newCommand = commands.slice(1);
                    if (newCommand.length === 0) {
                        _helpCommandGroup(commands.join(' '), path.resolve(`${dirname}/interface`));
                        return;
                    }
                    action = _findAction(commands.slice(1), args, path.resolve(dirname, "interface"));
                    if (action) {
                        action.fullName = commands.join(' ');
                        return action;
                    } else {
                        action = _searchAction(newCommand, args, dirname);
                        return action;
                    }
                }
            }
        }
    }
    return null;
};

const _helpCommand = (actionObj) => {
    let fullName = actionObj.path.replaceAll(/\//g, ' ');
    let errorString = `Usage: ${fullName}\n`;
    errorString += `\t${actionObj.description}\n`;
    for (let iname in actionObj.inputs) {
        if (actionObj.inputs[iname].required) {
            errorString += ` --${iname} <${actionObj.inputs[iname].type}> (required) -  ${actionObj.inputs[iname].description}\n`;
        } else {

            errorString += `[--${iname} ${actionObj.inputs[iname].type}] (optional) - ${actionObj.inputs[iname].description}\n`;
        }
    }
    console.error(errorString);
    process.exit(0);
}
const _getParameters = (args) => {

    let params = {};
    let i = 0;
    while (i < args.length) {
        if (args[i][0] === '-') {
            let key = args[i++].replace(/-/g, '');
            let value = true;
            if (i < args.length && args[i][0] !== '-') {
                value = args[i++];
            }
            params[key] = value;
        } else {
            console.error("Could not figure out what to do with:", args[i++]);
        }
    }
    return params;
}
const _executeAction = async (actionObj, args) => {
    // Create a map from the args
    let params = _getParameters(args);
    if (params.hasOwnProperty('help')) {
        _helpCommand(actionObj);
        return;
    }
    if(actionObj.path !== '/ailtire/auth/login' && actionObj.path !== '/ailtire/auth/register') {
        const env = {};
        _loadCliTokenEnv(env);
        await protocols.authenticate(env);

        // 3) run your framework’s authenticate() to populate env.user/env.actor
        if(actionObj.path !== '/ailtire/auth/me') {
            authorize(actionObj, env);
        }
    }
    if(actionObj.path === '/ailtire/ai/chat') {
        await aiChat(actionObj);
        return;
    }

    // Check that the args being passed in match the actionObj inputs.
    let data = {}
    for (let ikey in params) {
        if (!actionObj.inputs.hasOwnProperty(ikey)) {
            console.error("Parameter not found: ", ikey);
        } else {
            if (actionObj.inputs && actionObj.inputs[ikey]) {
                let typeAllCAPS = actionObj.inputs[ikey].type.toUpperCase();
                if (typeAllCAPS === 'YAML') {
                    data[ikey] = YAML.load(params[ikey]);
                } else if (typeAllCAPS === 'FILE') {
                    data[ikey] = fs.readFileSync(params[ikey]);
                } else {
                    data[ikey] = params[ikey];
                }
            }
        }
    }
    let failed = false;
    for (let iname in actionObj.inputs) {
        if (actionObj.inputs[iname].required) {
            if (!data[iname]) {
                console.error(`   --${iname} is required!`);
                failed = true;
            }
        }
    }
    if (failed) {
        let fullName = actionObj.path.replaceAll(/\//g, ' ');
        let errorString = `Usage: ${fullName}\n`;
        for (let iname in actionObj.inputs) {
            errorString += ` --${iname} <${actionObj.inputs[iname].type}>\n\t\t${actionObj.inputs[iname].description}\n`;
        }
        console.error(errorString);
        console.error("Command Failed!");
        process.exit(-1);
    } else {
        Action.execute(actionObj, params)
            .then(async (retval) => {
                console.log(retval);

                // If this was the auth login or register command, capture tokens
                if (actionObj.path === '/ailtire/auth/login' || actionObj.path === '/ailtire/auth/register') {
                    try {
                        // Expect retval to be JSON with { accessToken, refreshToken }
                        const parsed = retval;
                        const { accessToken, refreshToken, expiresIn } = parsed;
                        if (accessToken && refreshToken) {
                            // Optionally compute expiresAt for refresh logic
                            const expiresAt = expiresIn
                                ? Math.floor(Date.now() / 1000) + expiresIn
                                : undefined;
                            await _saveCliTokens({ accessToken, refreshToken, expiresAt });
                            console.log('✅ CLI: tokens saved to', CLI_CRED_FILE);
                        }
                    } catch (e) {
                        // ignore parse errors
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                process.exit(0);
            });
    }
};

const aiChat = async (actionObj) => {
    if (!global.ailtire || !global.ailtire.ai) {
        console.error('AI configuration is missing. Please check your configuration.');
        process.exit(1);
    }

    console.log('Starting interactive AI session. Type "exit" or Ctrl+C to quit.\n');

    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });

        // maintain a simple conversation history
        const history = [
            {role: 'system', content: 'You are AI Assistant. Respond concisely.'}
        ];

        rl.prompt();
        rl.on('line', async (line) => {
            const text = line.trim();
            let answer;
            if (!text || text.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            // push user query
            try {
                answer = await actionObj.fn({prompt: text});

                if (!answer) {
                    console.log('No response from AI. Please check your configuration.');
                    rl.prompt();
                    return;
                }
            } catch (err) {
                console.error('Error communicating with AI:', err);
                rl.prompt();
                return;
            }

            // print and push assistant response
            console.log('\n' + answer + '\n');
            history.push({role: 'assistant', content: answer});

            rl.prompt();
        }).on('close', () => {
            console.log('Goodbye!');
            resolve();  // Resolve the promise when readline closes
        });
    });
}

const authorize = (action, env) => {
    const key   = action.permissionKey || action.path;
    const perms = env.actor.permissions;        // merged permissions from all their actors’ roles

    const allowed = perms.some(pat => {
        if (pat === '*') return true;
        return minimatch(key, pat);
    });

    if (!allowed) {
        throw new AppError.Forbidden(`Missing permission: ${key}`);
    }
};
const _postAction = (action, args) => {
    // Try and load the .ailtire.js file into the config.
    let ailtireFile = path.resolve(baseDir + '/../.ailtire.js');
    let config = {
        host: "localhost",
        port: "3000"
    };
    if (fs.existsSync(ailtireFile)) {
        config = require(ailtireFile);
    }
    let url = `http://${config.host}:${config.port}/${action.fullName.replace(/\s/g, '/')}`;

    let params = _getParameters(args);
    if (params.hasOwnProperty('help')) {
        _helpCommand(action);
        return;
    }
    let data = {}
    for (let aname in params) {
        if (action.inputs && action.inputs[aname]) {
            let typeAllCAPS = action.inputs[aname].type.toUpperCase();
            if (typeAllCAPS === 'YAML') {
                data[aname] = YAML.load(params[aname]);
            } else if (typeAllCAPS === 'FILE') {
                data[aname] = fs.readFileSync(params[aname]);
            } else {
                data[aname] = params[aname];
            }
        }
    }
    let failed = false;
    for (let iname in action.inputs) {
        if (action.inputs[iname].required) {
            if (!data[iname]) {
                console.error(`   --${iname} is required!`);
                failed = true;
            }
        }
    }
    if (failed) {
        let errorString = `Usage: ${action.name.replace(/\//g, ' ')}\n`;
        for (let iname in action.inputs) {
            errorString += ` --${iname} <${action.inputs[iname].type}> - ${action.inputs[iname].description}\n`;
        }
        console.error(errorString);
        console.error("Command Failed!");
    } else {
        axios.post(url, data)
            .then(response => {
                console.log("Connected");
                console.log(response.data);
                process.exit(0);
            })
            .catch(error => {
                console.error("Command Failed. Error Code: ", error.code);
                if (error.cause) {
                    console.error(error.cause);
                }
                process.exit(-1);
            });
    }
}
const _helpVersion = () => {
    // Return the version of the package.json
    let project = require(path.resolve(`${baseDir}/../package.json`));
    console.log(project.version);
    process.exit(0);
}

const _runBuiltInAppCreate = async (args) => {
    const action = require(path.resolve(__dirname, '../../api/interface/app/create.js'));
    const params = _getParameters(args);
    if (params.hasOwnProperty('help')) {
        _helpCommand(action);
        return;
    }
    for (let iname in action.inputs) {
        if (action.inputs[iname].required && !params[iname]) {
            _helpCommand(action);
            return;
        }
    }
    const retval = await action.fn(params, {});
    if (retval) {
        console.log(retval);
    }
};
const _findAction = (commands, args, topDir) => {

    let retval = null;
    let current = _commands;
    let found = false;
    for (let i in commands) {
        let command = commands[i];
        if (current.hasOwnProperty(command)) {
            current = current[command]
            found = true;
        } else {
            found = false;
            break;
        }
    }
    if (!found) {
        return null;
    }
    if (current.inputs) {
        return current;
    }
    // This is a group of acctions.
    _helpCommandGroup(commands, current);
    return null;
};
const _helpCommandGroup = (commands, group) => {
    let helpString = `Usage: ${commands.join(' ')} [cmd]\n`;
    for (let i in group) {
        let action = group[i];
        let params = '';
        if (action.inputs) {
            for (let iname in action.inputs) {
                if (action.inputs[iname].required) {
                    params += `--${iname}=<${action.inputs[iname].type}> `
                } else {
                    params += `[--${iname}=${action.inputs[iname].type}] `
                }
            }
        }
        helpString += `\t${action.name.replace(/\//g, ' ')} ${i} ${params}\n`;
        helpString += `\t\t${action.description}\n`;
    }
    console.log(helpString);
    process.exit(0);
}
const _normalizeInterface = () => {

    let interfaces = global.interface;
    for (let i in interfaces) {
        let interface = interfaces[i];
        let paths = interface.path.split('/');
        current = _commands;
        for (let i = 2; i < paths.length; i++) {
            let path = paths[i];
            if (!current.hasOwnProperty(path)) {
                current[path] = {};
            }
            if (i === paths.length - 1) {
                current[path] = interface;
            }
            current = current[path];
        }
    }
}

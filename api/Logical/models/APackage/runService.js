const fs = require('fs');
const path = require('path');
const {spawn, spawnSync} = require('child_process');

module.exports = {
    friendlyName: 'runService',
    description: 'Run one service or all services from a package deploy definition.',
    static: true,
    inputs: {
        package: {
            description: 'Name of the package',
            type: 'string',
            required: true
        },
        env: {
            description: 'Deploy environment to use',
            type: 'string',
            required: false
        },
        service: {
            description: 'Specific service name to run. Omit to run all services.',
            type: 'string',
            required: false
        },
        mode: {
            description: 'Execution mode: local or docker',
            type: 'string',
            required: false
        },
        name: {
            description: 'Application name used for runtime variables',
            type: 'string',
            required: false
        },
        composeFile: {
            description: 'Optional compose file path to write or use',
            type: 'string',
            required: false
        },
        detach: {
            description: 'Run docker compose in detached mode',
            type: 'boolean',
            required: false
        },
    },

    exits: {
        json: (obj) => { return obj; },
        success: (obj) => { return obj; },
    },

    fn: async function (inputs, env) {
        const packageObj = APackage.getPackage(inputs.package);
        if (!packageObj || !packageObj.deploy) {
            throw new Error('Package does not have a deploy definition.');
        }

        const envName = _resolveEnvName(packageObj, inputs.env);
        const envDef = packageObj.deploy.envs?.[envName];
        if (!envDef || !envDef.definition) {
            throw new Error(`Could not find deploy environment "${envName}" for package ${packageObj.name}.`);
        }

        const design = envDef.definition;
        const serviceNames = _resolveServiceNames(design, inputs.service);
        if (serviceNames.length === 0) {
            throw new Error(`No services found in deploy environment "${envName}" for package ${packageObj.name}.`);
        }

        const mode = (inputs.mode || 'local').toLowerCase();
        if (mode === 'docker' || mode === 'compose') {
            return _runDocker(packageObj, envName, design, serviceNames, inputs);
        }
        return _runLocal(packageObj, envName, design, serviceNames, inputs);
    }
};

function _resolveEnvName(packageObj, requested) {
    if (requested && packageObj.deploy.envs?.[requested]) {
        return requested;
    }
    if (packageObj.deploy.envs?.local) {
        return 'local';
    }
    if (packageObj.deploy.envs?.dev) {
        return 'dev';
    }
    const envNames = Object.keys(packageObj.deploy.envs || {});
    if (envNames.length > 0) {
        return envNames[0];
    }
    throw new Error(`Package ${packageObj.name} does not define any deploy environments.`);
}

function _resolveServiceNames(design, requested) {
    const services = design.services || {};
    if (!requested || requested === 'all') {
        return Object.keys(services);
    }
    if (Array.isArray(requested)) {
        return requested.filter((name) => services[name]);
    }
    return requested.split(',').map((name) => name.trim()).filter((name) => name && services[name]);
}

function _runLocal(packageObj, envName, design, serviceNames, inputs) {
    const appName = inputs.name || packageObj.name;
    const launched = [];
    let shuttingDown = false;

    const stopChildren = () => {
        if (shuttingDown) {
            return;
        }
        shuttingDown = true;
        for (const child of launched) {
            if (child && !child.killed) {
                try {
                    child.kill('SIGINT');
                } catch (e) {
                    // Ignore shutdown errors.
                }
            }
        }
    };

    return new Promise((resolve, reject) => {
        const onSignal = () => {
            stopChildren();
            resolve({mode: 'local', stopped: true});
        };
        process.once('SIGINT', onSignal);
        process.once('SIGTERM', onSignal);

        let remaining = serviceNames.length;
        for (const serviceName of serviceNames) {
            const service = design.services[serviceName];
            const launchInfo = _buildLocalLaunchInfo(packageObj, envName, serviceName, service, inputs);
            const child = spawn(launchInfo.command, launchInfo.args, {
                cwd: launchInfo.cwd,
                env: launchInfo.env,
                shell: true,
                stdio: 'inherit',
            });
            launched.push(child);
            child.on('error', reject);
            child.on('exit', (code) => {
                remaining -= 1;
                if (code !== 0 && !shuttingDown) {
                    stopChildren();
                    reject(new Error(`Service ${serviceName} exited with code ${code}.`));
                    return;
                }
                if (remaining === 0 && !shuttingDown) {
                    resolve({
                        mode: 'local',
                        app: appName,
                        env: envName,
                        services: serviceNames,
                    });
                }
            });
        }
    });
}

function _buildLocalLaunchInfo(packageObj, envName, serviceName, service, inputs) {
    const external = service.deployments?.external || {};
    const command = external.command || service.command || 'npm start';
    const cwd = path.resolve(
        packageObj.deploy.dir,
        external.baseDir || service.baseDir || '.'
    );
    const ports = _servicePorts(service);
    const appName = inputs.name || packageObj.name;
    const env = {
        ...process.env,
        ...service.environment,
        AILTIRE_APPNAME: appName,
        AILTIRE_ENV: envName,
        AILTIRE_SERVICENAME: serviceName,
        AILTIRE_MODE: 'local',
    };
    if (external.url) {
        env.AILTIRE_URL = external.url;
    }
    if (!env.PORT && ports.length > 0) {
        env.PORT = String(ports[0]);
    }
    if (!env.AILTIRE_PORT && ports.length > 0) {
        env.AILTIRE_PORT = String(ports[0]);
    }
    return {command, args: [], cwd, env};
}

function _runDocker(packageObj, envName, design, serviceNames, inputs) {
    const composeFile = _writeComposeFile(packageObj, envName, design, serviceNames, inputs);
    const args = ['compose', '-f', composeFile, 'up'];
    if (inputs.detach !== false) {
        args.push('-d');
    }
    if (serviceNames.length === 1) {
        args.push(serviceNames[0]);
    }

    const proc = spawnSync('docker', args, {
        cwd: packageObj.deploy.dir,
        env: {
            ...process.env,
            AILTIRE_APPNAME: inputs.name || packageObj.name,
            AILTIRE_ENV: envName,
        },
        stdio: 'inherit',
        shell: true,
    });

    if (proc.status !== 0) {
        throw new Error(`Docker compose failed for package ${packageObj.name} (${envName}).`);
    }

    return {
        mode: 'docker',
        composeFile: path.resolve(packageObj.deploy.dir, composeFile),
        env: envName,
        services: serviceNames,
    };
}

function _writeComposeFile(packageObj, envName, design, serviceNames, inputs) {
    const composeFile = inputs.composeFile
        ? path.resolve(packageObj.deploy.dir, inputs.composeFile)
        : path.resolve(packageObj.deploy.dir, `.tmp-${packageObj.name.replace(/\s/g, '').toLowerCase()}-${envName}.compose.yml`);

    const yaml = _composeFromDesign(packageObj, envName, design, serviceNames, inputs);
    fs.writeFileSync(composeFile, yaml, 'utf8');
    return path.relative(packageObj.deploy.dir, composeFile);
}

function _composeFromDesign(packageObj, envName, design, serviceNames, inputs) {
    const appName = (inputs.name || packageObj.name).replace(/\s/g, '');
    const lines = [
        'version: "3.8"',
        'services:'
    ];

    for (const serviceName of serviceNames) {
        const service = design.services[serviceName];
        const image = service.deployments?.container?.image || service.image;
        const command = service.deployments?.container?.cmd || service.deployments?.container?.command || service.command;
        const volumes = service.deployments?.container?.volumes || service.volumes || {};
        const env = {...(service.environment || {})};
        const ports = _servicePorts(service);

        lines.push(`  ${serviceName}:`);
        if (image) {
            lines.push(`    image: ${_yamlScalar(image)}`);
        }
        if (command) {
            lines.push(`    command: ${_yamlScalar(command)}`);
        }
        if (ports.length > 0) {
            lines.push('    ports:');
            for (const port of ports) {
                lines.push(`      - "${port}:${port}"`);
            }
        }
        if (Object.keys(volumes).length > 0) {
            lines.push('    volumes:');
            for (const vname in volumes) {
                const volume = volumes[vname];
                if (volume && volume.source && volume.target) {
                    lines.push(`      - ${volume.source}:${volume.target}`);
                }
            }
        }
        env.AILTIRE_APPNAME = appName;
        env.AILTIRE_ENV = envName;
        env.AILTIRE_SERVICENAME = serviceName;
        lines.push('    environment:');
        for (const key of Object.keys(env)) {
            if (env[key] !== undefined && env[key] !== null) {
                lines.push(`      ${key}: ${_yamlScalar(String(env[key]))}`);
            }
        }
        const dependsOn = service.dependsOn || service.depends_on;
        if (Array.isArray(dependsOn) && dependsOn.length > 0) {
            lines.push('    depends_on:');
            for (const dep of dependsOn) {
                lines.push(`      - ${dep}`);
            }
        }
    }

    return `${lines.join('\n')}\n`;
}

function _servicePorts(service) {
    const ports = [];
    const iface = service.interface || {};
    for (const name in iface) {
        const port = iface[name]?.port;
        if (port !== undefined && port !== null) {
            ports.push(Number(port));
        }
    }
    return Array.from(new Set(ports));
}

function _yamlScalar(value) {
    if (value === undefined || value === null) {
        return '""';
    }
    return JSON.stringify(String(value));
}

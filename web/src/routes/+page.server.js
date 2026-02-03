import fs from 'fs';
import path from 'path';

export function load() {

    function loadActors(adir) {
        let actorPanels = [];
        adir = path.resolve(adir);
        let actorsDir = fs.readdirSync(adir);
        for (let i = 0; i < actorsDir.length; i++) {
            let actorDir = actorsDir[i];
            let actor = loadModuleFromFile(`${adir}/${actorDir}/index.js`);
            let destdir = path.resolve(`./static/actors/${actorDir}`);
            fs.mkdirSync(destdir, { recursive: true });
            fs.copyFileSync(`${adir}/${actorDir}/image.png`, `${destdir}/image.png`)
            actorPanels.push({dir: actorDir, name: actor.name});
        }
        return actorPanels;
    }


    function loadModuleFromFile(filepath) {
        const code = fs.readFileSync(filepath, 'utf8');

        // Simulate CommonJS `module` and `exports`
        const module = {exports: {}};
        const exports = module.exports;

        // Use `new Function` to safely execute the file contents
        const script = new Function('module', 'exports', code);

        // Execute the script with the `module` and `exports` objects
        script(module, exports);

        // Return the exported object
        return module.exports;
    }

    const actorPanels = loadActors('../actors');
    return { actorPanels: actorPanels };
}
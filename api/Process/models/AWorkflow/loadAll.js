const fs = require("fs");
const path = require("path");

const isDirectory = source => fs.existsSync(source) && fs.lstatSync(source).isDirectory();
const isFile = source => fs.existsSync(source) && !fs.lstatSync(source).isDirectory();
const getDirectories = source =>
    fs.readdirSync(source)
        .map(name => path.join(source, name))
        .filter(isDirectory);
const getFiles = source =>
    fs.readdirSync(source)
        .map(name => path.join(source, name))
        .filter(isFile);

module.exports = {
    friendlyName: 'loadAll',
    description: 'Recursively load all workflows in subdirectories, tagging each with its category path',
    static: true,
    inputs: {
        package: {
            type: 'APackage',
            description: 'The package whose workflows to load',
            required: true
        }
    },
    fn: function (inputs) {
        let pkg = inputs.package;

        let root = inputs.dir || path.resolve(pkg.definition.dir, 'workflows');

        function recurse(dir, categoryPath) {
            // load any .js files in this directory
            for (let file of getFiles(dir)) {
                if (file.endsWith('.js')) {
                    let wf = AWorkflow.load({package: pkg, file: file});
                    // assign the category based on relative path
                    let category = ACategory.find({name: categoryPath});
                    if (!category) {
                        category = ACategory.construct({name: categoryPath, dir: dir});
                    }
                    wf.category = category;
                    pkg.addToWorkflows(wf);
                    category.addToWorkflows(wf);

                    global.workflows = global.workflows || {};
                    global.workflows[wf.name] = wf;

                    global.categories = global.categories || {};
                    global.categories[category.name] = category;
                }
            }
            // recurse into subdirectories
            for (let subdir of getDirectories(dir)) {
                let name = path.basename(subdir);
                if (name.startsWith('.') || name.toLowerCase() === 'doc') continue;
                let subCategory = categoryPath
                    ? `${categoryPath}/${name}`
                    : name;
                recurse(subdir, subCategory);
            }
        }

        if (fs.existsSync(root)) {
            recurse(root, '');
        }
        return pkg;
    }
};
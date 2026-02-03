const fs = require("fs");
const path = require("path");
const isDirectory = source => fs.existsSync(source) && fs.lstatSync(source).isDirectory();
const isFile = source => fs.existsSync(source) && !fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getFiles = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isFile);

module.exports = {
    loadDocs: (item, dir) => {
        if (fs.existsSync(dir)) {
            let files = getFiles(dir);
            let nfiles = [];
            let ndir = dir;
            ndir = ndir.replace(/[\/\\]/g, '/');
            for (let i in files) {
                let file = files[i];
                let nfile = file.replace(/[\/\\]/g, '/');
                nfiles.push(nfile.replace(ndir, ''));
            }
            item.doc = {basedir: dir, files: nfiles};
        } else {
            fs.mkdirSync(dir);
            item.doc = {basedir: dir, files: []};
        }
    },
    isDirectory: (source) => isDirectory(source),
    isFile: (source) => isFile(source),
    getDirectories: (source) => getDirectories(source),
    getFiles: (source) => getFiles(source),
}
const path = require('path');
const packageProxy = require("./Proxy/PackageProxy");
const classProxy = require("./Proxy/ClassProxy");
const funcHandler = require("./Proxy/MethodProxy");

module.exports = {
    init: (dir) => {
        // First load the APackage and AClass
        let pdir = path.resolve(dir, 'api', 'Logical');
        let package = require(path.join(pdir, 'index.js'));
        if (package.shortname) {
            prefix = 'ailtire/' + package.shortname;
        }
        package.prefix = prefix.toLowerCase();
        package.dir = pdir;
        let packageNameNoSpace = package.name.replace(/\s/g, '');
        global.packages = {};
        package.classes = {};
        let logicalPackage = global.packages[packageNameNoSpace] = new Proxy(package, packageProxy);

        // Load the AMethod Class into the Global Space. Specifially the AMethod so the load and loadAll methods can be used.
        let mdir = path.resolve(pdir, 'models', 'AMethod');
        _bootstrapMethodClass(mdir);

        // Load the AClass Class into the Global space for use.
        let cdir = path.resolve(pdir, 'models', 'AClass');
        let loadClass = require(path.resolve(cdir, 'load.js'));
        loadClass.fn({package: logicalPackage, dir: cdir});
        let pkgClassdir = path.resolve(pdir, 'models', 'APackage');
        loadClass.fn({package: logicalPackage, dir: pkgClassdir});
        APackage.load({dir:path.resolve(dir, 'api', 'Logical'), prefix: 'ailtire'});
        APackage.load({dir:path.resolve(dir, 'api')});
    }
}

function _bootstrapMethodClass(mdir) {
    let methodObj = require(path.resolve(mdir, 'index.js'));
    methodObj.dir = mdir;
    let myProxy = new Proxy(methodObj, classProxy);
    methodObj.definition.owners = new Array();
    methodObj.definition.dir = mdir;

    if(!global.hasOwnProperty("classes")) {
        global.classes = {};
    }
    global.classes["AMethod"] = myProxy;
    global["AMethod"] = myProxy;

    let methodLoad = require(path.resolve(mdir, 'load.js'));
    methodLoad.name = "load";
    methodLoad = new AMethod(methodLoad);
    methodObj.definition.methods[methodLoad.name] = methodLoad;
    methodObj.prototype["load"] = function(inputs) { return funcHandler.run(methodLoad, this, inputs); };
    let methodLoadAll = require(path.resolve(mdir, 'loadAll.js'));
    methodLoadAll.name = "loadAll";
    methodLoadAll = new AMethod(methodLoadAll);
    methodObj.definition.methods[methodLoadAll.name] = methodLoadAll;
    methodObj.prototype["loadAll"] = function(inputs) { return funcHandler.run(methodLoadAll, this, inputs); };
    /*
    global["AMethod"] = {
        load: function(inputs) { return funcHandler.run(methodLoad, this, inputs); },
        loadAll: function(inputs) { return funcHandler.run(methodLoadAll, this, inputs); }
    };

     */
}

const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
    description: 'Save the TDocument to json',
    static: false,
    inputs: {},

    exits: {
        json: (obj) => {
            return obj;
        },
        success: (obj) => {
            return obj;
        },
        notFound: (obj) => {
            console.error("Object not Found:", obj);
            return null;
        },
    },


    fn: function (obj, inputs, env) {

        let parent = obj.parent;

        let dname = path.resolve(`.database/TDocument/${parent.id}`);
        fs.mkdirSync(dname, {recursive: true});
        let tempObj = _toJSONShallow(obj);
        let retString = `module.exports = ${JSON.stringify(tempObj)};`;
        let fname = path.resolve(`${dname}/${obj.id}.js`);
        fs.writeFileSync(fname, retString);
    }
};

function _toJSONShallow(obj) {
    let tempObj = {};
    for (let aname in obj._attributes) {
        tempObj[aname] = obj._attributes[aname];
    }
    for (let aname in obj._associations) {
        if (obj.definition.associations[aname].cardinality === 1) {
            tempObj[aname] = obj._associations[aname].id;
        } else {
            tempObj[aname] = [];
            for (let asname in obj._associations[aname]) {
                tempObj[aname].push(obj._associations[aname][asname].id);
            }
        }
    }
    return tempObj;
}
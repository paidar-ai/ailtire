const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'saveOld',
    description: 'Save the TDocument to json',
    static: false,
    inputs: {
    },

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

        let dname = path.resolve(`.database/TDocument/${obj.id}`);
        fs.mkdirSync(dname, { recursive: true });
        let tempObj = _toJSONShallow(obj);
        delete tempObj.nodes;

        let retString = `module.exports = ${JSON.stringify(tempObj)};`;
        let fname = path.resolve(`${dname}/index.js`);
        fs.writeFileSync(fname, retString);

        /* This needs to be done as part of the addToNodes Method.
        for(let i in obj.nodes) {
            let node = obj.nodes[i];
            let nObj = _toJSONShallow(node);
            let retString = `module.exports = ${JSON.stringify(nObj)};`;
            let fname = path.resolve(`${dname}/${node.id}.js`);
            fs.writeFileSync(fname, retString);
        }
         */
        return;
    }
};

function _toJSONShallow(obj) {
    let tempObj = { };
    for(let aname in obj._attributes) {
        tempObj[aname] = obj._attributes[aname];
    }
    tempObj.state = obj.state;
    for(let aname in obj._associations) {
        if(obj.definition.associations[aname].cardinality === 1) {
            tempObj[aname] = obj._associations[aname].id;
        } else {
            tempObj[aname] = [];
            for(let asname in obj._associations[aname]) {
                tempObj[aname].push(obj._associations[aname][asname].id);
            }
        }
    }
    return tempObj;
}
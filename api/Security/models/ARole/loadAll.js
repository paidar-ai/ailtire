const fs    = require('fs');
const path  = require('path');
const APolicy = require("../APolicy");

module.exports = {
  friendlyName: 'loadAll',
  description: 'Load all role definitions from a directory',
  static: true,
  inputs: {
    dir: {
      type: 'string',
      required: false,
      description: 'Directory containing one .js file per role'
    }
  },
  exits: { success: {} },
  fn: function(inputs) {
    const roles = {};

    let dir = inputs?.dir || path.resolve(ailtire?.config?.baseDir || ailtire?.baseDir, 'security', 'roles')
      fs.mkdirSync(dir, { recursive: true });
    for (const name of fs.readdirSync(dir)) {
        // check if the fname is a directory.
        const roleDir = path.join(dir, name);

        const file = path.join(roleDir, 'index.js');
        if (fs.statSync(roleDir).isDirectory() && fs.existsSync(file)) {
            roles[name] = ARole.load({file: file});
        }
    }
    global.roles = roles;
    return roles;
  }
};

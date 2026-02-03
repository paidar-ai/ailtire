const fs    = require('fs');
const path  = require('path');

module.exports = {
  friendlyName: 'construct',
  description: 'Construct a role in the system. Storing its data in the security/role directory.',
  static: true,
  inputs: {
    name: {
      type: 'string',
      required: true,
      description: 'Name of the role to construct.',
    },
      description: {
        type: 'string',
        description: 'Description of the role.',
        required: false,
      },
      permissions: {
        type: 'array',
        description: 'Permissions for this role. The permissions are an array of strings that show what the role ' +
            ' is allowed to do with the interface of the system. "actor/list" allows the role to list the actors.' +
            ' "actor/*" allows the role to perform all interfaces starting with actor/. "*/list" allows the role' +
            ' to access all of the interfaces with list as the endpoint. This should be a comma separated list.',
        required: false,
      }
  },
  exits: {
    notFound: err => err,
    success: {}
  },
  fn: function(inputs) {

      let {name, description, permissions} = inputs;

      let def = {
          name: name,
          description: description || "Description of the Role needs to be done! (TBD)",
          permissions: permissions?.split(',') || [],
      }
      let dir = path.resolve(ailtire.config?.baseDir || ailtire.config.baseDir, "security", "roles", name.replace(/\s/g, ''));
      let fileName = path.resolve(dir, "index.js");
      fs.mkdirSync(dir, { recursive: true });
      if(fs.existsSync(fileName)) {
          throw new AError.ConflictError(`Role has already been defined: ${name}`);
      }
      fs.writeFileSync(fileName, `module.exports = ${JSON.stringify(def)}`);
      let role = ARole.load({file: fileName});
      return role;
  }
};

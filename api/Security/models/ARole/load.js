const fs    = require('fs');

module.exports = {
  friendlyName: 'load',
  description: 'Load a single role definition by file path',
  static: true,
  inputs: {
    file: {
      type: 'string',
      required: true,
      description: 'Absolute path to the role file (e.g. “admin.js”)'
    }
  },
  exits: {
    notFound: err => err,
  },
  fn: function(inputs) {
    if (!fs.existsSync(inputs.file)) {
      throw new AError.NotFound(`Role file not found: ${inputs.file}`);
    }
    const def = require(inputs.file);
    return new ARole(def);
  }
};

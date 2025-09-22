const path = require('path');

module.exports = {
  friendlyName: 'auth/me',
  description: 'Return the currently authenticated user.',
  static: true,
  inputs: {
  },
  outputs: {
      type: 'json',
      description: 'JSON-stringified current user object',
      properties: {
          id: {
              type: 'string',
              description: 'The user ID'
          },
          username: {
              type: 'string',
              description: 'The user\'s username'
          },
          email: {
              type: 'string',
              description: 'The user\'s email address'
          }
      }
  },
  exits: {
    notFound: (obj) => {
        return {message: obj.message};
    },
      success: {
        cli: (obj) => { return obj.id; }
      },
  },

  fn: async function (inputs, env) {
    if(global.currentIdentity.actor) {
        return {
            id: global.currentIdentity.actor.identifier,
            name: global.currentIdentity.actor.displayName,
            email: global.currentIdentity.actor.email
        };
    } else {
        throw new AError.NotFound('No one Logged In');
    }
  }
};

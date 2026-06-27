const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keytar = require('keytar');
const SERVICE = 'ailtire';

module.exports = {
  friendlyName: 'auth/login',
  description: 'Authenticate a user or service and issue tokens.',
  static: true,
  inputs: {
    identifier: {
      type: 'string',
      description: 'Username, clientId or deviceId',
      required: true
    },
    secret: {
      type: 'string',
      description: 'Password, client secret or device key',
      required: true
    },
  },
  outputs: {
      type: 'json',
      description: 'JSON-stringified object with accessToken and refreshToken',
      properties: {
          accessToken: {
              type: 'string',
              description: 'The access token'
          },
          refreshToken: {
              type: 'string',
              description: 'The refresh token'
          }
      }
  },
  exits: {
    invalidCredentials: (obj) => {
        return {message: 'Invalid credentials, Identifier or secret is incorrect'};
    },
    inactiveAccount: (obj) => {
        return {message: 'Account is disabled'};
    },
    serverError: (obj) => {
        return {message: 'Server Error'};
    },
    json: (obj) => obj
  },

  fn: async function (inputs, env) {
    const { identifier, secret } = inputs;

    // 1. Lookup identity by identifier
    let identity;
    try {
      identity = await loadIdentity(identifier);
      console.log("IDENTITY:", identity);
    } catch (err) {
      throw 'serverError';
    }

    if (!identity) {
      throw 'invalidCredentials';
    }

    if (!identity.isActive) {
      throw 'inactiveAccount';
    }

    // 2. Verify secret
    const match = await bcrypt.compare(secret, identity.secretHash);
    if (!match) {
      throw 'invalidCredentials';
    }

    // 3. Update lastLogin timestamp
      await AIdentity.loggedIn({ id: identity.identifier || identity.id });

    // 4. Issue tokens
      const accessSecret  = process.env.JWT_ACCESS_SECRET || 'changeme';
      const refreshSecret = process.env.JWT_REFRESH_SECRET || 'changeme';
      const accessExp     = process.env.JWT_ACCESS_EXPIRES_IN  || '15m';
      const refreshExp    = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    const payload = {
      userId: identity.id,
      identifier: identity.identifier,
      kind: identity.kind
    };
    const accessToken = jwt.sign(
      payload,
      accessSecret,
      { expiresIn: accessExp }
    );
    const refreshToken = jwt.sign(
      payload,
      refreshSecret,
      { expiresIn: refreshExp }
    );

    // 5. Return tokens
    return { accessToken, refreshToken };
  }
};

async function loadIdentity(identifier) {
    console.log("IDENTIFIER:", identifier);
    const secretHash = await keytar.getPassword(SERVICE, identifier);
    console.log("SECRET:", secretHash);
    if (secretHash) {
        try {
            let identity = AIdentity.load({identifier: identifier});
            console.log("IDENTITY:", identity);
            identity.secretHash = secretHash;
            return identity;
        }
        catch (err) {
            console.error(err);
        }
    }
    return null;
}

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const keytar = require('keytar');
const SERVICE = 'ailtire';

module.exports = {
  friendlyName: 'auth/register',
  description: 'Register a new identity (user, service, or device) and issue JWT tokens.',
  static: true,

  inputs: {
    identifier:  { type: 'string', required: true, description: 'Login name or device ID' },
    secret:      { type: 'string', required: true, description: 'Password or key' },
    kind:        { type: 'string', required: true, isIn: ['user','service','device'] },
    displayName: { type: 'string', required: false },
    email:       { type: 'string', required: false, isEmail: true },
    actors: { type: "Array", description: "Array of actor names, comma seperated list (example: admin, architect)" },
    permissions: { type: "Array", description: "Array of permission, comma seperated list (example: actor/list,actor/*,*/list)" },
    metadata:    { type: 'ref',    required: false, description: 'Custom properties' }
  },

  outputs: {
    accessToken:  { type: 'string' },
    refreshToken: { type: 'string' },
    identity:     { type: 'ref',   description: 'The newly created identity (without secretHash).' }
  },

  exits: {
    conflict:   { description: 'An identity with that identifier already exists.' },
    badRequest: { description: 'Invalid input.' }
  },

  fn: async function (inputs, env) {

    const { identifier, secret, kind, displayName, email, metadata } = inputs;

    // 1) Ensure no duplicate
    const existing = AIdentity.find({ identifier });
    if (existing) {
      throw { conflict: `Identifier "${identifier}" is already in use.` };
    }

    // 2) Hash the secret (password or key)
    const secretHash = await bcrypt.hash(secret, 10);

    // 3) Create the identity record
    const identity = new AIdentity({
      identifier: identifier,
      secretHash: secretHash,
      kind: kind || 'user',
      displayName: displayName || identifier,
      email: email || null,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      isActive: true
    });
    identity.actorNames = inputs.actors || [];
    identity.permissions = inputs.permissions || [];

    // 4) Issue JWT access & refresh tokens
    const { accessToken, refreshToken } = issueTokens({
      id: identity.id,
      identifier,
      kind
    });

    // 5) Strip secretHash before returning
    // delete identity.secretHash;
    await identity.save();

    return { accessToken, refreshToken, identity: identity.identifier };
  }
};


/**
 * PRIVATE: Sign and return an access token + a refresh token.
 * @param  {Object}    payload             – data to embed in both tokens
 * @param  {string}    payload.id          – identity’s primary key
 * @param  {string}    payload.identifier  – login name or device ID
 * @param  {string}    payload.kind        – one of [user, service, device]
 * @return {Object}                        – { accessToken, refreshToken }
 */
function issueTokens(payload) {
  // Read secrets & expiry settings from env (provide defaults if you like)
  const accessSecret  = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessExp     = process.env.JWT_ACCESS_EXPIRES_IN  || '15m';
  const refreshExp    = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets are not configured in environment variables.');
  }

  // Sign access token
  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExp
  });

  // Sign refresh token
  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExp
  });

  return { accessToken, refreshToken };
}
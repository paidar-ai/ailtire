const jwt = require('jsonwebtoken');
const AActor = require('../../Server/AActor');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// MCP transports carry token in headers or in the JSON-RPC payload
function extractToken(req, body) {
  return req.header('Authorization')?.replace(/^Bearer /, '')
      || body?.authToken;
}

function validateToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function lookupActor(decoded) {
  return AActor.get({id: decoded.sub });
}

async function authenticateMCP(env) {
  const token = extractToken(env.req, env.rpcRequest);
  if (!token) throw new Error('Missing MCP auth token');
  const decoded = validateToken(token);
  env.scopes = decoded.scopes || [];
  env.actor  = lookupActor(decoded);
}

module.exports = { authenticateMCP };

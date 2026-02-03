const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// 1) Extract token from Authorization header
function extractToken(req) {
  const auth = req.header('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

// 2) Validate and decode JWT
function validateToken(token) {
    try {
        let retval =  jwt.verify(token, JWT_SECRET);
        return retval;
    }
    catch(e) {
        if(e instanceof jwt.TokenExpiredError) {
            throw new AError.Unauthorized('Token expired');
        }
        throw new AError.Unauthorized('Invalid token');
    }
}

// 3) Lookup actor by subject
function lookupActor(decoded) {
  return AActor.get({ id: decoded.sub } );
}

// 4) Main REST authenticator
async function authenticateREST(env) {
  //  return;
  const token = extractToken(env.req);
  if (!token) throw new AError.Unauthorized('Missing auth token');
  const decoded = validateToken(token);
  env.scopes = decoded.scopes || [];
  env.actor  = lookupActor(decoded);
}

module.exports = { authenticateREST };

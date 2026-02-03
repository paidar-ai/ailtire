// For CLI we read a --token flag or environment variable
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'changeme';

function extractToken(env) {
  return env.token || process.env.CLI_AUTH_TOKEN;
}

function validateToken(token,env) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            const refreshToken = env.refresh;
            if (!refreshToken) {
                throw new Error('Missing refresh token');
            }

            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'changeme');
                const newToken = jwt.sign(
                    {
                        identity: decoded.identity,
                        scopes: decoded.scopes
                    },
                    JWT_SECRET,
                    {expiresIn: '1h'}
                );
                process.env.CLI_AUTH_TOKEN = newToken;
                env.token = newToken;
                let verification =  jwt.verify(newToken, JWT_SECRET);
                decoded.iat = verification.iat;
                decoded.exp = verification.exp;
                return decoded;
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                throw refreshError;
            }
        }
        console.error("Error validating token:", e);
        throw e;
    }
}

function lookupIdentity(decoded) {
  let identity =  AIdentity.load({identifier: decoded.identifier });
  return identity;
}

async function authenticateCLI(env) {
  const token = extractToken(env);
  if (!token) throw new Error('Missing CLI auth token');
  const decoded = validateToken(token,env);
  env.scopes = decoded.scopes || [];
  env.actor  = lookupIdentity(decoded);
}

module.exports = { authenticateCLI };

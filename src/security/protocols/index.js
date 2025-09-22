const { authenticateREST } = require('./rest');
const { authenticateMCP  } = require('./mcp');
const { authenticateCLI  } = require('./cli');

async function authenticate(env) {
  if (env.isMcp) {
    return authenticateMCP(env);
  }
  else if (env.res && env.req) {
    return authenticateREST(env);
  }
  else {
    return authenticateCLI(env);
  }
}

module.exports = { authenticate };

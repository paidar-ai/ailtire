/**
 * Auto-generated test file for team scenario
 * Create a team with members, guidance, and hints
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('team scenario', () => {

  beforeAll(() => {
    console.log("Setting up for all Team Tests:");
    execSync("node bin/ailtire app create --name test-toolbox-scenario");
    process.chdir("./test-toolbox-scenario");
    execSync(`node ../bin/ailtire actor create --name "Architect"`);
    execSync(`node ../bin/ailtire actor create --name "Researcher"`);
    execSync(`node ../bin/ailtire identity createDev`);
    execSync(`node ../bin/ailtire role create --name "Lead Architect"`);
    execSync(`node ../bin/ailtire role create --name "Research Analyst"`);
  });

  test('should add members, resources, guidance, and hints', () => {
    execSync(`node ../bin/ailtire toolbox addmcpserver --toolbox myToolBox --serverUrl https://paidarproductions-897925430.zohomcp.com/mcp/message?key=ef6ab13b0165758dd8766a25285ee063`);
  });
});

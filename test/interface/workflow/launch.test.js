/**
 * Auto-generated test file for launch
 * Launch a Workflow in a UseCase
 */
const { execSync } = require('child_process');
const fs = require("fs"); // Use execSync for CLI testing

describe('workflow launch', () => {
    beforeAll(() => {
        console.log("Setting up for all package Tests:");
        execSync("node bin/ailtire app create --name test-workflow");
        process.chdir("./test-workflow");
        execSync("node ../bin/ailtire package create --name MyPackage");
        fs.cpSync(`${__dirname}/data/SimpleWorkflow.js`, "./api/MyPackage/workflows/SimpleWorkflow.js", { recursive: true });
    });
  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire workflow launch --id test-id`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if id is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire workflow launch --missingKey`);
    }).toThrow();
  });
});
/**
 * Auto-generated test file for create
 * Create an actor
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('actor create', () => {

  beforeAll(() => {
    console.log("Setting up for all actor Tests:");
    execSync("node bin/ailtire app create --name test-actor");
    process.chdir("./test-actor");
  });

  test('should execute successfully with simple name', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire actor create --name "Test"`);
    expect(result.toString()).toBeDefined();
  });

  test('should execute successfully with Complex Name', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire actor create --name "My Actor"`);
    expect(result.toString()).toBeDefined();
  });
  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire actor create --missingKey`);
    }).toThrow();
  });
});
/**
 * Auto-generated test file for create
 * Create an package
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing
const fs = require('fs');

describe('package create', () => {
  beforeAll(() => {
    console.log("Setting up for all package Tests:");
    execSync("node bin/ailtire app create --name test-packages");
    process.chdir("./test-packages");
  });

  test('should execute successfully with Single Package Name', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire package create --name Test`);
    console.log(result.toString());
    // check that a  directory is created.
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/Test')).toBeTruthy();
  });

  test('should execute successfully with Multiple Package Name', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire package create --name "Test/Hello/World"`);
    console.log(result.toString());
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/Test/Hello/World')).toBeTruthy();
  });
  test('should execute successfully with Compound Package Name', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire package create --name "Test Hello World"`);
    console.log(result.toString());
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/TestHelloWorld')).toBeTruthy();
  });
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire package create --missingKey`);
    }).toThrow();
  });
});
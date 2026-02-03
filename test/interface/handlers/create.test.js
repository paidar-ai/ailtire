/**
 * Auto-generated test file for create
 * Create a Method in a Model
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing
const fs = require('fs');

describe('handlers create', () => {
  beforeAll(() => {
    console.log("Setting up for all package Tests:");
    execSync("node bin/ailtire app create --name test-handlers");
    process.chdir("./test-handlers");
    execSync("node ../bin/ailtire package create --name MyPackage");
  });

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire handler create --event my.event -package MyPackage`);
    console.log(result.toString());
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/handlers/my.event.js')).toBeTruthy();
  });

  test('should execute successfully with valid inputs including handlers', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire handler create --event my.event2 -package MyPackage --handlers "[{description: \"Test\", fn: (data) => {console.log(data)}}]"`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/handlers/my.event.js')).toBeTruthy();
  });
});
/**
 * Auto-generated test file for create
 * Create a Method in a Model
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing
const fs = require('fs');

describe('method create', () => {
  beforeAll(() => {
    console.log("Setting up for all package Tests:");
    execSync("node bin/ailtire app create --name test-method");
    process.chdir("./test-method");
    execSync("node ../bin/ailtire package create --name MyPackage");
    execSync("node ../bin/ailtire model create --name MyModel --package MyPackage");
  });

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire method create --name createSomething --model MyModel --package MyPackage`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/models/MyModel/createSomething.js')).toBeTruthy();
  });

  test('should execute successfully with valid inputs without package', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire method create --name createSomething2 --model MyModel`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/models/MyModel/createSomething2.js')).toBeTruthy();
  });

  test('should execute successfully with valid inputs without package', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire method create --name createSomething3 --model MyModel2 --package MyPackage2`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage2/models/MyModel2/createSomething3.js')).toBeTruthy();
  });

  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire method create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if model is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire method create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if package is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire method create --missingKey`);
    }).toThrow();
  });
});
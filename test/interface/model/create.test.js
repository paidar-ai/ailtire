/**
 * Auto-generated test file for create
 * Create an model
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing
const fs = require('fs');

describe('model create', () => {
  beforeAll(() => {
    console.log("Setting up for all package Tests:");
    execSync("node bin/ailtire app create --name test-class");
    process.chdir("./test-class");
    execSync("node ../bin/ailtire package create --name MyPackage");
  });
  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire model create --name MyTestClass --package MyPackage`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/models/MyTestClass')).toBeTruthy();
  });
  test('should execute successfully with New Package', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire model create --name MyTestClassB --package MyNewPackage`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyNewPackage/models/MyTestClassB')).toBeTruthy();
  });

  test('should execute successfully with Complex Name', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire model create --name "My Complex Name" --package MyPackage`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/models/MyComplexName')).toBeTruthy();
  });

  test('should execute successfully with Complex Package', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire model create --name "My Complex NameB" --package "MyPackage/MyPackageB`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/MyPackageB/models/MyComplexNameB')).toBeTruthy();
  });
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire model create --missingKey`);
    }).toThrow();
  });
});
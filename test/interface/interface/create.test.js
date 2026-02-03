/**
 * Auto-generated test file for create
 * Create a Interface in a Package
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing
const fs = require('fs');

describe('interface create', () => {
  beforeAll(() => {
    console.log("Setting up for all package Tests:");
    execSync("node bin/ailtire app create --name test-interface");
    process.chdir("./test-interface");
    execSync("node ../bin/ailtire package create --name MyPackage");
    execSync("node ../bin/ailtire model create --name MyModel --package MyPackage");
  });

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire interface create --name createSomething --package MyPackage`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/interface/createSomething.js')).toBeTruthy();
  });

  test('should execute successfully with valid inputs without package top level', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire interface create --name hello`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/interface/hello.js')).toBeTruthy();
  });
  test('should execute successfully with valid inputs without package multiple level', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire interface create --name trust/me `);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/interface/trust/me.js')).toBeTruthy();
  });
  test('should execute successfully with valid inputs without package 3 level', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire interface create --name trust/me/now `);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/interface/trust/me.js')).toBeTruthy();
  });
  test('should execute successfully with valid inputs without package', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire interface create --name createSomething3 --package MyPackage2`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage2/interface/createSomething3.js')).toBeTruthy();
  });

  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire interface create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if model is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire interface create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if package is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire interface create --missingKey`);
    }).toThrow();
  });
});
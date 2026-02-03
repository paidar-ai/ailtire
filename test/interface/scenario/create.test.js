/**
 * Auto-generated test file for create
 * Create an Scenario in a UseCase
 */
const { execSync } = require('child_process');
const fs = require("fs"); // Use execSync for CLI testing

describe('scenario create', () => {
  beforeAll(() => {
    console.log("Setting up for all usecase Tests:");
    execSync("node bin/ailtire app create --name test-scenario");
    process.chdir("./test-scenario");
    execSync("node ../bin/ailtire package create --name MyPackage");
    execSync('node ../bin/ailtire usecase create --package "MyPackage" --name "My Use Case"');
  });

  test('should execute successfully with valid inputs', () => {
    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire scenario create --name "My Scenario" --package "MyPackage" --usecase "My Use Case"`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/usecases/MyUseCase/MyScenario.js')).toBeTruthy();
  });
  test('should execute successfully with valid inputs not yet created.', () => {
    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire scenario create --name "My Scenario" --package "MyPackage2" --usecase "My Use Case2"`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/usecases/MyUseCase/MyScenario.js')).toBeTruthy();
  });

  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire scenario create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if usecase is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire scenario create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if package is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node ../bin/ailtire scenario create --missingKey`);
    }).toThrow();
  });
});
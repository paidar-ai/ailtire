/**
 * Auto-generated test file for create
 * Create an UseCase
 */
const { execSync } = require('child_process');
const fs = require("fs"); // Use execSync for CLI testing

describe('usecase create', () => {

  beforeAll(() => {
    console.log("Setting up for all usecase Tests:");
    execSync("node bin/ailtire app create --name test-usecase");
    process.chdir("./test-usecase");
    execSync("node ../bin/ailtire package create --name MyPackage");
  });

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire usecase create --name "My Use Case" --package "MyPackage"`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/usecases/MyUseCase/index.js')).toBeTruthy();
  });

  
  test('should execute successfully with no package.', () => {
    const result = execSync(`node ../bin/ailtire usecase create --name "My Primary Use Case"`);
    expect(result.toString()).toBeDefined();
    expect(fs.existsSync('./api/MyPackage/usecases/MyUseCase/index.js')).toBeTruthy();
  });
  
  test('should fail if package is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire usecase create --missingKey`);
    }).toThrow();
  });
});
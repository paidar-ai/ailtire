/**
 * Auto-generated test file for create
 * Create an app
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('app create', () => {

  test('should execute successfully with -name only inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire app create --name test-name`);
    expect(result.toString()).toBeDefined();
  });

  test('should execute successfully with -name and --dir inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire app create --name test-name --dir test-dir`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if dir is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app create --missingKey`);
    }).toThrow();
  });
});
/**
 * Auto-generated test file for create
 * Create an app
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('app create', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire app create --env test-env --name optionalValue`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if env is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app create --missingKey`);
    }).toThrow();
  });
});
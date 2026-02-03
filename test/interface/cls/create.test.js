/**
 * Auto-generated test file for create
 * Create an model
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('cls create', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire cls create --name test-name --package optionalValue`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire cls create --missingKey`);
    }).toThrow();
  });
  
  test('should fail if package is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire cls create --missingKey`);
    }).toThrow();
  });
});
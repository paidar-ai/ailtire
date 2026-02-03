/**
 * Auto-generated test file for get
 * Get the Packages
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('package get', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire package get --id test-id --doc optionalValue`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if id is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire package get --missingKey`);
    }).toThrow();
  });
  
  test('should fail if doc is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire package get --missingKey`);
    }).toThrow();
  });
});
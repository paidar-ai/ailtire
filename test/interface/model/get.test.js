/**
 * Auto-generated test file for get
 * Get a Model
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('model get', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire model get --id test-id --doc optionalValue`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if id is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire model get --missingKey`);
    }).toThrow();
  });
  
  test('should fail if doc is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire model get --missingKey`);
    }).toThrow();
  });
});
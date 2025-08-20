/**
 * Auto-generated test file for uninstall
 * Uninstall an app
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('package uninstall', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire package uninstall --env test-env --name test-name --package test-package`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if env is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire package uninstall --missingKey`);
    }).toThrow();
  });
  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire package uninstall --missingKey`);
    }).toThrow();
  });
  
  test('should fail if package is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire package uninstall --missingKey`);
    }).toThrow();
  });
});
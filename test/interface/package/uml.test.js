/**
 * Auto-generated test file for uml
 * plantuml diagram of the Package
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('package uml', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire package uml --id test-id`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if id is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire package uml --missingKey`);
    }).toThrow();
  });
});
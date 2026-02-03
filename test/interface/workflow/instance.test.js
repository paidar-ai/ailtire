/**
 * Auto-generated test file for instance
 * Return one of the workflow Instances based on the id.
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('workflow instance', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire workflow instance --id test-id`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if id is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire workflow instance --missingKey`);
    }).toThrow();
  });
});
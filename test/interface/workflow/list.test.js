/**
 * Auto-generated test file for list
 * List the Workflows
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('workflow list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire workflow list `);
    expect(result.toString()).toBeDefined();
  });

  
});
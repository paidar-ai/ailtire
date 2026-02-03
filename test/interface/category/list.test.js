/**
 * Auto-generated test file for list
 * List the Workflows
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('category list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire category list `);
    expect(result.toString()).toBeDefined();
  });

  
});
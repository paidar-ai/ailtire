/**
 * Auto-generated test file for list
 * List the Packages
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('package list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire package list `);
    expect(result.toString()).toBeDefined();
  });

  
});
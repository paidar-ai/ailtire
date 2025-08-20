/**
 * Auto-generated test file for list
 * List the Models
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('model list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire model list `);
    expect(result.toString()).toBeDefined();
  });

  
});
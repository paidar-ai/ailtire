/**
 * Auto-generated test file for list
 * List the Deployment
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('env list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire env list `);
    expect(result.toString()).toBeDefined();
  });

  
});
/**
 * Auto-generated test file for get
 * get a Deployment
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('deployment get', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire deployment get `);
    expect(result.toString()).toBeDefined();
  });

  
});
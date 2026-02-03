/**
 * Auto-generated test file for get
 * get a Device
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('device get', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire device get `);
    expect(result.toString()).toBeDefined();
  });

  
});
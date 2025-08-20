/**
 * Auto-generated test file for get
 * get an Environment
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('env get', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire env get `);
    expect(result.toString()).toBeDefined();
  });

  
});
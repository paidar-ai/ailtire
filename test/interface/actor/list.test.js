/**
 * Auto-generated test file for list
 * List the Actors
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('actor list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire actor list `);
    expect(result.toString()).toBeDefined();
  });

  
});
/**
 * Auto-generated test file for docs
 * Generate Documentation of the app
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('app docs', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire app docs `);
    expect(result.toString()).toBeDefined();
  });

  
});
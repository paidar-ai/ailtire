/**
 * Auto-generated test file for list
 * List the Actors
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('usecase list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire usecase list `);
    expect(result.toString()).toBeDefined();
  });

  
});
/**
 * Auto-generated test file for list
 * List the UserActivities
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('useractivity list', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire useractivity list `);
    expect(result.toString()).toBeDefined();
  });

  
});
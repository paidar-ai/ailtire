/**
 * Auto-generated test file for instances
 * Return all of the scenario Instances
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('workflow instances', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire workflow instances `);
    expect(result.toString()).toBeDefined();
  });

  
});
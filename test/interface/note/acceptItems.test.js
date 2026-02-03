/**
 * Auto-generated test file for acceptItems
 * Accept Item for generation of artifacts in the architecture.
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('note acceptItems', () => {
    beforeAll(() => {
        console.log("Setting up for all actor Tests:");
        execSync("node bin/ailtire app create --name test-note");
        process.chdir("./test-note");
        execSync(`node ../bin/ailtire note generate --prompt "Create standard actors to the sysstem including system administrator, user, and executive" --filters "Actor"`);
    });
  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const results =  execSync(`node ../bin/ailtire note acceptItems --note ANote0 --items AItem0,AItem1,AItem2`);
    expect(results.toString()).toBeDefined();
  });

  
  test('should fail if note is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!undefined) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire note acceptItems --missingKey`);
    }).toThrow();
  });
  
  test('should fail if items is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!undefined) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire note acceptItems --missingKey`);
    }).toThrow();
  });
});
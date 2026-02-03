/**
 * Auto-generated test file for generate
 * Generate Items in the architecture
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('note generate', () => {
    beforeAll(() => {
        console.log("Setting up for all actor Tests:");
        execSync("node bin/ailtire app create --name test-note");
        process.chdir("./test-note");
    });
  test('should execute successfully with valid inputs', () => {
    // Run the command and test outputs
    const result = execSync(`node ../bin/ailtire note generate --prompt "Create standard actors and usecases to the system including system administrator, user, and executive" --filters "Actor,Usecase,scenario"`);
    expect(result.toString()).toBeDefined();
  });
    test('should generate note for actors successfully with valid inputs', () => {
        // Run the command and test outputs
        const result = execSync(`node ../bin/ailtire note generate --prompt "Create standard actors to the system including system administrator, user, and executive" --filters "Actor"`);
        expect(result.toString()).toBeDefined();
    });
    test('should generate note for packages successfully with valid inputs', () => {
        // Run the command and test outputs
        const result = execSync(`node ../bin/ailtire note generate --prompt "Create standard packages for a three tiered system for a order control systme including system administration and budgeting." --filters "Package"`);
        expect(result.toString()).toBeDefined();
    });

    test('should generate note for scenarios successfully with valid inputs', () => {
        // Run the command and test outputs
        const result = execSync(`node ../bin/ailtire note generate --prompt "Create standard scenariors for a three tiered system for a order control systme including system administration and budgeting." --filters "Scenario"`);
        expect(result.toString()).toBeDefined();
    });
  test('should fail if prompt is missing or invalid', () => {
    // Skip validation if the key is not required

    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire note generate --missingKey`);
    }).toThrow();
  });
});
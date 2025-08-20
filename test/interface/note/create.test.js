/**
 * Auto-generated test file for generate
 * Generate Items in the architecture
 */
const {execSync} = require('child_process'); // Use execSync for CLI testing

describe('note create', () => {
    beforeAll(() => {
        console.log("Setting up for all actor Tests:");
        execSync("node bin/ailtire app create --name test-note");
        process.chdir("./test-note");
    });
    test('should execute successfully with valid inputs', () => {

        // Run the command and test outputs
        const result = execSync(`node ../bin/ailtire note create --text "This is a bunch of text that should describe the architecture."`);
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
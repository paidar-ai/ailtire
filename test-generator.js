const fs = require("fs");
const path = require("path");

const INTERFACE_DIR = path.resolve("./api/interface");

const TEST_DIR = path.resolve("./test");

/**
 * Generate a test file for each command in the interface directory, maintaining the directory structure.
 */
const generateTests = () => {
    // Recursively traverse the interface directory
    const traverseDir = (currentDir, relativePath = "") => {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        entries.forEach((entry) => {
            const entryPath = path.join(currentDir, entry.name);
            const entryRelativePath = path.join(relativePath, entry.name);

            if (entry.isDirectory()) {
                // Create a corresponding directory in the test folder
                const testDirPath = path.join(TEST_DIR, "interface", relativePath, entry.name);
                if (!fs.existsSync(testDirPath)) {
                    fs.mkdirSync(testDirPath, { recursive: true });
                }
                traverseDir(entryPath, path.join(relativePath, entry.name));
            } else if (entry.isFile() && entry.name.endsWith(".js")) {
                // Generate a test file for the command file
                const testFilePath = path.join(TEST_DIR, "interface", `${entryRelativePath.replace(/\.js$/, ".test.js")}`);
                generateTestForCommand(entryPath, testFilePath);
            }
        });
    };

    traverseDir(INTERFACE_DIR);
};

/**
 * Generate individual test files based on the command definition.
 * @param {string} commandFilePath File path of the command file.
 * @param {string} testFilePath File path to write the generated test file.
 */

/**
 * Extract directory paths after 'interface' directory from a file path.
 * @param {string} filePath The full file path to process.
 * @returns {string[]} Array of directory names after 'interface'.
 */
const getInterfaceSubdirectories = (filePath) => {
    const parts = filePath.split(path.sep);
    const interfaceIndex = parts.indexOf('interface');
    if (interfaceIndex === -1) return [];
    return parts.slice(interfaceIndex + 1, -1);
};

const generateTestForCommand = (commandFilePath, testFilePath) => {
    console.log("Requiring:", commandFilePath);
    const command = require(commandFilePath); // Load the command module
    const {friendlyName, description, inputs} = command;
    const subdirectories = getInterfaceSubdirectories(commandFilePath);
    const preCommands = subdirectories.join(' ');

    // Generate test file content
    const testContent = `
/**
 * Auto-generated test file for ${friendlyName}
 * ${description}
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('${preCommands} ${friendlyName}', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(\`node bin/ailtire ${preCommands} ${friendlyName} ${generateCLICommand(inputs)}\`);
    expect(result.toString()).toBeDefined();
  });

  ${Object.entries(inputs)
        .map(([key, attr]) => generateValidationTest(preCommands + ' ' + friendlyName, key, attr))
        .join("\n  ")}
});
`;

    // Write the test content to the specified test file path
    fs.writeFileSync(testFilePath, testContent.trim());
    console.log(`Generated test file: ${testFilePath}`);
};

/**
 * Generate a string representing CLI arguments for a given inputs definition.
 * @param {Object} inputs Command's inputs definition.
 * @returns {string} CLI argument string.
 */
const generateCLICommand = (inputs) => {
    return Object.entries(inputs)
        .map(([key, attr]) => {
            if (attr.required) {
                return `--${key} test-${key}`;
            }
            return `--${key} optionalValue`;
        })
        .join(" ");
};

/**
 * Generate valid input arguments JSON-like string for tests.
 * @param {Object} inputs Command's inputs definition.
 * @returns {string} Test argument object string for valid inputs.
 */
const generateArgumentString = (inputs) => {
    const args = {};
    Object.entries(inputs).forEach(([key, attr]) => {
        if (attr.type === "string") {
            args[key] = attr.required ? `requiredValue` : `optionalValue`;
        } else if (attr.type === "boolean") {
            args[key] = true;
        }
        // Add more types handling if needed
    });
    return JSON.stringify(args, null, 2);
};

/**
 * Generate validation tests for every command input.
 * @param {string} command.
 * @param {string} key Input name.
 * @param {Object} attr Input attributes (e.g., type, required).
 * @returns {string} The Jest test block as a string.
 */
const generateValidationTest = (command, key, attr) => {
    return `
  test('should fail if ${key} is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!${attr.required}) return;

    // Run command without this required key
    expect(() => {
      execSync(\`node bin/ailtire ${command} --missingKey\`);
    }).toThrow();
  });`;
};

// Run the test generator
generateTests();
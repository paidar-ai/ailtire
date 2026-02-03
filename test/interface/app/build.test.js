/**
 * Auto-generated test file for build
 * Build an app
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('app build', () => {

  test('should execute successfully with valid inputs', () => {

    // Run the command and test outputs
    const result = execSync(`node bin/ailtire app build --env test-env --name optionalValue --repo optionalValue --recursive optionalValue --version optionalValue --bump optionalValue`);
    expect(result.toString()).toBeDefined();
  });

  
  test('should fail if env is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!true) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app build --missingKey`);
    }).toThrow();
  });
  
  test('should fail if name is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app build --missingKey`);
    }).toThrow();
  });
  
  test('should fail if repo is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app build --missingKey`);
    }).toThrow();
  });
  
  test('should fail if recursive is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app build --missingKey`);
    }).toThrow();
  });
  
  test('should fail if version is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!false) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app build --missingKey`);
    }).toThrow();
  });
  
  test('should fail if bump is missing or invalid', () => {
    // Skip validation if the key is not required
    if (!undefined) return;

    // Run command without this required key
    expect(() => {
      execSync(`node bin/ailtire app build --missingKey`);
    }).toThrow();
  });
});
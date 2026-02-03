/**
 * Auto-generated test file for team scenario
 * Create a team with members, guidance, and hints
 */
const { execSync } = require('child_process'); // Use execSync for CLI testing

describe('team scenario', () => {

  beforeAll(() => {
    console.log("Setting up for all Team Tests:");
    execSync("node bin/ailtire app create --name test-team-scenario");
    process.chdir("./test-team-scenario");
    execSync(`node ../bin/ailtire actor create --name "Architect"`);
    execSync(`node ../bin/ailtire actor create --name "Researcher"`);
    execSync(`node ../bin/ailtire identity createDev`);
    execSync(`node ../bin/ailtire role create --name "Lead Architect"`);
    execSync(`node ../bin/ailtire role create --name "Research Analyst"`);
    execSync(`node ../bin/ailtire toolbox create --name "DT Tools"`);
    execSync(`node ../bin/ailtire team create --name "DT Team" --goal "Manage digital transformation content"`);
    execSync(`node ../bin/ailtire team setToolbox --team "DT Team" --toolbox "DT Tools"`);
  });

  test('should add members, resources, guidance, and hints', () => {
    const member1 = execSync(`node ../bin/ailtire team addMember --team "DT Team" --identity "Architect" --role "Lead Architect"`);
    expect(member1.toString()).toBeDefined();

    const member2 = execSync(`node ../bin/ailtire team addMember --team "DT Team" --identity "Researcher" --role "Research Analyst"`);
    expect(member2.toString()).toBeDefined();

    execSync(`node ../bin/ailtire team addResource --team "DT Team" --name "doc1.adoc" --type "adoc" --url "docs/doc1.adoc"`);
    execSync(`node ../bin/ailtire team addResource --team "DT Team" --name "doc2.adoc" --type "adoc" --url "docs/doc2.adoc"`);
    execSync(`node ../bin/ailtire team addResource --team "DT Team" --name "doc3.adoc" --type "adoc" --url "docs/doc3.adoc"`);
    execSync(`node ../bin/ailtire team addResource --team "DT Team" --name "doc4.adoc" --type "adoc" --url "docs/doc4.adoc"`);
    execSync(`node ../bin/ailtire team addResource --team "DT Team" --name "doc5.adoc" --type "adoc" --url "docs/doc5.adoc"`);

    execSync(`node ../bin/ailtire guidance create --id "dt-content" --description "Manage whitepaper and lectures" --goal "Deliver DT architect content"`);
    execSync(`node ../bin/ailtire team addGuidance --team "DT Team" --id "dt-content"`);

    execSync(`node ../bin/ailtire hint create --id "hint-1" --key "whitepaper.outline" --type "open" --template "Draft the whitepaper outline." --guidance "dt-content"`);
    execSync(`node ../bin/ailtire hint create --id "hint-2" --key "lecture.slides" --type "open" --template "Prepare lecture slides for section 1." --guidance "dt-content"`);
    execSync(`node ../bin/ailtire hint create --id "hint-3" --key "review.citations" --type "confirm" --template "Verify all citations are current." --guidance "dt-content"`);
  });
});

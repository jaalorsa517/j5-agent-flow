Feature: Publish j5-agent-flow repository to GitHub Open Source

  Scenario: Configure package.json metadata
    Given the repository is initialized
    When I update "package.json"
    Then it should contain version "1.0.0"
    And it should contain a valid description
    And it should contain author "jaalorsa517"
    And it should contain license "MIT"
    And it should contain repository url "git+https://github.com/jaalorsa517/j5-agent-flow.git"

  Scenario: Add LICENSE file
    Given the repository is initialized
    When I create the "LICENSE" file
    Then it should contain the MIT license text

  Scenario: Add README file
    Given the repository is initialized
    When I create the "README.md" file
    Then it should contain the project title
    And it should contain the description
    And it should contain installation instructions
    And it should contain usage instructions

  Scenario: Configure remote and push changes
    Given the files are updated and committed
    When I set the git remote origin to "git@github.com:jaalorsa517/j5-agent-flow.git"
    And I push the changes
    Then the changes should be available on the remote repository

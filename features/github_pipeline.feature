Feature: GitHub CI/CD Pipeline
  As a developer
  I want to automate testing and releases using GitHub Actions
  To ensure code quality and streamline delivery

  Scenario: Continuous Integration runs on Push/PR
    Given a commit is pushed or a Pull Request is created for the "main" branch
    When the "ci.yml" workflow is triggered
    Then the system must execute linting, testing, and building steps
    And the workflow should succeed if all tests pass

  Scenario: Pipeline failure on failing tests
    Given a commit with failing tests is pushed to the repository
    When the "ci.yml" workflow is triggered
    Then the testing step must fail
    And the entire workflow must report a failure status

  Scenario: Automated Release on Version Tag
    Given a new git tag matching the pattern "v*" is pushed to the repository
    When the "release.yml" workflow is triggered
    Then the system must create a new GitHub Release
    And the Release must include the "j5-agent-flow" build artifact as an asset

Feature: Fix GitHub Pipeline & Release
  As a developer
  I want a robust CI/CD pipeline
  To ensure quality and automated delivery

  Scenario: Package.json has functional test script
    Given the "package.json" file exists
    When I check the "scripts" section
    Then the "test" script must be "node --test tests/*.test.ts"
    And the script should be executable in the CI environment

  Scenario: CI runs tests and builds on push to main
    Given a commit is pushed to the "main" branch
    When the GitHub Action triggers
    Then it must execute "pnpm install", "pnpm test", and "pnpm build" in that order
    And the workflow must fail if "pnpm test" fails

  Scenario: Automated Release with correct tag and assets
    Given the CI/CD pipeline completes successfully on the "main" branch
    When a release step is executed
    Then it must extract the version from "package.json"
    And it must create a GitHub Release with tag "v{version}"
    And it must upload the "j5-agent-flow" directory contents as assets

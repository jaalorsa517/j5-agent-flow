Feature: MCP Prompt Parameters
  As a developer
  I want MCP prompts to support arguments
  To allow dynamic input for prompt generation

  Scenario: Register prompt with "requerimiento" argument
    Given the MCP server is initializing
    When it registers a prompt from "src/prompts/j5-agent-flow.md"
    Then the prompt must expose an argument named "requerimiento"
    And the argument "requerimiento" must be required

  Scenario: Retrieve prompt with parameter interpolation
    Given a prompt is registered with argument "requerimiento"
    When the client requests the prompt providing "My test requirement" as the "requerimiento" argument
    Then the returned message must contain the original prompt content
    And the returned message must include the text "My test requirement"

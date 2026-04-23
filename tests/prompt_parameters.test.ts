import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";

const INDEX_PATH = "src/index.ts";

test("src/index.ts should contain argument registration for prompts", () => {
  const content = fs.readFileSync(INDEX_PATH, "utf-8");
  // Buscamos la definición de argumentos en registerPrompt usando argsSchema
  assert.match(content, /argsSchema\s*:\s*\{/, "Prompt registration should define argsSchema");
  assert.match(content, /requerimiento\s*:\s*z\.string\(\)/, "Argument 'requerimiento' should be registered as string");
});

test("src/index.ts should use the requerimiento argument in the message", () => {
  const content = fs.readFileSync(INDEX_PATH, "utf-8");
  assert.match(content, /args\?\.requerimiento/, "The prompt logic should use the provided argument");
});

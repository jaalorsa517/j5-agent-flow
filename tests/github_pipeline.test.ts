import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

const CI_WORKFLOW_PATH = path.join(process.cwd(), ".github/workflows/ci.yml");
const RELEASE_WORKFLOW_PATH = path.join(process.cwd(), ".github/workflows/release.yml");

test("GitHub Actions: CI workflow file must exist", () => {
  assert.strictEqual(fs.existsSync(CI_WORKFLOW_PATH), true, "ci.yml should exist");
});

test("GitHub Actions: Release workflow file must exist", () => {
  assert.strictEqual(fs.existsSync(RELEASE_WORKFLOW_PATH), true, "release.yml should exist");
});

test("GitHub Actions: CI must contain install, build and test steps", () => {
  const content = fs.readFileSync(CI_WORKFLOW_PATH, "utf-8");
  assert.match(content, /pnpm install/, "CI must run install");
  assert.match(content, /pnpm build/, "CI must run build");
  assert.match(content, /tsx --test/, "CI must run tests");
});

test("GitHub Actions: Release must use gh-release and include artifacts", () => {
  const content = fs.readFileSync(RELEASE_WORKFLOW_PATH, "utf-8");
  assert.match(content, /softprops\/action-gh-release/, "Release must use gh-release action");
  assert.match(content, /j5-agent-flow\//, "Release must include artifacts");
});

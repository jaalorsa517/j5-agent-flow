import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

test('Configure package.json metadata', async () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
  const pkg = JSON.parse(packageJsonContent);

  assert.strictEqual(pkg.version, '1.0.0');
  assert.ok(pkg.description && pkg.description.length > 0, 'Description should be valid');
  assert.strictEqual(pkg.author, 'jaalorsa517');
  assert.strictEqual(pkg.license, 'MIT');
  assert.strictEqual(pkg.repository?.url, 'git+https://github.com/jaalorsa517/j5-agent-flow.git');
});

test('Add LICENSE file', async () => {
  const licensePath = path.resolve(process.cwd(), 'LICENSE');
  const licenseContent = await fs.readFile(licensePath, 'utf-8');
  assert.ok(licenseContent.includes('MIT License'), 'Should contain MIT license text');
});

test('Add README file', async () => {
  const readmePath = path.resolve(process.cwd(), 'README.md');
  const readmeContent = await fs.readFile(readmePath, 'utf-8');
  assert.ok(readmeContent.includes('j5-agent-flow'), 'Should contain project title');
  assert.ok(readmeContent.includes('MCP Server'), 'Should contain description');
  assert.ok(readmeContent.includes('Install'), 'Should contain installation instructions');
});

test('Configure remote origin', () => {
  try {
    const output = execSync('git remote get-url origin').toString().trim();
    assert.strictEqual(output, 'git@github.com:jaalorsa517/j5-agent-flow.git');
  } catch (error) {
    assert.fail('Remote origin not configured correctly');
  }
});

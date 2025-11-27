import fs from 'node:fs';

const tag = process.env.stringToParse || '';

// Strict semver validation: major.minor.patch with optional -beta.number suffix
// Only allows valid semantic versions (e.g., 1.2.3 or 1.2.3-beta.4)
// Prevents invalid versions like 0.0.0 from being published
const match = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-beta\.(?:0|[1-9]\d*))?$/.exec(tag);

let outputs = [`version=`, `prerelease=`, `skip-publish=true`];

if (match) {
  // Extract the prerelease part if present (e.g., "-beta.4")
  const prereleaseMatch = /-beta\.\d+/.exec(tag);
  const prereleaseType = prereleaseMatch ? prereleaseMatch[0].match(/[a-z]+/)[0] : '';
  outputs = [`version=${tag}`, `prerelease=${prereleaseType}`, `skip-publish=false`];
}

// Validate GITHUB_OUTPUT environment variable exists
if (!process.env.GITHUB_OUTPUT) {
  console.error('Error: GITHUB_OUTPUT environment variable is not set');
  process.exit(1);
}

console.log(`Parsing tag: "${tag}"`);
if (match) {
  console.log(`✓ Valid version detected: ${tag}`);
} else {
  console.log(`✗ Invalid version format: "${tag}" - skipping publish`);
}

fs.appendFileSync(process.env.GITHUB_OUTPUT, outputs.join('\n') + '\n');

import { spawnSync } from 'child_process';
import fs from 'fs/promises';

// CEM analyzer does not have a "output to stdout" yet
// We use a temporary (inside node_modules) directory instead of `/dist` so WDS does not trigger an infinite loop of full page reload.
export async function generateCustomElementsManifest () {

  // Save package JSON so we can rollback the `customElements` field modification at the end
  const packageJson = await fs.readFile('package.json', 'utf8');

  const tmpDir = 'node_modules/.tmp-cem';
  await fs.mkdir(tmpDir, { recursive: true });

  const result = spawnSync('npx', ['cem', 'analyze', '--litelement', '--outdir', tmpDir]);
  console.log(result.stdout.toString());
  console.log(result.stderr.toString());
  const cemJson = await fs.readFile(tmpDir + '/custom-elements.json', 'utf8');

  // Rollback the package.json
  await fs.writeFile('package.json', packageJson, 'utf8');

  return cemJson;
}

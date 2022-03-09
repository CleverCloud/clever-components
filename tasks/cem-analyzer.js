import { spawnSync } from 'child_process';
import fs from 'fs/promises';
import os from 'os';

// CEM analyzer does not have a "output to stdout" yet
// We use a temporary directory instead of `/dist` so WDS does not trigger an infinite loop of full page reload.
export async function generateCustomElementsManifest () {

  // Save package JSON so we can rollback the `customElements` field modification at the end
  const packageJson = await fs.readFile('package.json', 'utf8');

  const CEM_OUT_DIR = os.tmpdir() + '/cc-cem';
  await fs.mkdir(CEM_OUT_DIR, { recursive: true });
  process.env.CEM_OUT_DIR = CEM_OUT_DIR;

  spawnSync('npm', ['run', 'components:docs']);
  const cemJson = await fs.readFile(CEM_OUT_DIR + '/custom-elements.json', 'utf8');

  // Rollback the package.json
  await fs.writeFile('package.json', packageJson, 'utf8');

  return cemJson;
}

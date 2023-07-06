import semver from 'semver';
import { CDN_ENVIRONMENTS } from './cdn-environments.js';
import { NO_CACHE } from './cellar-client.js';

// This script sorts manifest.json entries.
// this script is to be run once !

const SEMVER_ENTRY_COMPARATOR = (e1, e2) => semver.rcompare(e1.name, e2.name);
const DEFAULT_ENTRY_COMPARATOR = (e1, e2) => e1.name.localeCompare(e2.name, null, { sensitivity: 'base' });

async function run () {
  const [env] = process.argv.slice(2);
  const cdnEnv = CDN_ENVIRONMENTS[env];
  if (cdnEnv == null) {
    throw new Error(`Unknown env ${env}`);
  }
  console.log(`Migration of env ${env}`);

  const cellar = cdnEnv.createCellarClient();

  const manifest = await cellar.getObject({ key: 'manifest.json' });

  const comparator = manifest.semver ? SEMVER_ENTRY_COMPARATOR : DEFAULT_ENTRY_COMPARATOR;
  manifest.entries = [...manifest.entries].sort(comparator);

  const body = JSON.stringify(manifest, null, '  ');

  await cellar.putObject({
    key: 'manifest.json',
    body,
    cacheControl: NO_CACHE,
  });

  console.log(`Done.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

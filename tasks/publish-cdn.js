import { CellarClient, LONG_CACHE } from './cellar-client.js';

const cellar = new CellarClient({
  bucket: 'components.clever-cloud.com',
  accessKeyId: process.env.SMART_CDN_CELLAR_KEY_ID,
  secretAccessKey: process.env.SMART_CDN_CELLAR_SECRET_KEY,
});

async function run () {
  const cdnDir = 'dist-cdn';
  await cellar.sync({ localDir: cdnDir, cacheControl: LONG_CACHE });
  await cellar.putObject({ key: 'index.html', filepath: 'cdn-ui/index.html' });
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

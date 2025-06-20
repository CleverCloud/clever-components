import { CellarClient } from './cellar-client.js';

const cellar = new CellarClient({
  bucket: 'clever-test-flo-visual-regressions',
  accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
});

cellar
  .sync({ localDir: 'screenshots', remoteDir: 'toto-test/', deleteRemoved: true })
  .catch((error) => console.log(error));

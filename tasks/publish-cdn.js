import fs from 'fs/promises';
import util from 'util';
import AWS from 'aws-sdk';
import rawGlob from 'glob';
import mime from 'mime-types';

const glob = util.promisify(rawGlob);

const cdnDir = 'dist-cdn';
const ONE_YEAR = 365 * 24 * 60 * 60;

async function run () {

  const accessKeyId = process.env.S3_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('Could not read S3 access/secret keys!');
  }
  const uploadToCellar = cellar({
    host: 'cellar-c2.services.clever-cloud.com',
    bucket: 'components.clever-cloud.com',
    accessKeyId,
    secretAccessKey,
  });

  const fileList = await glob('**/*', { cwd: cdnDir, nodir: true });
  for (const file of fileList) {
    await uploadToCellar(cdnDir + '/' + file, file);
  }
}

function cellar ({ accessKeyId, secretAccessKey, host, bucket }) {

  AWS.config.update({ accessKeyId, secretAccessKey });
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(host),
    signatureVersion: 'v4',
  });

  return async function (filepath, remoteFilepath = filepath) {
    console.log(`Uploading to Cellar ${filepath} => ${remoteFilepath} ...`);
    const Body = await fs.readFile(filepath);
    const ContentType = mime.lookup(filepath);
    const Metadata = {};
    return new Promise((resolve, reject) => {
      const params = {
        ACL: 'public-read',
        ContentType,
        CacheControl: `public, max-age=${ONE_YEAR}, immutable`,
        Metadata,
        Body,
        Bucket: bucket,
        Key: remoteFilepath,
      };
      return s3.putObject(params, (err) => err ? reject(err) : resolve());
    }).then(() => console.log('  DONE!'));
  };
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

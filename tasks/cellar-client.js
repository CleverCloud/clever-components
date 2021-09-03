import { createReadStream } from 'fs';
import { promisify } from 'util';
import AWS from '@aws-sdk/client-s3';
import rawGlob from 'glob';
import mime from 'mime-types';
import path from 'path';

const glob = promisify(rawGlob);

const ONE_YEAR = 365 * 24 * 60 * 60;
export const LONG_CACHE = `public, max-age=${ONE_YEAR}, immutable`;

export class CellarClient {

  constructor ({ bucket, accessKeyId, secretAccessKey }) {

    if (accessKeyId == null || secretAccessKey == null) {
      throw new Error('Could not read Cellar access/secret keys!');
    }

    this._bucket = bucket;
    this._client = new AWS.S3Client({
      endpoint: 'https://cellar-c2.services.clever-cloud.com',
      credentials: { accessKeyId, secretAccessKey },
      region: 'REGION',
    });
  }

  getObject ({ key }) {
    return this._client
      .send(new AWS.GetObjectCommand({ Bucket: this._bucket, Key: key }))
      .then((response) => streamToObject(response.Body));
  }

  async listKeys ({ prefix }) {
    const listObjectsResponse = await this._client.send(new AWS.ListObjectsV2Command({
      Bucket: this._bucket,
      Prefix: prefix,
    }));
    const files = listObjectsResponse.Contents ?? [];
    return files.map((file) => file.Key);
  }

  putObject ({ key, body, filepath, acl = 'public-read', cacheControl }) {

    const objectBody = (body == null && filepath != null)
      ? createReadStream(filepath)
      : body;

    return this._client
      .send(new AWS.PutObjectCommand({
        Bucket: this._bucket,
        Key: key,
        ContentType: mime.lookup(key),
        Body: objectBody,
        ACL: acl,
        CacheControl: cacheControl,
      }))
      .then(() => console.log(`PUT    ${key}`));
  }

  deleteObject ({ key }) {
    return this._client
      .send(new AWS.DeleteObjectCommand({
        Bucket: this._bucket,
        Key: key,
      }))
      .then(() => console.log(`DELETE ${key}`));
  }

  async deleteManyObjects ({ prefix }) {
    const remoteKeys = await this.listKeys({ prefix });
    return Promise.all(remoteKeys.map((key) => this.deleteObject({ key })));
  }

  async sync ({ localDir, remoteDir = '', deleteRemoved = false, cacheControl }) {

    const localFiles = await glob('**', { nodir: true, cwd: localDir });
    const localFilesWithKeys = localFiles.map((relativePath) => {
      const filepath = path.join(localDir, relativePath);
      const key = path.join(remoteDir, relativePath);
      return { filepath, key };
    });

    await Promise.all(
      localFilesWithKeys.map((file) => this.putObject({ ...file, cacheControl })),
    );

    if (deleteRemoved) {
      const remoteKeys = await this.listKeys({ prefix: `${remoteDir}/` });
      const removedKeys = remoteKeys
        .filter((remoteKey) => localFilesWithKeys.find((file) => file.key === remoteKey) == null);
      await Promise.all(
        removedKeys.map((key) => this.deleteObject({ key })),
      );
    }
  }
}

function streamToString (stream) {
  return new Promise((resolve, reject) => {
    const data = [];
    stream.on('data', (chunk) => data.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(data).toString()));
    stream.on('error', reject);
  });
}

async function streamToObject (stream) {
  const jsonObject = await streamToString(stream);
  return JSON.parse(jsonObject);
}

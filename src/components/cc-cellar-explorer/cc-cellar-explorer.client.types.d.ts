import { CellarAcl, CellarTag } from '@clevercloud/client/cc-api-commands/cellar/cellar.types.js';

export interface CellarBucketsListResponse {
  buckets: Array<CellarBucket>;
  total: number;
}

export interface CellarBucket {
  name: string;
  createdAt: string;
  updatedAt: string;
  objectsCount: number;
  sizeInBytes: number;
  versioning?: CellarBucketVersioning;
}

export interface CellarBucketDetails extends CellarBucket {}

export type CellarBucketVersioning = 'DISABLED' | 'ENABLED' | 'SUSPENDED';

export interface CellarObjectsListResponse {
  cursor?: string;
  items: Array<CellarFile>;
  directories: Array<CellarDirectory>;
}

export interface CellarFile {
  type: 'file';
  key: string;
  name: string;
  updatedAt: string;
  contentLength: number;
  volatile?: boolean;
}

export interface CellarDirectory {
  type: 'directory';
  key: string;
  name: string;
  volatile?: boolean;
}

export interface CellarFileDetails extends CellarFile {
  contentType: string;
  tags: Array<CellarTag>;
  acl: Array<CellarAcl>;
  metadata: Record<string, string>;
}

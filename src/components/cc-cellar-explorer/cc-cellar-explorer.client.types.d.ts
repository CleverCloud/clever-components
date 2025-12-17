export interface CellarEndpoint {
  host: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface CellarBucketsListResponse {
  cursor?: string;
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

export type CellarBucketVersioning = 'disabled' | 'enabled' | 'suspended';

export interface CellarObjectsListResponse {
  cursor?: string;
  content: Array<CellarFile | CellarDirectory>;
}

export interface CellarFile {
  type: 'file';
  name: string;
  fullName: string;
  updatedAt: string;
  contentLength: number;
}

export interface CellarDirectory {
  type: 'directory';
  name: string;
  fullName: string;
}

export interface CellarFileDetails extends CellarFile {}

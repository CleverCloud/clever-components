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
  content: Array<CellarFile>;
  directories: Array<CellarDirectory>;
}

export interface CellarFile {
  type: 'file';
  key: string;
  name: string;
  updatedAt: string;
  contentLength: number;
}

export interface CellarDirectory {
  type: 'directory';
  key: string;
  name: string;
}

export interface CellarFileDetails extends CellarFile {
  contentType: string;
  tags: Array<{ key: string; value: string }>;
  acl: Array<CellarAcl>;
  metadata: Record<string, string>;
}

export interface CellarAcl {
  grantee: Array<CellarGrantee>;
  permission: 'FULL_CONTROL' | 'READ' | 'READ_ACP' | 'WRITE' | 'WRITE_ACP';
}

export interface CellarGrantee {
  id: string;
  name: string;
  type: 'AmazonCustomerByEmail' | 'CanonicalUser' | 'Group';
}

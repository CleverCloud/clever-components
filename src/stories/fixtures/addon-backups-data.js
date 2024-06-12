/**
 * @typedef {import('../../components/cc-addon-backups/cc-addon-backups.types.js').AddonBackupsStateLoaded} AddonBackupsStateLoaded
 */

/** @type {AddonBackupsStateLoaded} */
export const backupsNewElasticsearchState = {
  type: 'loaded',
  providerId: 'es-addon',
  backups: [
    {
      createdAt: new Date('2019-11-17 03:00'),
      url: 'https://example.com/kibana-backup/2019-11-17-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-17-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-17-03-00/_delete',
      expiresAt: new Date('2019-11-27 03:00'),
    },
    {
      createdAt: new Date('2019-11-18 03:30'),
      url: 'https://example.com/kibana-backup/2019-11-18-03-30',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-18-03-30/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-18-03-30/_delete',
      expiresAt: new Date('2019-11-28 03:30'),
    },
    {
      createdAt: new Date('2019-11-19 03:00'),
      url: 'https://example.com/kibana-backup/2019-11-19-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-19-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-19-03-00/_delete',
      expiresAt: new Date('2019-11-29 03:00'),
    },
    {
      createdAt: new Date('2019-11-20 03:00'),
      url: 'https://example.com/kibana-backup/2019-11-20-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-20-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-20-03-00/_delete',
      expiresAt: new Date('2019-11-30 03:00'),
    },
    {
      createdAt: new Date('2019-11-21 03:00'),
      url: 'https://example.com/kibana-backup/2019-11-21-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-21-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-21-03-00/_delete',
    },
  ],
  passwordForCommand: 'password-for-command',
};

/** @type {AddonBackupsStateLoaded} */
export const backupsOldElasticsearchState = {
  type: 'loaded',
  providerId: 'es-addon-old',
  passwordForCommand: 'password-for-command',
  backups: [
    {
      createdAt: new Date('2019-11-17 03:00'),
      url: 'https://example.com/elasticsearch-backup/2019-11-17-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-17-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-17-03-00/_delete',
      expiresAt: new Date('2019-11-27 03:00'),
    },
    {
      createdAt: new Date('2019-11-18 03:30'),
      url: 'https://example.com/elasticsearch-backup/2019-11-18-03-30',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-18-03-30/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-18-03-30/_delete',
      expiresAt: new Date('2019-11-28 03:30'),
    },
    {
      createdAt: new Date('2019-11-19 03:00'),
      url: 'https://example.com/elasticsearch-backup/2019-11-19-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-19-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-19-03-00/_delete',
      expiresAt: new Date('2019-11-29 03:00'),
    },
    {
      createdAt: new Date('2019-11-20 03:00'),
      url: 'https://example.com/elasticsearch-backup/2019-11-20-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-20-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-20-03-00/_delete',
      expiresAt: new Date('2019-11-30 03:00'),
    },
    {
      createdAt: new Date('2019-11-21 03:00'),
      url: 'https://example.com/elasticsearch-backup/2019-11-21-03-00',
      restoreCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-21-03-00/_restore',
      deleteCommand: 'curl -XPOST -u 8H8bO5XGeWAZgA https://r3sdepwtxlpso2jbbhho-elasticsearch.services.clever-cloud.com/_snapshot/cc-s3-repository/2019-11-21-03-00/_delete',
    },
  ],
};

/** @type {AddonBackupsStateLoaded} */
export const backupsPostgresqlState = {
  type: 'loaded',
  providerId: 'postgresql-addon',
  passwordForCommand: 'password-for-command',
  backups: [
    {
      createdAt: new Date('2020-12-23T16:31:56.713Z'),
      expiresAt: new Date('2020-12-28T03:30:00.000Z'),
      url: 'https://ccbackups-postgresql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/postgresql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'pg_restore -h buet68oyeprz5tlhcdvn-postgresql.services.clever-cloud.com -p 1204 -U ug6icxp9f2mtjmxbtons -d buet68oyeprz5tlhcdvn --format=c YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-24T02:02:03.006Z'),
      expiresAt: new Date('2020-12-29T03:30:00.000Z'),
      url: 'https://ccbackups-postgresql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/postgresql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: 'pg_restore -h buet68oyeprz5tlhcdvn-postgresql.services.clever-cloud.com -p 1204 -U ug6icxp9f2mtjmxbtons -d buet68oyeprz5tlhcdvn --format=c YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-25T16:31:56.713Z'),
      expiresAt: new Date('2020-12-30T03:30:00.000Z'),
      url: 'https://ccbackups-postgresql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/postgresql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'pg_restore -h buet68oyeprz5tlhcdvn-postgresql.services.clever-cloud.com -p 1204 -U ug6icxp9f2mtjmxbtons -d buet68oyeprz5tlhcdvn --format=c YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-26T02:02:03.006Z'),
      expiresAt: new Date('2020-12-31T03:30:00.000Z'),
      url: 'https://ccbackups-postgresql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/postgresql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: 'pg_restore -h buet68oyeprz5tlhcdvn-postgresql.services.clever-cloud.com -p 1204 -U ug6icxp9f2mtjmxbtons -d buet68oyeprz5tlhcdvn --format=c YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-27T16:31:56.713Z'),
      expiresAt: new Date('2021-01-01T03:30:00.000Z'),
      url: 'https://ccbackups-postgresql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/postgresql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'pg_restore -h buet68oyeprz5tlhcdvn-postgresql.services.clever-cloud.com -p 1204 -U ug6icxp9f2mtjmxbtons -d buet68oyeprz5tlhcdvn --format=c YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
  ],
};

/** @type {AddonBackupsStateLoaded} */
export const backupsMysqlState = {
  type: 'loaded',
  providerId: 'mysql-addon',
  passwordForCommand: 'password-for-command',
  backups: [
    {
      createdAt: new Date('2020-12-23T16:31:56.713Z'),
      expiresAt: new Date('2020-12-28T03:30:00.000Z'),
      url: 'https://ccbackups-mysql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mysql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'mysql -h buet68oyeprz5tlhcdvn-mysql.services.clever-cloud.com -P 1204 -u ug6icxp9f2mtjmxbtons -p buet68oyeprz5tlhcdvn < YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-24T02:02:03.006Z'),
      expiresAt: new Date('2020-12-29T03:30:00.000Z'),
      url: 'https://ccbackups-mysql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mysql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: 'mysql -h buet68oyeprz5tlhcdvn-mysql.services.clever-cloud.com -P 1204 -u ug6icxp9f2mtjmxbtons -p buet68oyeprz5tlhcdvn < YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-25T16:31:56.713Z'),
      expiresAt: new Date('2020-12-30T03:30:00.000Z'),
      url: 'https://ccbackups-mysql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mysql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'mysql -h buet68oyeprz5tlhcdvn-mysql.services.clever-cloud.com -P 1204 -u ug6icxp9f2mtjmxbtons -p buet68oyeprz5tlhcdvn < YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-26T02:02:03.006Z'),
      expiresAt: new Date('2020-12-31T03:30:00.000Z'),
      url: 'https://ccbackups-mysql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mysql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: 'mysql -h buet68oyeprz5tlhcdvn-mysql.services.clever-cloud.com -P 1204 -u ug6icxp9f2mtjmxbtons -p buet68oyeprz5tlhcdvn < YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-27T16:31:56.713Z'),
      expiresAt: new Date('2021-01-01T03:30:00.000Z'),
      url: 'https://ccbackups-mysql-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mysql_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'mysql -h buet68oyeprz5tlhcdvn-mysql.services.clever-cloud.com -P 1204 -u ug6icxp9f2mtjmxbtons -p buet68oyeprz5tlhcdvn < YOUR_BACKUP_FILE',
      deleteCommand: null,
    },
  ],
};

/** @type {AddonBackupsStateLoaded} */
export const backupsMongodbState = {
  type: 'loaded',
  providerId: 'mongodb-addon',
  passwordForCommand: 'password-for-command',
  backups: [
    {
      createdAt: new Date('2020-12-23T16:31:56.713Z'),
      expiresAt: new Date('2020-12-28T03:30:00.000Z'),
      url: 'https://ccbackups-mongodb-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mongodb_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'mongorestore --host=buet68oyeprz5tlhcdvn-mongodb.services.clever-cloud.com --port=1204 --username=ug6icxp9f2mtjmxbtons --nsFrom="buet68oyeprz5tlhcdvn.*" --nsTo="buet68oyeprz5tlhcdvn.*" --authenticationDatabase=buet68oyeprz5tlhcdvn --archive=YOUR_BACKUP_FILE --gzip',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-24T02:02:03.006Z'),
      expiresAt: new Date('2020-12-29T03:30:00.000Z'),
      url: 'https://ccbackups-mongodb-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mongodb_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: 'mongorestore --host=buet68oyeprz5tlhcdvn-mongodb.services.clever-cloud.com --port=1204 --username=ug6icxp9f2mtjmxbtons --nsFrom="buet68oyeprz5tlhcdvn.*" --nsTo="buet68oyeprz5tlhcdvn.*" --authenticationDatabase=buet68oyeprz5tlhcdvn --archive=YOUR_BACKUP_FILE --gzip',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-25T16:31:56.713Z'),
      expiresAt: new Date('2020-12-30T03:30:00.000Z'),
      url: 'https://ccbackups-mongodb-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mongodb_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'mongorestore --host=buet68oyeprz5tlhcdvn-mongodb.services.clever-cloud.com --port=1204 --username=ug6icxp9f2mtjmxbtons --nsFrom="buet68oyeprz5tlhcdvn.*" --nsTo="buet68oyeprz5tlhcdvn.*" --authenticationDatabase=buet68oyeprz5tlhcdvn --archive=YOUR_BACKUP_FILE --gzip',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-26T02:02:03.006Z'),
      expiresAt: new Date('2020-12-31T03:30:00.000Z'),
      url: 'https://ccbackups-mongodb-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mongodb_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: 'mongorestore --host=buet68oyeprz5tlhcdvn-mongodb.services.clever-cloud.com --port=1204 --username=ug6icxp9f2mtjmxbtons --nsFrom="buet68oyeprz5tlhcdvn.*" --nsTo="buet68oyeprz5tlhcdvn.*" --authenticationDatabase=buet68oyeprz5tlhcdvn --archive=YOUR_BACKUP_FILE --gzip',
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-27T16:31:56.713Z'),
      expiresAt: new Date('2021-01-01T03:30:00.000Z'),
      url: 'https://ccbackups-mongodb-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/mongodb_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: 'mongorestore --host=buet68oyeprz5tlhcdvn-mongodb.services.clever-cloud.com --port=1204 --username=ug6icxp9f2mtjmxbtons --nsFrom="buet68oyeprz5tlhcdvn.*" --nsTo="buet68oyeprz5tlhcdvn.*" --authenticationDatabase=buet68oyeprz5tlhcdvn --archive=YOUR_BACKUP_FILE --gzip',
      deleteCommand: null,
    },
  ],
};

/** @type {AddonBackupsStateLoaded} */
export const backupsRedisState = {
  type: 'loaded',
  providerId: 'redis-addon',
  passwordForCommand: 'password-for-command',
  backups: [
    {
      createdAt: new Date('2020-12-23T16:31:56.713Z'),
      expiresAt: new Date('2020-12-28T03:30:00.000Z'),
      url: 'https://ccbackups-redis-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/redis_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-24T02:02:03.006Z'),
      expiresAt: new Date('2020-12-29T03:30:00.000Z'),
      url: 'https://ccbackups-redis-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/redis_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-25T16:31:56.713Z'),
      expiresAt: new Date('2020-12-30T03:30:00.000Z'),
      url: 'https://ccbackups-redis-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/redis_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-26T02:02:03.006Z'),
      expiresAt: new Date('2020-12-31T03:30:00.000Z'),
      url: 'https://ccbackups-redis-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/redis_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-27T16:31:56.713Z'),
      expiresAt: new Date('2021-01-01T03:30:00.000Z'),
      url: 'https://ccbackups-redis-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/redis_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
  ],
};

/** @type {AddonBackupsStateLoaded} */
export const backupsJenkinsState = {
  type: 'loaded',
  providerId: 'jenkins',
  passwordForCommand: 'password-for-command',
  backups: [
    {
      createdAt: new Date('2020-12-23T16:31:56.713Z'),
      expiresAt: new Date('2020-12-28T03:30:00.000Z'),
      url: 'https://ccbackups-jenkins-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/jenkins_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-24T02:02:03.006Z'),
      expiresAt: new Date('2020-12-29T03:30:00.000Z'),
      url: 'https://ccbackups-jenkins-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/jenkins_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-25T16:31:56.713Z'),
      expiresAt: new Date('2020-12-30T03:30:00.000Z'),
      url: 'https://ccbackups-jenkins-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/jenkins_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-26T02:02:03.006Z'),
      expiresAt: new Date('2020-12-31T03:30:00.000Z'),
      url: 'https://ccbackups-jenkins-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/jenkins_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201224020203.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=%2B6nVsLAqg2H2P6w%2FHsKGprPOIto%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
    {
      createdAt: new Date('2020-12-27T16:31:56.713Z'),
      expiresAt: new Date('2021-01-01T03:30:00.000Z'),
      url: 'https://ccbackups-jenkins-6f2688c1-0b43-4434-a890-c4ce4dcc0986.cellar-c2.services.clever-cloud.com/jenkins_6f2688c1-0b43-4434-a890-c4ce4dcc0986-20201223163156.dump?AWSAccessKeyId=Y27YNLBXE7CIA8YCPJPP&Expires=1608836895&Signature=lXo6OYlwDpafH%2BPrgYVPtZnm%2FaM%3D',
      restoreCommand: null,
      deleteCommand: null,
    },
  ],
};

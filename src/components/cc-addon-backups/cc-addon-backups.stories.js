import './cc-addon-backups.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

const backupsNewElasticsearch = {
  providerId: 'es-addon',
  passwordForCommand: 'password-for-command',
  list: [
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
};

const backupsOldElasticsearch = {
  providerId: 'es-addon-old',
  restoreCommand: 'curl -XPOST https://my-old-service.services.clever-cloud.com/_snapshot/cc_backup_repository/snapshot_1/_restore',
  list: [
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

const backupsPostgresql = {
  providerId: 'postgresql-addon',
  passwordForCommand: 'password-for-command',
  list: [
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

const backupsMysql = {
  providerId: 'mysql-addon',
  passwordForCommand: 'password-for-command',
  list: [
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

const backupsMongodb = {
  providerId: 'mongodb-addon',
  passwordForCommand: 'password-for-command',
  list: [
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

const backupsRedis = {
  providerId: 'redis-addon',
  list: [
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

const backupsJenkins = {
  providerId: 'jenkins',
  list: [
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

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-backups>',
  component: 'cc-addon-backups',
};

const conf = {
  component: 'cc-addon-backups',
};

export const defaultStory = makeStory(conf, {
  items: [{ backups: backupsNewElasticsearch }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const empty = makeStory(conf, {
  items: [{ backups: { ...backupsNewElasticsearch, list: [] } }],
});

export const dataLoadedWithNewElasticsearch = makeStory(conf, {
  items: [{ backups: backupsNewElasticsearch }],
});

export const dataLoadedWithNewElasticsearchAndSmallList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsNewElasticsearch.providerId,
      list: backupsNewElasticsearch.list.slice(0, 1),
    },
  }],
});

export const dataLoadedWithOldElasticsearch = makeStory(conf, {
  items: [{ backups: backupsOldElasticsearch }],
});

export const dataLoadedWithOldElasticsearchAndBigList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsOldElasticsearch.providerId,
      list: [
        ...backupsOldElasticsearch.list,
        ...backupsOldElasticsearch.list,
        ...backupsOldElasticsearch.list,
        ...backupsOldElasticsearch.list,
      ],
    },
  }],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [{ backups: backupsPostgresql }],
});

export const dataLoadedWithPostgresqlAndBigList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsPostgresql.providerId,
      list: [
        ...backupsPostgresql.list,
        ...backupsPostgresql.list,
        ...backupsPostgresql.list,
        ...backupsPostgresql.list,
      ],
    },
  }],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [{ backups: backupsMysql }],
});

export const dataLoadedWithMysqlAndBigList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsMysql.providerId,
      list: [
        ...backupsMysql.list,
        ...backupsMysql.list,
        ...backupsMysql.list,
        ...backupsMysql.list,
      ],
    },
  }],
});

export const dataLoadedWithMongodb = makeStory(conf, {
  items: [{ backups: backupsMongodb }],
});

export const dataLoadedWithMongodbAndBigList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsMongodb.providerId,
      list: [
        ...backupsMongodb.list,
        ...backupsMongodb.list,
        ...backupsMongodb.list,
        ...backupsMongodb.list,
      ],
    },
  }],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [{ backups: backupsRedis }],
});

export const dataLoadedWithRedisAndBigList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsRedis.providerId,
      list: [
        ...backupsRedis.list,
        ...backupsRedis.list,
        ...backupsRedis.list,
        ...backupsRedis.list,
      ],
    },
  }],
});

export const dataLoadedWithJenkins = makeStory(conf, {
  items: [{ backups: backupsJenkins }],
});

export const dataLoadedWithJenkinsAndBigList = makeStory(conf, {
  items: [{
    backups: {
      providerId: backupsJenkins.providerId,
      list: [
        ...backupsJenkins.list,
        ...backupsJenkins.list,
        ...backupsJenkins.list,
        ...backupsJenkins.list,
      ],
    },
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentNone, componentError]) => {
      component.backups = backupsNewElasticsearch;
      componentNone.backups = { ...backupsNewElasticsearch, list: [] };
      componentError.error = true;
    }),
  ],
});

// Don't forget to import the component you're presenting!
import './cc-product-list.js';
import {
  iconRemixBox_3Line as appIcon,
  iconRemixDatabase_2Line as databaseIcon,
  iconRemixFolderLine as storageIcon,
  iconRemixArchiveDrawerLine as saasIcon,
  iconRemixMessage_2Line as messagingIcon,
} from '../../assets/cc-remix.icons.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Creation Tunnel/<cc-product-list>',
  component: 'cc-product-list',
};

const conf = {
  component: 'cc-product-list',
  css: `cc-product-list {
  }`,
};
const PRODUCTS = [
  {
    categoryName: 'Application',
    icon: appIcon,
    products: [
      {
        name: 'Docker',
        description: 'Docker is an easy, lightweight virtualized environment for portable applications.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/dockerblancbleu.svg',
        url: '',
        apiId: 'docker',
      },
      {
        name: '.NET core',
        description: 'Deploy your .NET core applications with automatic dependency management.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/06/dotnet-color.svg',
        url: '',
        apiId: 'dotnet',
      },
      {
        name: 'Elixir',
        description: 'Deploy your Elixir/Phoenix applications with automatic dependency management (via Mix).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/elixir.svg',
        url: '',
        apiId: 'elixir',
      },
      {
        name: 'Go',
        description: 'Deploy your Go applications with automatic dependency management (via go mod, go build...).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/go-2.svg',
        url: '',
        apiId: 'go',
      },
      {
        name: 'Haskell',
        description: 'Deploy your Haskell applications with automatic dependency management (via Stack).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/06/haskell.svg',
        url: '',
        apiId: 'haskell',
      },
      {
        name: 'JavaScript',
        description: 'Distributed, advanced, and high-performance messaging and event streaming system.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/nodejs.svg',
        url: '',
        apiId: 'node',
      },
      {
        name: 'PHP',
        description: 'Deploy your PHP applications and static sites on Apache2 + PHP-FPM with automatic dependency management (via composer).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/03/php-logo.svg',
        url: '',
        apiId: 'php',
      },
      {
        name: 'Python',
        description: 'Deploy your Python and Django applications on Nginx + WSGI with automatic dependency management (via pip) and Celery tasks support.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/python.svg',
        url: '',
        apiId: 'python',
      },
      {
        name: 'Ruby',
        description: 'Deploy your Ruby applications on Nginx + Puma with automatic dependency management (via Rake, gem...) and Sidekiq tasks support.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/ruby-2.svg',
        url: '',
        apiId: 'ruby',
      },
      {
        name: 'Rust',
        description: 'Deploy your Rust applications with automatic dependency management (via Cargo).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/rust-2.svg',
        url: '',
        apiId: 'rust',
      },
      {
        name: 'Static',
        description: 'Deploy your PHP applications and static sites on Apache2 + PHP-FPM with automatic dependency management (via composer).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/static-apache-3-1.svg',
        url: '',
        apiId: 'static-apache',
      },
      {
        name: 'Java jar',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
        url: '',
        apiId: 'jar',
      },
      {
        name: 'Java maven',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/maven.svg',
        url: '',
        apiId: 'maven',
      },
      {
        name: 'Java War',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/java-war.svg',
        url: '',
        apiId: 'war',
      },
      {
        name: 'Java Play 1',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/play1.svg',
        url: '',
        apiId: 'play1',
      },
      {
        name: 'Java or Scala + Play! 2',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/play2.svg',
        url: '',
        apiId: 'play2',
      },
      {
        name: 'Java or Groovy + Gradle',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/gradle.svg',
        url: '',
        apiId: 'gradle',
      },
      {
        name: 'Scala + SBT',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/scala.svg',
        url: '',
        apiId: 'sbt',
      },
    ],
  },
  {
    categoryName: 'Database',
    icon: databaseIcon,
    products: [
      {
        name: 'MongoDB',
        description: 'NoSQL document-oriented database, flexible, BSON format, supports horizontal scaling, ideal for modern applications.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/mongodb-3.svg',
        url: '',
        apiId: 'mongodb-addon',
      },
      {
        name: 'MySQL',
        description: 'MySQL is a widely used open-source relational database management system (RDBMS). Known for its simplicity and performance, MySQL supports SQL language, ACID transactions, and integrates seamlessly with various programming languages. It is often used in web applications, content management systems (CMS), and other solutions requiring a relational database.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/03/mysql-5.svg',
        url: '',
        apiId: 'mysql-addon',
      },
      {
        name: 'PostgreSQL',
        description: 'An open-source relational database management system (RDBMS). Known for its robustness, scalability, and SQL standards compliance, PostgreSQL supports advanced features such as ACID transactions, views, triggers, and stored procedures. It also offers complex data types, advanced indexing, and extensibility through various extensions. PostgreSQL is widely used in a variety of projects, from small to large-scale enterprise systems.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/pgsql.svg',
        url: '',
        apiId: 'postgresql-addon',
      },
      {
        name: 'Redis',
        description: 'In-memory, key-value database, fast and efficient, used for caching and real-time data management, offers advanced data structures.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/redis-clever-cloud-pricing.svg',
        url: '',
        apiId: 'redis-addon',
      },
      {
        name: 'Elastic Stack',
        description: 'Distributed, real-time search engine with flexible indexing, RESTful API, powerful aggregation, efficient log management, multilingual support',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/elastic.svg',
        url: '',
        apiId: 'es-addon',
      },
    ],
  },
  {
    categoryName: 'Storage',
    icon: storageIcon,
    products: [
      {
        name: 'Cellar S3 storage',
        description: 'Distributed object storage service compatible with the S3 protocol',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/cellar.svg',
        url: '',
        apiId: 'cellar-addon',
      },
      {
        name: 'FS Buckets',
        description: 'Persistent file system for your application',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
        url: '',
        apiId: 'fs-bucket',
      },
    ],
  },
  {
    categoryName: 'SaaS',
    icon: saasIcon,
    products: [
      {
        name: 'Jenkins',
        description: null,
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
        url: '',
        apiId: 'jenkins',
      },
      {
        name: 'Matomo Analytics',
        description: 'Open-source web analytics platform providing tracking and reporting features on website visitors with a focus on privacy. Self-hosted alternative to third-party analytics services',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
        url: '',
        apiId: 'addon-matomo',
      },
      {
        name: 'Heptapod',
        description: 'Heptapod is a Git project hosting platform with native integration to GitLab.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/09/heptapodblanc.svg',
        url: '',
        apiId: 'heptapod',
      },
    ],
  },
  {
    categoryName: 'Messaging',
    icon: messagingIcon,
    products: [
      {
        name: 'Pulsar',
        description: 'Distributed, advanced, and high-performance messaging and event streaming system.',
        keywords: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/pulsar.svg',
        url: '',
        apiId: 'addon-pulsar',
      },
    ],
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
    },
  ],
});

export const filterInput = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterInput: 'cellar',
    },
  ],
});

export const unrelevantFilterInput = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterInput: 'unrelevant',
    },
  ],
});

export const filterCategory = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterCategory: 'Storage',
    },
  ],
});

export const unrelevantFilterCategory = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterCategory: 'unrelevant',
    },
  ],
});
export const unrelevantFilterCategoryButRelevantInput = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterCategory: 'unrelevant',
      filterInput: 'sql',
    },
  ],
});

export const filterCategoryAndInput = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterCategory: 'Storage',
      filterInput: 'cellar',
    },
  ],
});

export const unrelevantFilterCategoryAndUnrelevantInput = makeStory(conf, {
  items: [
    {
      productsList: PRODUCTS,
      filterCategory: 'unrelevant',
      filterInput: 'unrelevant',
    },
  ],
});

// If your component contains remote data,
// you'll need a "skeleton screen" while the user's waiting for the data.
export const skeleton = makeStory(conf, {
  items: [{}],
});

// If your component contains remote data,
// don't forget the case where there is no data (ex: empty lists...).
export const empty = makeStory(conf, {
  items: [{ three: [] }],
});

// If your component contains remote data,
// don't forget the case where you have loading errors.
// If you have other kind of errors (ex: saving errors...).
// You need to name your stories with the `errorWith` prefix.
export const error = makeStory(conf, {
  items: [{ error: true }],
});

// If your component contains remote data,
// try to present all the possible data combination.
// You need to name your stories with the `dataLoadedWith` prefix.
// Don't forget edge cases (ex: small/huge strings, small/huge lists...).
export const dataLoadedWithFoo = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }] },
  ],
});

// If your component can trigger updates/deletes remote data,
// don't forget the case where the user's waiting for an operation to complete.
export const waiting = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }], waiting: true },
  ],
});

// If your component contains remote data,
// it will have several state transitions (ex: loading => error, loading => loaded, loaded => saving...).
// When transitioning from one state to another, we try to prevent the display from "jumping" or "blinking" too much.
// Using "simulations", you can simulate several steps in time to present how your component behaves when it goes through different states.
export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.three = [{ foo: 42 }];
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.three = [{ foo: 42 }, { foo: 43 }];
    }),
  ],
});

// This seems a bit cumbersome but to benefit from the automatic naming of stories (with emojis, casing...),
// you need to call `enhanceStoriesNames()` with all your stories.
enhanceStoriesNames({
  defaultStory,
  skeleton,
  empty,
  error,
  dataLoadedWithFoo,
  waiting,
  simulations,
});

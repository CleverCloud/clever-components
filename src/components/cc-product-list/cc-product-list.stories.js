import { makeStory } from '../../stories/lib/make-story.js';
import './cc-product-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-product-list>',
  component: 'cc-product-list',
};

const conf = {
  component: 'cc-product-list',
};

const PRODUCTS = [
  {
    categoryName: 'Applications',
    products: [
      {
        name: 'Node.js & Bun',
        description:
          'Deploy your JavaScript/TypeScript applications on Node.js or Bun with your favorite package manager',
        searchTerms: ['Bun', 'Deno', 'npm', 'pnpm', 'TypeScript', 'yarn'],
        iconUrl: 'https://assets.clever-cloud.com/logos/nodejs.svg',
        url: '',
        apiId: 'node',
      },
      {
        name: 'PHP with Apache',
        description:
          'Deploy your applications on Apache2 + PHP-FPM with automatic dependency management (via Composer)',
        searchTerms: ['FrankenPHP', 'Laravel', 'PHAR', 'Symfony'],
        iconUrl: 'https://assets.clever-cloud.com/logos/php.svg',
        url: '',
        apiId: 'php',
      },
      {
        name: 'Python',
        description:
          'Deploy your Python and Django applications with automatic dependency management (via pip or uv) and Celery tasks support',
        searchTerms: ['🐍', 'Flask', 'Django', 'FastAPI', 'Pyramid', 'Streamlit', 'uv'],
        iconUrl: 'https://assets.clever-cloud.com/logos/python.svg',
        url: '',
        apiId: 'python',
      },
      {
        name: 'Static',
        description:
          'Deploy your static website with automatic build for Astro, Docusaurus, Hugo, mdBook, MkDocs, Nuxt.js, Storybook, Vitepress, Zola',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/static.svg',
        url: '',
        apiId: 'static',
      },
      {
        name: 'Linux',
        description: 'Deploy any kind of applications, with automatic dependency management (via Mise)',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/linux.svg',
        url: '',
        apiId: 'linux',
      },
      {
        name: 'FrankenPHP',
        description: 'Deploy your PHP applications on FrankenPHP with automatic dependency management (via Composer)',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/frankenphp.svg',
        url: '',
        apiId: 'frankenphp',
      },
      {
        name: 'Go',
        description:
          'Deploy your Go applications with automatic dependency management (via go install, Makefile, etc.)',
        searchTerms: ['Google'],
        iconUrl: 'https://assets.clever-cloud.com/logos/go.svg',
        url: '',
        apiId: 'go',
      },
      {
        name: 'V (Vlang)',
        description: 'Deploy your V applications with automatic build and dependency management',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/v.svg',
        url: '',
        apiId: 'v',
      },
      {
        name: '.NET core',
        description: 'Deploy your .NET core applications with automatic dependency management',
        searchTerms: ['dotnet', 'Microsoft'],
        iconUrl: 'https://assets.clever-cloud.com/logos/dotnet.svg',
        url: '',
        apiId: 'dotnet',
      },
      {
        name: 'Ruby',
        description:
          'Deploy your applications on Nginx + Puma with automatic dependency management (via Rake, gem...) and Sidekiq',
        searchTerms: ['💎', 'On Rails'],
        iconUrl: 'https://assets.clever-cloud.com/logos/ruby.svg',
        url: '',
        apiId: 'ruby',
      },
      {
        name: 'Rust',
        description: 'Deploy your applications with automatic dependency management (via Cargo)',
        searchTerms: ['🦀', 'Ferris'],
        iconUrl: 'https://assets.clever-cloud.com/logos/rust.svg',
        url: '',
        apiId: 'rust',
      },
      {
        name: 'Scala + SBT',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant, etc.)',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/scala.svg',
        url: '',
        apiId: 'sbt',
      },
      {
        name: 'Java JAR',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...)',
        searchTerms: ['☕'],
        iconUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
        url: '',
        apiId: 'jar',
      },
      {
        name: 'Java Maven',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...)',
        searchTerms: ['☕'],
        iconUrl: 'https://assets.clever-cloud.com/logos/maven.svg',
        url: '',
        apiId: 'maven',
      },
      {
        name: 'Java/Groovy + Gradle',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant, etc.)',
        searchTerms: ['☕'],
        iconUrl: 'https://assets.clever-cloud.com/logos/gradle.svg',
        url: '',
        apiId: 'gradle',
      },
      {
        name: 'Java War',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...)',
        searchTerms: ['☕'],
        iconUrl: 'https://assets.clever-cloud.com/logos/java-war.svg',
        url: '',
        apiId: 'war',
      },
      {
        name: 'Java Play 1',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant, etc.)',
        searchTerms: ['☕'],
        iconUrl: 'https://assets.clever-cloud.com/logos/play1.svg',
        url: '',
        apiId: 'play1',
      },
      {
        name: 'Java/Scala + Play! 2',
        description:
          'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...)',
        searchTerms: ['☕'],
        iconUrl: 'https://assets.clever-cloud.com/logos/play2.svg',
        url: '',
        apiId: 'play2',
      },
      {
        name: 'Meteor',
        description: 'Deploy your applications on Node.js using the Meteor framework',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/meteor.svg',
        url: '',
        apiId: 'meteor',
      },
      {
        name: 'Erlang - Elixir',
        description:
          'Deploy your Erlang applications with Elixir/Phoenix and automatic dependency management (via Mix)',
        searchTerms: ['BEAM', 'Functional'],
        iconUrl: 'https://assets.clever-cloud.com/logos/elixir.svg',
        url: '',
        apiId: 'elixir',
      },
      {
        name: 'Haskell',
        description: 'Deploy your applications with automatic dependency management (via Stack)',
        searchTerms: ['Functional', 'GHC'],
        iconUrl: 'https://assets.clever-cloud.com/logos/haskell.svg',
        url: '',
        apiId: 'haskell',
      },
      {
        name: 'Static with Apache',
        description: 'Build and deploy websites with the static generator of your choice on Apache2',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/apache.svg',
        url: '',
        apiId: 'static-apache',
      },
    ],
    icon: {
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM20 12L16.4645 15.5355L15.0503 14.1213L17.1716 12L15.0503 9.87868L16.4645 8.46447L20 12ZM6.82843 12L8.94975 14.1213L7.53553 15.5355L4 12L7.53553 8.46447L8.94975 9.87868L6.82843 12ZM11.2443 17H9.11597L12.7557 7H14.884L11.2443 17Z"></path></svg>',
    },
  },
  {
    categoryName: 'Containers',
    products: [
      {
        name: 'Docker',
        description: 'Deploy applications from Dockerfile and take advantage of the Docker ecosystem',
        searchTerms: ['containers'],
        iconUrl: 'https://assets.clever-cloud.com/logos/docker.svg',
        url: '',
        apiId: 'docker',
      },
    ],
    icon: {
      content:
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zM5.494 7.078L12 10.844l6.506-3.766L12 3.31 5.494 7.078zM4.5 8.813v7.534L11 20.11v-7.534L4.5 8.813zM13 20.11l6.5-3.763V8.813L13 12.576v7.534z"/></svg>',
    },
  },
  {
    categoryName: 'Databases',
    products: [
      {
        name: 'Materia KV',
        description: 'Serverless & highly distributed key-value database, compatible with Redis protocol',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/materia-db-kv.png',
        url: '',
        apiId: 'kv',
        productStatus: 'Beta',
      },
      {
        name: 'PostgreSQL',
        description:
          'Object-relational database management system (ORDBMS), known for its robustness, scalability, and SQL standards compliance',
        searchTerms: ['🐘'],
        iconUrl: 'https://assets.clever-cloud.com/logos/pgsql.svg',
        url: '',
        apiId: 'postgresql-addon',
      },
      {
        name: 'MySQL',
        description:
          'Relational database management system (RDBMS), known for its robustness, scalability, and SQL standards compliance',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/mysql.svg',
        url: '',
        apiId: 'mysql-addon',
      },
      {
        name: 'Redis',
        description: 'In-memory, key-value database, used for caching and real-time data management',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/redis.svg',
        url: '',
        apiId: 'redis-addon',
      },
      {
        name: 'Elastic Stack Platinum',
        description: 'Search engine, log management, and data visualization with Kibana and APM server as options',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/elastic.svg',
        url: '',
        apiId: 'es-addon',
      },
      {
        name: 'MongoDB',
        description: 'NoSQL document-oriented database, flexible, using BSON format',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/mongodb.svg',
        url: '',
        apiId: 'mongodb-addon',
      },
    ],
    icon: {
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12.5C5 12.8134 5.46101 13.3584 6.53047 13.8931C7.91405 14.5849 9.87677 15 12 15C14.1232 15 16.0859 14.5849 17.4695 13.8931C18.539 13.3584 19 12.8134 19 12.5V10.3287C17.35 11.3482 14.8273 12 12 12C9.17273 12 6.64996 11.3482 5 10.3287V12.5ZM19 15.3287C17.35 16.3482 14.8273 17 12 17C9.17273 17 6.64996 16.3482 5 15.3287V17.5C5 17.8134 5.46101 18.3584 6.53047 18.8931C7.91405 19.5849 9.87677 20 12 20C14.1232 20 16.0859 19.5849 17.4695 18.8931C18.539 18.3584 19 17.8134 19 17.5V15.3287ZM3 17.5V7.5C3 5.01472 7.02944 3 12 3C16.9706 3 21 5.01472 21 7.5V17.5C21 19.9853 16.9706 22 12 22C7.02944 22 3 19.9853 3 17.5ZM12 10C14.1232 10 16.0859 9.58492 17.4695 8.89313C18.539 8.3584 19 7.81342 19 7.5C19 7.18658 18.539 6.6416 17.4695 6.10687C16.0859 5.41508 14.1232 5 12 5C9.87677 5 7.91405 5.41508 6.53047 6.10687C5.46101 6.6416 5 7.18658 5 7.5C5 7.81342 5.46101 8.3584 6.53047 8.89313C7.91405 9.58492 9.87677 10 12 10Z"></path></svg>',
    },
  },
  {
    categoryName: 'Storage & Messaging',
    products: [
      {
        name: 'Cellar S3 storage',
        description:
          'Distributed object storage service, replicated over 3 datacenters, compatible with the S3 protocol',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/cellar.svg',
        url: '',
        apiId: 'cellar-addon',
      },
      {
        name: 'FS Buckets',
        description: 'Persistent file system for your application',
        searchTerms: ['Folder', 'Mount'],
        iconUrl: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
        url: '',
        apiId: 'fs-bucket',
      },
      {
        name: 'Pulsar',
        description: 'Distributed, advanced, and high-performance messaging and event streaming system',
        searchTerms: ['Apache'],
        iconUrl: 'https://assets.clever-cloud.com/logos/pulsar.svg',
        url: '',
        apiId: 'addon-pulsar',
      },
    ],
    icon: {
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 10.9381C8.61872 10.4869 11.4869 7.61872 11.9381 4H5V10.9381ZM5 12.9506V20H19V4H13.9506C13.4816 8.72442 9.72442 12.4816 5 12.9506ZM4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2ZM15 16H17V18H15V16Z"></path></svg>',
    },
  },
  {
    categoryName: 'Services',
    products: [
      {
        name: 'Keycloak',
        description:
          'Identity and access management solution, providing single sign-on, user federation and high-availability, by Please Open It',
        searchTerms: ['Network groups', 'Tech Preview'],
        iconUrl: 'https://assets.clever-cloud.com/logos/keycloak.svg',
        url: '',
        apiId: 'keycloak',
      },
      {
        name: 'Metabase',
        description: 'An easy business intelligence tool to query and visualize data',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/metabase.svg',
        url: '',
        apiId: 'metabase',
      },
      {
        name: 'Matomo Analytics',
        description: 'Web analytics platform that gives you insights on your visitors, GDPR ready',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
        url: '',
        apiId: 'addon-matomo',
      },
      {
        name: 'Otoroshi with LLM',
        description: 'Simple API management based on a modern reverse proxy',
        searchTerms: [],
        iconUrl: 'https://maif.github.io/otoroshi/manual/imgs/bw-otoroshi-logo.png',
        url: '',
        apiId: 'otoroshi',
      },
      {
        name: 'Jenkins',
        description:
          'Automation server, for all sorts of tasks related to building, testing, and delivering or deploying software',
        searchTerms: ['CI/CD'],
        iconUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
        url: '',
        apiId: 'jenkins',
      },
    ],
    icon: {
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 2.9918C3 2.44405 3.44495 2 3.9934 2H20.0066C20.5552 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM19 11V4H5V11H19ZM19 13H5V20H19V13ZM9 6H15V8H9V6ZM9 15H15V17H9V15Z"></path></svg>',
    },
  },
  {
    categoryName: 'Third-party products',
    products: [
      {
        name: 'Azimutt',
        description: 'Database explorer: understand and document it seamlessly',
        searchTerms: [],
        iconUrl: 'https://avatars.githubusercontent.com/u/89384563?s=400&u=5cca437e789595db969182bed62e50ff88b1a700',
        url: '',
        apiId: 'azimutt',
      },
      {
        name: 'Mailpace',
        description: 'Send transactional emails from your applications in an easy way',
        searchTerms: ['SMTP'],
        iconUrl: 'https://docs.mailpace.com/img/logo.png',
        url: '',
        apiId: 'mailpace',
      },
    ],
    icon: {
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 706.1 834.475" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd"><defs><style type="text/css">.fil0 {fill:black;fill-rule:nonzero}</style></defs><g><path class="fil0" d="M353.05 0c69.01,0 124.97,55.95 124.97,124.97 0,60.82 -43.88,112.89 -103.68,123.15l0 89.24 138.47 100.6c19.64,-12.85 43.11,-20.32 68.32,-20.32 69.01,0 124.97,55.96 124.97,124.97 0,69.01 -55.96,124.97 -124.97,124.97 -69.01,0 -124.97,-55.96 -124.97,-124.97 0,-28.16 9.32,-54.15 25.04,-75.05l-128.15 -93.11 -128.15 93.11c15.72,20.9 25.04,46.89 25.04,75.05 0,69.01 -55.96,124.97 -124.97,124.97 -69.01,0 -124.97,-55.96 -124.97,-124.97 0,-69.01 55.96,-124.97 124.97,-124.97 25.21,0 48.69,7.47 68.32,20.32l138.46 -100.6 0 -89.24c-59.79,-10.26 -103.67,-62.33 -103.67,-123.15 0,-69.02 55.96,-124.97 124.97,-124.97zm0.37 208.13c34.59,0 82.01,-31.94 82.01,-83.16 0,-45.5 -36.88,-82.38 -82.38,-82.38 -45.5,0 -82.38,36.88 -82.38,82.38 0,51.89 42.51,83.16 82.75,83.16zm-228.45 252.1c-45.5,0 -82.38,36.88 -82.38,82.38 0,45.5 36.88,82.38 82.38,82.38 45.5,0 82.38,-36.88 82.38,-82.38 0,-45.5 -36.88,-82.38 -82.38,-82.38zm456.16 0c-45.5,0 -82.38,36.88 -82.38,82.38 0,45.5 36.88,82.38 82.38,82.38 45.5,0 82.38,-36.88 82.38,-82.38 0,-45.5 -36.88,-82.38 -82.38,-82.38z"/></g></svg>',
    },
  },
  {
    categoryName: 'Tools',
    products: [
      {
        name: 'Configuration Provider',
        description: 'Share environment variables between your applications',
        searchTerms: [],
        iconUrl: 'https://assets.clever-cloud.com/logos/configprovider.svg',
        url: '',
        apiId: 'config-provider',
      },
    ],
    icon: {
      content:
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 32 32" fill="currentColor"><path d="M29.532 25.76l-5.655-5.655 0.754-0.754-0.754-0.754-2.261 2.261-3.771-3.77 4.53-4.532c0.603 0.215 1.234 0.324 1.882 0.324 1.493 0 2.897-0.582 3.954-1.637 1.63-1.631 2.092-4.054 1.178-6.174l-0.311-0.722-2.43 2.43-1.956 0.027 0.026-1.866 2.477-2.477-0.72-0.312c-0.706-0.306-1.457-0.461-2.229-0.461-1.494 0-2.897 0.582-3.952 1.637-1.546 1.545-2.043 3.802-1.311 5.84l-4.529 4.529-6.409-6.408 0.754-0.754-4.145-4.146-2.264 2.261 4.147 4.147 0.753-0.754 6.409 6.408-4.529 4.529c-0.605-0.217-1.239-0.326-1.888-0.326-1.493 0-2.897 0.582-3.953 1.637-1.633 1.632-2.095 4.059-1.176 6.181l0.312 0.72 2.477-2.477 1.865-0.025-0.027 1.956-2.43 2.43 0.722 0.311c0.704 0.303 1.452 0.458 2.221 0.458 1.494 0 2.897-0.581 3.952-1.636 1.544-1.544 2.041-3.799 1.314-5.833l4.532-4.532 3.771 3.769-2.263 2.263 0.754 0.754 0.754-0.754 5.654 5.654c0.503 0.504 1.174 0.781 1.885 0.781s1.381-0.277 1.885-0.781c1.039-1.039 1.039-2.73-0-3.769zM3.899 4.648l0.754-0.753 2.638 2.638-0.754 0.754-2.639-2.639zM11.448 22.456c0.739 1.716 0.364 3.679-0.955 4.999-0.854 0.854-1.989 1.324-3.198 1.324-0.347 0-0.689-0.039-1.021-0.116l1.569-1.569 0.047-3.485-3.394 0.046-1.619 1.619c-0.356-1.51 0.081-3.103 1.208-4.229 0.854-0.854 1.99-1.325 3.199-1.325 0.626 0 1.233 0.125 1.806 0.373l0.333 0.144 10.819-10.819-0.144-0.333c-0.744-1.719-0.37-3.682 0.952-5.004 0.854-0.854 1.99-1.325 3.198-1.325 0.35 0 0.695 0.040 1.030 0.117l-1.618 1.618-0.047 3.394 3.485-0.047 1.57-1.57c0.352 1.507-0.086 3.097-1.209 4.221-0.855 0.854-1.991 1.325-3.2 1.325-0.624 0-1.23-0.125-1.801-0.371l-0.332-0.143-10.821 10.823 0.143 0.332zM28.779 28.775c-0.302 0.302-0.704 0.469-1.131 0.469s-0.829-0.167-1.131-0.469l-5.654-5.654 2.262-2.262 5.655 5.655c0.624 0.624 0.624 1.638 0.001 2.261z"></path></svg>',
    },
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
    },
  ],
});

export const textFilter = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      textFilter: 'cellar',
    },
  ],
});

export const irrelevantTextFilter = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      textFilter: 'irrelevant',
    },
  ],
});

export const categoryFilter = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      categoryFilter: 'Storage & Messaging',
    },
  ],
});

export const irrelevantCategoryFilter = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      categoryFilter: 'irrelevant',
    },
  ],
});
export const irrelevantCategoryFilterButRelevantInput = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      categoryFilter: 'irrelevant',
      textFilter: 'sql',
    },
  ],
});

export const categoryFilterAndInput = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      categoryFilter: 'Storage & Messaging',
      textFilter: 'cellar',
    },
  ],
});

export const irrelevantCategoryFilterAndIrrelevantInput = makeStory(conf, {
  items: [
    {
      productsByCategories: PRODUCTS,
      categoryFilter: 'irrelevant',
      textFilter: 'irrelevant',
    },
  ],
});

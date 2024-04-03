import './cc-product-list.js';
import { makeStory } from '../../stories/lib/make-story.js';

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
        name: 'JavaScript',
        description: 'Deploy your JavaScript/TypeScript and Meteor applications on Node.js with automatic dependency management (via npm ou yarn).',
        keywords: [
          {
            value: 'Node.js',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/nodejs.svg',
        url: '',
        apiId: 'node',
      },
      {
        name: 'PHP',
        description: 'Deploy your PHP applications and static sites on Apache2 + PHP-FPM with automatic dependency management (via composer).',
        keywords: [
          {
            value: 'Web',
            hidden: false,
          },
          {
            value: 'Symfony',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/03/php-4.svg',
        url: '',
        apiId: 'php',
      },
      {
        name: 'Python',
        description: 'Deploy your Python and Django applications on Nginx + WSGI with automatic dependency management (via pip) and Celery tasks support.',
        keywords: [
          {
            value: 'Flask',
            hidden: false,
          },
          {
            value: 'Django',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/python.svg',
        url: '',
        apiId: 'python',
      },
      {
        name: 'Ruby',
        description: 'Deploy your Ruby applications on Nginx + Puma with automatic dependency management (via Rake, gem...) and Sidekiq tasks support.',
        keywords: [
          {
            value: 'On Rails',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/ruby-2.svg',
        url: '',
        apiId: 'ruby',
      },
      {
        name: 'Go',
        description: 'Deploy your Go applications with automatic dependency management (via go mod, go build...).',
        keywords: [
          {
            value: 'Google',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/go-2.svg',
        url: '',
        apiId: 'go',
      },
      {
        name: 'Static',
        description: 'Deploy your PHP applications and static sites on Apache2 + PHP-FPM with automatic dependency management (via composer).',
        keywords: [
          {
            value: 'Apache',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/static-apache-3-1.svg',
        url: '',
        apiId: 'static-apache',
      },
      {
        name: 'Rust',
        description: 'Deploy your Rust applications with automatic dependency management (via Cargo).',
        keywords: [
          {
            value: 'Low level',
            hidden: false,
          },
          {
            value: 'crab',
            hidden: true,
          },
          {
            value: '🦀',
            hidden: true,
          },
          {
            value: 'Ferris',
            hidden: true,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/rust-2.svg',
        url: '',
        apiId: 'rust',
      },
      {
        name: 'Scala + SBT',
        description: 'Deploy your JVM based applications (Java, Scala, GraalVM...) with automatic build and dependency management (Maven, Gradle, SBT, Ant...).',
        keywords: [
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/scala.svg',
        url: '',
        apiId: 'sbt',
      },
      {
        name: 'Java Jar',
        description: 'Deploy and run any Java ARchive file with automatic build. Some configuration files or environment variable are needed to specify the the JAR path.',
        keywords: [
          {
            value: '☕',
            hidden: true,
          },
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
        url: '',
        apiId: 'jar',
      },
      {
        name: 'Java maven',
        description: 'Deploy your yur Java Maven projects with automatic build and dependency management. Some configuration files or environment variable are needed.',
        keywords: [
          {
            value: 'Java',
            hidden: false,
          },
          {
            value: '☕',
            hidden: true,
          },
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/maven.svg',
        url: '',
        apiId: 'maven',
      },
      {
        name: 'Java War',
        description: 'Deploy and run your JEE applications packaged as WAR or EAR with the container you want (Tomcat, Jetty, Glassfish, JBoss, Paraya…).',
        keywords: [
          {
            value: '☕',
            hidden: true,
          },
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/java-war.svg',
        url: '',
        apiId: 'war',
      },
      {
        name: 'Play Framework 1',
        description: 'Deploy your Java application with Play framework in version 1. Play framework’s goal is to ease development while sticking with Java.',
        keywords: [
          {
            value: 'Java',
            hidden: false,
          },
          {
            value: '☕',
            hidden: true,
          },
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/play1.svg',
        url: '',
        apiId: 'play1',
      },
      {
        name: 'Play Framework 2',
        description: 'Deploy your based applications with Play 2.0, a Java and Scala framework that integrates the components and APIs you need for modern development.',
        keywords: [
          {
            value: 'Java',
            hidden: false,
          },
          {
            value: 'Scala',
            hidden: false,
          },
          {
            value: '☕',
            hidden: true,
          },
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/play2.svg',
        url: '',
        apiId: 'play2',
      },
      {
        name: 'Groovy + Gradle',
        description: 'Deploy your JVM based applications with Gradle, a project automation tool that builds upon the concepts of Apache Ant and Apache Maven.',
        keywords: [
          {
            value: 'Java',
            hidden: false,
          },
          {
            value: '☕',
            hidden: true,
          },
          {
            value: 'JVM',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/gradle.svg',
        url: '',
        apiId: 'gradle',
      },
      {
        name: '.NET core',
        description: 'Deploy your .NET core applications with automatic dependency management.',
        keywords: [
          {
            value: 'Microsoft',
            hidden: false,
          },
          {
            value: 'Web',
            hidden: false,
          },
          {
            value: 'Microservices',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/06/dotnet-color.svg',
        url: '',
        apiId: 'dotnet',
      },
      {
        name: 'Elixir',
        description: 'Deploy your Elixir/Phoenix applications with automatic dependency management (via Mix).',
        keywords: [
          {
            value: 'Functional',
            hidden: false,
          },
          {
            value: 'Erlang',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/elixir.svg',
        url: '',
        apiId: 'elixir',
      },
      {
        name: 'Haskell',
        description: 'Deploy your Haskell applications with automatic dependency management (via Stack).',
        keywords: [
          {
            value: 'Functional',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/06/haskell.svg',
        url: '',
        apiId: 'haskell',
      },
      {
        name: 'Meteor',
        description: 'Deploy your JavaScript/TypeScript and Meteor applications on Node.js with automatic dependency management (via npm ou yarn).',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/static-apache-3-1.svg',
        url: '',
        apiId: 'meteor',
      },
    ],
    icon: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM20 12L16.4645 15.5355L15.0503 14.1213L17.1716 12L15.0503 9.87868L16.4645 8.46447L20 12ZM6.82843 12L8.94975 14.1213L7.53553 15.5355L4 12L7.53553 8.46447L8.94975 9.87868L6.82843 12ZM11.2443 17H9.11597L12.7557 7H14.884L11.2443 17Z"></path></svg>',
    },
  },
  {
    categoryName: 'Container',
    products: [
      {
        name: 'Docker',
        description: 'Deploy your applications in Docker: an easy and lightweight environment. Docker applications are run inside a virtual machine for higher security.',
        keywords: [],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/dockerblancbleu.svg',
        url: '',
        apiId: 'docker',
      },
    ],
    icon: {
      content: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zM5.494 7.078L12 10.844l6.506-3.766L12 3.31 5.494 7.078zM4.5 8.813v7.534L11 20.11v-7.534L4.5 8.813zM13 20.11l6.5-3.763V8.813L13 12.576v7.534z"/></svg>',
    },
  },
  {
    categoryName: 'Databases',
    products: [
      {
        name: 'MongoDB',
        description: 'Start a MongoDB database: a NoSQL document-oriented database, flexible, BSON format, supports horizontal scaling, ideal for modern applications.',
        keywords: [
          {
            value: 'Document',
            hidden: false,
          },
          {
            value: 'Distributed',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/mongodb-3.svg',
        url: '',
        apiId: 'mongodb-addon',
      },
      {
        name: 'MySQL',
        description: 'Deploy a MySQL database, the open-source relational database. It supports SQL , ACID transactions, and integrates with various programming languages.',
        keywords: [
          {
            value: 'SQL',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/03/mysql-5.svg',
        url: '',
        apiId: 'mysql-addon',
      },
      {
        name: 'PostgreSQL',
        description: 'Deploy a PostgreSQL database. It supports features such as SQL, ACID transactions, views, triggers, and stored procedures.',
        keywords: [
          {
            value: 'SQL',
            hidden: false,
          },
          {
            value: '🐘',
            hidden: true,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/pgsql.svg',
        url: '',
        apiId: 'postgresql-addon',
      },
      {
        name: 'Redis',
        description: 'Deploy a Redis database : in-memory, key-value database, fast and efficient, used for caching and real-time data management, offers advanced data structures.',
        keywords: [
          {
            value: 'key-value',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/redis-clever-cloud-pricing.svg',
        url: '',
        apiId: 'redis-addon',
      },
      {
        name: 'Elastic Stack',
        description: 'Start an Elasticsearch, a distributed, real-time search engine with flexible indexing, RESTful API, powerful aggregation and multilingual support.',
        keywords: [
          {
            value: 'Full Text',
            hidden: false,
          },
          {
            value: 'APM',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/elastic.svg',
        url: '',
        apiId: 'es-addon',
      },
    ],
    icon: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12.5C5 12.8134 5.46101 13.3584 6.53047 13.8931C7.91405 14.5849 9.87677 15 12 15C14.1232 15 16.0859 14.5849 17.4695 13.8931C18.539 13.3584 19 12.8134 19 12.5V10.3287C17.35 11.3482 14.8273 12 12 12C9.17273 12 6.64996 11.3482 5 10.3287V12.5ZM19 15.3287C17.35 16.3482 14.8273 17 12 17C9.17273 17 6.64996 16.3482 5 15.3287V17.5C5 17.8134 5.46101 18.3584 6.53047 18.8931C7.91405 19.5849 9.87677 20 12 20C14.1232 20 16.0859 19.5849 17.4695 18.8931C18.539 18.3584 19 17.8134 19 17.5V15.3287ZM3 17.5V7.5C3 5.01472 7.02944 3 12 3C16.9706 3 21 5.01472 21 7.5V17.5C21 19.9853 16.9706 22 12 22C7.02944 22 3 19.9853 3 17.5ZM12 10C14.1232 10 16.0859 9.58492 17.4695 8.89313C18.539 8.3584 19 7.81342 19 7.5C19 7.18658 18.539 6.6416 17.4695 6.10687C16.0859 5.41508 14.1232 5 12 5C9.87677 5 7.91405 5.41508 6.53047 6.10687C5.46101 6.6416 5 7.18658 5 7.5C5 7.81342 5.46101 8.3584 6.53047 8.89313C7.91405 9.58492 9.87677 10 12 10Z"></path></svg>',
    },
  },
  {
    categoryName: 'Storage & Messaging',
    products: [
      {
        name: 'Cellar Object storage',
        description: 'Create one or several Cellar buckets, a distributed object storage service, compatible with the AWS S3 protocol (signature V4) to store and persist files.',
        keywords: [
          {
            value: 'S3',
            hidden: false,
          },
          {
            value: 'Distributed',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/cellar.svg',
        url: '',
        apiId: 'cellar-addon',
      },
      {
        name: 'FS Buckets',
        description: 'Mount a FS Bucket to persist files within an application folder. It is compatible with SFTP and comes with a GUI for manipulating files.',
        keywords: [
          {
            value: 'FTP',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
        url: '',
        apiId: 'fs-bucket',
      },
    ],
    icon: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 10.9381C8.61872 10.4869 11.4869 7.61872 11.9381 4H5V10.9381ZM5 12.9506V20H19V4H13.9506C13.4816 8.72442 9.72442 12.4816 5 12.9506ZM4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2ZM15 16H17V18H15V16Z"></path></svg>',
    },
  },
  {
    categoryName: 'Services',
    products: [
      {
        name: 'Jenkins',
        description: 'Start a Jenkins server, automating software build, test, and deployment. Flexible integration with various tools through plugins',
        keywords: [
          {
            value: 'CI/CD',
            hidden: false,
          },
          {
            value: 'Runners',
            hidden: false,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
        url: '',
        apiId: 'jenkins',
      },
      {
        name: 'Matomo Analytics',
        description: 'Start the components for a pre-built Matomo: the open-source web analytics platform providing tracking and reporting features on website visitors.',
        keywords: [
          {
            value: 'Statistics',
            hidden: false,
          },
          {
            value: 'Reporting',
            hidden: true,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
        url: '',
        apiId: 'addon-matomo',
      },
      {
        name: 'Heptapod',
        description: 'Access to Heptapod Cloud, a SaaS DevOps platform. This software forge is a fork of GitLab Community Edition, with support for Git and Mercurial.',
        keywords: [
          {
            value: 'CI/CD',
            hidden: false,
          },
          {
            value: 'Runners',
            hidden: false,
          },
        ],
        iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/09/heptapodblanc-1-1.svg',
        url: '',
        apiId: 'heptapod',
      },
    ],
    icon: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 2.9918C3 2.44405 3.44495 2 3.9934 2H20.0066C20.5552 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM19 11V4H5V11H19ZM19 13H5V20H19V13ZM9 6H15V8H9V6ZM9 15H15V17H9V15Z"></path></svg>',
    },
  },
  {
    categoryName: 'Messaging',
    products: [
      {
        name: 'Pulsar',
        description: 'Create a Pulsar topic, an open-source, distributed messaging and streaming platform, built on the publish-subscribe pattern.',
        keywords: [
          {
            value: 'Distributed',
            hidden: false,
          },
          {
            value: 'Messaging',
            hidden: false,
          },
          {
            value: 'Streaming',
            hidden: false,
          },
          {
            value: 'pub/sub',
            hidden: true,
          },
          {
            value: 'topic',
            hidden: true,
          },
        ],
        iconUrl: 'https://assets.clever-cloud.com/logos/pulsar.svg',
        url: '',
        apiId: 'addon-pulsar',
      },
    ],
    icon: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path></svg>',
    },
  },
  {
    categoryName: 'Third Party',
    products: [
      {
        name: 'MailPace',
        description: 'Create a MailPace account to sent e-mails via HTTPS API, SMTP and several libraries, removing the need for any email setup or active email management.',
        keywords: [],
        iconUrl: 'https://docs.mailpace.com/img/logo.png',
        url: '',
        apiId: 'mailpace',
      },
    ],
    icon: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 706.1 834.475" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd"><defs><style type="text/css">.fil0 {fill:black;fill-rule:nonzero}</style></defs><g><path class="fil0" d="M353.05 0c69.01,0 124.97,55.95 124.97,124.97 0,60.82 -43.88,112.89 -103.68,123.15l0 89.24 138.47 100.6c19.64,-12.85 43.11,-20.32 68.32,-20.32 69.01,0 124.97,55.96 124.97,124.97 0,69.01 -55.96,124.97 -124.97,124.97 -69.01,0 -124.97,-55.96 -124.97,-124.97 0,-28.16 9.32,-54.15 25.04,-75.05l-128.15 -93.11 -128.15 93.11c15.72,20.9 25.04,46.89 25.04,75.05 0,69.01 -55.96,124.97 -124.97,124.97 -69.01,0 -124.97,-55.96 -124.97,-124.97 0,-69.01 55.96,-124.97 124.97,-124.97 25.21,0 48.69,7.47 68.32,20.32l138.46 -100.6 0 -89.24c-59.79,-10.26 -103.67,-62.33 -103.67,-123.15 0,-69.02 55.96,-124.97 124.97,-124.97zm0.37 208.13c34.59,0 82.01,-31.94 82.01,-83.16 0,-45.5 -36.88,-82.38 -82.38,-82.38 -45.5,0 -82.38,36.88 -82.38,82.38 0,51.89 42.51,83.16 82.75,83.16zm-228.45 252.1c-45.5,0 -82.38,36.88 -82.38,82.38 0,45.5 36.88,82.38 82.38,82.38 45.5,0 82.38,-36.88 82.38,-82.38 0,-45.5 -36.88,-82.38 -82.38,-82.38zm456.16 0c-45.5,0 -82.38,36.88 -82.38,82.38 0,45.5 36.88,82.38 82.38,82.38 45.5,0 82.38,-36.88 82.38,-82.38 0,-45.5 -36.88,-82.38 -82.38,-82.38z"/></g></svg>',
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

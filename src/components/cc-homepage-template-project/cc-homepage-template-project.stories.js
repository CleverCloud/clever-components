import { makeStory } from '../../stories/lib/make-story.js';
import './cc-homepage-template-project.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-homepage-template-project>',
  component: 'cc-homepage-template-project',
};

const conf = {
  component: 'cc-homepage-template-project',
};

/**
 * @import { HomepageTemplateProjectStateLoaded, HomepageTemplateProjectStateLoading, HomepageTemplateProjectStateError, TemplateProject } from './cc-homepage-template-project.types.js'
 */

/** @type {TemplateProject[]} */
const PROJECTS_ITEMS = [
  {
    name: 'python-django-uv-example',
    description: 'A Django application template using uv as package manager',
    href: 'https://github.com/CleverCloud/python-django-uv-example',
  },
  {
    name: 'nodejs-express-example',
    description: 'A Node.js application template using Express framework',
    href: 'https://github.com/CleverCloud/nodejs-example',
  },
  {
    name: 'ruby-on-rails-example',
    description: 'A Ruby on Rails application template with PostgreSQL',
    href: 'https://github.com/CleverCloud/ruby-3.1-rails-example',
  },
  {
    name: 'java-spring-boot-example',
    description: 'A Spring Boot application template with Maven',
    href: 'https://github.com/CleverCloud/java-war-example',
  },
  {
    name: 'php-laravel-example',
    description: 'A Laravel application template with Composer',
    href: 'https://github.com/CleverCloud/php-franken-laravel-example',
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {HomepageTemplateProjectStateLoaded} */
      state: {
        type: 'loaded',
        projects: PROJECTS_ITEMS,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {HomepageTemplateProjectStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {HomepageTemplateProjectStateError} */
      state: { type: 'error' },
    },
  ],
});

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
    href: '',
  },
  {
    name: 'nodejs-express-example',
    description: 'A Node.js application template using Express framework',
    href: '',
  },
  {
    name: 'ruby-on-rails-example',
    description: 'A Ruby on Rails application template with PostgreSQL',
    href: '',
  },
  {
    name: 'java-spring-boot-example',
    description: 'A Spring Boot application template with Maven',
    href: '',
  },
  {
    name: 'php-laravel-example',
    description: 'A Laravel application template with Composer',
    href: '',
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

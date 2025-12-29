import { makeStory } from '../../stories/lib/make-story.js';
import './cc-console-headbar.js';
import '../cc-button/cc-button.js';
import {
  iconRemixExternalLinkLine as iconExternalLink,
  iconRemixNotification_2Line as iconNotification,
  iconRemixRestartLine as iconRestart,
  iconRemixSettings_2Line as iconSettings,
  iconRemixTerminalBoxLine as iconTerminal,
} from '../../assets/cc-remix.icons.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Console/<cc-console-headbar>',
  component: 'cc-console-headbar',
};

const conf = {
  component: 'cc-console-headbar',
};

// Story 1: Default state with tabs (Application)
export const defaultStory = makeStory(conf, {
  items: [
    {
      productType: 'Node',
      productId: 'app_7c6f466c-3314-4753-9b06-f6791216b856',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/scalability', name: 'Scalability' },
        { path: '/domain-names', name: 'Domain names' },
        { path: '/tcp-redirections', name: 'TCP redirections' },
        { path: '/environment-variables', name: 'Environment variables' },
        { path: '/service-dependencies', name: 'Service dependencies' },
        { path: '/exposed-configuration', name: 'Exposed configuration' },
        { path: '/activity', name: 'Activity' },
        { path: '/logs', name: 'Logs' },
        { path: '/access-logs', name: 'Access Logs' },
        { path: '/metrics', name: 'Metrics' },
      ],
    },
  ],
});

// Story 2: Different product types (Applications)
export const pythonApp = makeStory(conf, {
  items: [
    {
      productType: 'Python',
      productId: 'app_abc12345-6789-0def-ghij-klmnopqrstuv',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/scalability', name: 'Scalability' },
        { path: '/logs', name: 'Logs' },
      ],
    },
  ],
});

export const phpApp = makeStory(conf, {
  items: [
    {
      productType: 'PHP',
      productId: 'app_11111111-2222-3333-4444-555555555555',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/scalability', name: 'Scalability' },
      ],
    },
  ],
});

export const javaApp = makeStory(conf, {
  items: [
    {
      productType: 'Java',
      productId: 'app_99999999-8888-7777-6666-555555555555',
      tabs: [
        { path: '/overview', name: 'Overview' },
        { path: '/information', name: 'Information', selected: true },
        { path: '/logs', name: 'Logs' },
      ],
    },
  ],
});

// Story 2b: Add-ons (Product examples)
export const postgresqlAddon = makeStory(conf, {
  docs: 'Example with a PostgreSQL add-on',
  items: [
    {
      productType: 'PostgreSQL',
      productId: 'addon_11111111-2222-3333-4444-555555555555',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/backups', name: 'Backups' },
        { path: '/metrics', name: 'Metrics' },
      ],
    },
  ],
});

export const mongodbAddon = makeStory(conf, {
  docs: 'Example with a MongoDB add-on',
  items: [
    {
      productType: 'MongoDB',
      productId: 'addon_aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/backups', name: 'Backups' },
      ],
    },
  ],
});

export const redisAddon = makeStory(conf, {
  docs: 'Example with a Redis add-on',
  items: [
    {
      productType: 'Redis',
      productId: 'addon_12345678-9abc-def0-1234-567890abcdef',
      tabs: [
        { path: '/overview', name: 'Overview' },
        { path: '/information', name: 'Information', selected: true },
        { path: '/metrics', name: 'Metrics' },
      ],
    },
  ],
});

// Story 3: With action buttons
export const withActions = makeStory(conf, {
  docs: 'Example with action buttons in the slot',
  items: [
    {
      productType: 'Node',
      productId: 'app_7c6f466c-3314-4753-9b06-f6791216b856',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/scalability', name: 'Scalability' },
        { path: '/logs', name: 'Logs' },
      ],
      innerHTML: `
        <cc-button slot="actions" circle hide-text .icon="${iconExternalLink}">Open app</cc-button>
        <cc-button slot="actions" circle hide-text .icon="${iconRestart}">Restart</cc-button>
        <cc-button slot="actions" circle hide-text .icon="${iconSettings}">Settings</cc-button>
        <cc-button slot="actions" circle hide-text .icon="${iconTerminal}">Terminal</cc-button>
      `,
    },
  ],
});

// Story 4: Skeleton loading state
export const skeleton = makeStory(conf, {
  items: [
    {
      productType: 'Node',
      productId: 'app_7c6f466c-3314-4753-9b06-f6791216b856',
      skeleton: true,
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/scalability', name: 'Scalability' },
      ],
    },
  ],
});

// Story 5: No tabs (minimal)
export const noTabs = makeStory(conf, {
  items: [
    {
      productType: 'Ruby',
      productId: 'app_12345678-1234-5678-9abc-def012345678',
      tabs: [],
    },
  ],
});

// Story 6: Many tabs (overflow test)
export const manyTabs = makeStory(conf, {
  docs: 'Test responsive behavior with many tabs (horizontal scroll on small screens)',
  items: [
    {
      productType: 'Java',
      productId: 'app_7c6f466c-3314-4753-9b06-f6791216b856',
      tabs: [
        { path: '/overview', name: 'Overview', selected: true },
        { path: '/information', name: 'Information' },
        { path: '/scalability', name: 'Scalability' },
        { path: '/domain-names', name: 'Domain names' },
        { path: '/tcp-redirections', name: 'TCP redirections' },
        { path: '/environment-variables', name: 'Environment variables' },
        { path: '/service-dependencies', name: 'Service dependencies' },
        { path: '/exposed-configuration', name: 'Exposed configuration' },
        { path: '/activity', name: 'Activity' },
        { path: '/logs', name: 'Logs' },
        { path: '/access-logs', name: 'Access Logs' },
        { path: '/metrics', name: 'Metrics' },
        { path: '/deployments', name: 'Deployments' },
        { path: '/backups', name: 'Backups' },
      ],
    },
  ],
});

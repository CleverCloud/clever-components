import '../../components/info-tiles/cc-info-app.js';
import notes from '../../.components-docs/cc-info-app.md';
import { createContainer } from '../lib/dom.js';
import { sequence } from '../lib/sequence';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions(
  'cc-info-app:start',
  'cc-info-app:restart',
  'cc-info-app:cancel',
  'cc-info-app:stop',
);

export function createComponent ({ app, status, runningCommit, startingCommit, disableButtons = false, width = '95%' }) {
  const component = document.createElement('cc-info-app');
  component.app = app;
  component.status = status;
  component.runningCommit = runningCommit;
  component.startingCommit = startingCommit;
  component.disableButtons = disableButtons;
  component.style.display = 'inline-flex';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  component.style.width = width;
  return component;
}

storiesOf('2. Information tiles|<cc-info-app>', module)
  .addParameters({ notes })
  .add('empty state (loading)', withActions(() => {
    return createContainer([
      'App is loading, status is loading',
      createComponent({}),
      'App is loaded, status is loading',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'PHP',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/php.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
      }),
    ]);
  }))
  .add('error', withActions(() => {
    const component = createComponent({});
    component.error = true;
    return component;
  }))
  .add('different app states', withActions(() => {
    return createContainer([
      '"unknown" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'PHP',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/php.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'unknown',
      }),
      '"stopped" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Docker',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/docker.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'stopped',
      }),
      '"stopped" state (brand new app)',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          variantName: 'Python',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/python.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'stopped',
      }),
      '"start-failed" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Java + WAR',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/java-war.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'start-failed',
      }),
      '"running" state (running commit unknown)',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Java + JAR',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/java-jar.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'running',
      }),
      '"running" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Ruby',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/ruby.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'running',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
      }),
      '"restart-failed" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Java or Scala + Play! 2',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/play2.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'restart-failed',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
      }),
      '"starting" state (deploying commit unknown)',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Java + Maven',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/maven.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'starting',
      }),
      '"starting" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Go',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/go.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'starting',
        startingCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
      }),
      '"restarting" state (deploying commit unknown)',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: 'bf4c76b3c563050d32e411b2f06d11515c7d8304',
          variantName: 'Scala',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/scala.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'restarting',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
      }),
      '"restarting" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: 'bf4c76b3c563050d32e411b2f06d11515c7d8304',
          variantName: 'Haskell',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/haskell.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'restarting',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        startingCommit: 'bf4c76b3c563050d32e411b2f06d11515c7d8304',
      }),
      '"restarting-with-downtime" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Static',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/apache.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'restarting-with-downtime',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        startingCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
      }),
    ]);
  }))
  .add('disable-buttons=true', withActions(() => {
    return createContainer([
      '"stopped" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Docker',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/docker.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'stopped',
        width: '95%',
        disableButtons: true,
      }),
      '"running" state',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Ruby',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/ruby.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'running',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        width: '95%',
        disableButtons: true,
      }),
      '"restarting" state (deploying commit unknown)',
      createComponent({
        app: {
          name: 'Awesome app (PROD)',
          commit: 'bf4c76b3c563050d32e411b2f06d11515c7d8304',
          variantName: 'Scala',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/scala.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'restarting',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        width: '95%',
        disableButtons: true,
      }),
    ]);
  }))
  .add('different style widths', withActions(() => {

    const variants = Array
      .from(new Array(9))
      .map((_, i) => i * 100 + 400)
      .flatMap((width) => {
        return [
          width + 'px',
          createComponent({
            app: {
              name: 'Awesome app (PROD)',
              commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
              variantName: 'Node',
              variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
              lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
            },
            status: 'running',
            runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
            startingCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
            width: width + 'px',
          }),
        ];
      });

    return createContainer([
      '300px (short and very long name)',
      createComponent({
        app: {
          name: 'Awesome app',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Node',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'running',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        startingCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        width: '300px',
      }),
      createComponent({
        app: {
          name: 'Awesome app with very very very very very long name (PROD)',
          commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
          variantName: 'Node',
          variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
          lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
        },
        status: 'running',
        runningCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        startingCommit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
        width: '300px',
      }),
      ...variants,
    ]);
  }))
  .add('simulations', withActions(() => {

    const errorComponent = createComponent({});
    const component = createComponent({});

    const app = {
      name: 'Awesome app name (PROD)',
      commit: '99b8617a5e102b318593eed3cd0c0a67e77b7e9a',
      variantName: 'Node',
      variantLogo: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
      lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
    };

    sequence(async (wait) => {

      await wait(3000);
      errorComponent.error = true;
      component.app = app;

      await wait(2000);
      component.status = 'running';
      component.runningCommit = '99b8617a5e102b318593eed3cd0c0a67e77b7e9a';

      await wait(3000);
      component.app = {
        ...app,
        commit: 'bf4c76b3c563050d32e411b2f06d11515c7d8304',
      };
      component.status = 'restarting';
      component.runningCommit = '99b8617a5e102b318593eed3cd0c0a67e77b7e9a';

      await wait(1000);
      component.startingCommit = 'bf4c76b3c563050d32e411b2f06d11515c7d8304';

      await wait(3000);
      component.status = 'restart-failed';
      component.startingCommit = null;

      await wait(3000);
      component.status = 'stopped';
      component.runningCommit = null;
    });

    return createContainer([
      'Loading, then error',
      errorComponent,
      'Loading, running, restarting, restart-failed, stopped',
      component,
    ]);
  }));

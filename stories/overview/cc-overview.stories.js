import '../../components/maps/cc-logsmap.js';
import '../../components/overview/cc-header-app.js';
import '../../components/overview/cc-overview.js';
import '../../components/overview/cc-tile-consumption.js';
import '../../components/overview/cc-tile-deployments.js';
import '../../components/overview/cc-tile-instances.js';
import '../../components/overview/cc-tile-scalability.js';
import notes from '../../.components-docs/cc-overview.md';
import { storiesOf } from '@storybook/html';

const stories = storiesOf('2. Overview|<cc-overview>', module)
  .addParameters({ notes });

Array
  .from(new Array(8))
  .map((_, i) => i * 150 + 400)
  .forEach((width) => {

    stories.add(`width at ${width}px`, () => {

      const overview = document.createElement('cc-overview');
      overview.style.height = '750px';
      overview.style.width = width + 'px';

      overview.innerHTML = `
        <cc-header-app slot="head"></cc-header-app>
        <cc-tile-instances slot="tiles"></cc-tile-instances>
        <cc-tile-scalability slot="tiles"></cc-tile-scalability>
        <cc-tile-deployments slot="tiles"></cc-tile-deployments>
        <cc-tile-consumption slot="tiles"></cc-tile-consumption>
        <cc-logsmap slot="main"></cc-logsmap>
      `;

      return overview;
    });

  });

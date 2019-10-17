import '../../components/info-tiles/cc-info-app.js';
import '../../components/info-tiles/cc-info-consumption.js';
import '../../components/info-tiles/cc-info-deployments.js';
import '../../components/info-tiles/cc-info-instances.js';
import '../../components/info-tiles/cc-info-scalability.js';
import '../../components/maps/cc-logsmap.js';
import '../../components/overview/cc-overview.js';
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
        <cc-info-app slot="head"></cc-info-app>
        <cc-info-instances slot="tiles"></cc-info-instances>
        <cc-info-scalability slot="tiles"></cc-info-scalability>
        <cc-info-deployments slot="tiles"></cc-info-deployments>
        <cc-info-consumption slot="tiles"></cc-info-consumption>
        <cc-logsmap slot="main"></cc-logsmap>
      `;

      return overview;
    });

  });

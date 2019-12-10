import '../../components/maps/cc-logsmap.js';
import '../../components/overview/cc-header-app.js';
import '../../components/overview/cc-header-orga.js';
import '../../components/overview/cc-overview.js';
import '../../components/overview/cc-tile-consumption.js';
import '../../components/overview/cc-tile-deployments.js';
import '../../components/overview/cc-tile-instances.js';
import '../../components/overview/cc-tile-requests.js';
import '../../components/overview/cc-tile-scalability.js';
import '../../components/overview/cc-tile-status-codes.js';
import notes from '../../.components-docs/cc-overview.md';
import { storiesOf } from '@storybook/html';

function createComponent (mode, width) {
  const component = document.createElement('cc-overview');
  component.style.minHeight = '750px';
  component.style.maxWidth = width + 'px';
  component.style.width = '100%';
  component.mode = mode;
  return component;
}

const widths = [350, 450, 550, 600, 800, 900, 1000, 1150, 1300];

// We keep using stories of here because it's simpler to generate
const orgaStories = storiesOf('2. Overview|<cc-overview>/orga layout (2 tiles)', module)
  .addParameters({ notes });

widths.forEach((width) => {
  orgaStories.add(`Width at ${width}px`, () => {
    const overview = createComponent('orga', width);
    overview.innerHTML = `
      <cc-header-orga class="head"></cc-header-orga>
      <cc-tile-status-codes></cc-tile-status-codes>
      <cc-tile-requests></cc-tile-requests>
      <cc-logsmap class="main"></cc-logsmap>
    `;
    return overview;
  });
});

// We keep using stories of here because it's simpler to generate
const appStories = storiesOf('2. Overview|<cc-overview>/app layout (6 tiles)', module)
  .addParameters({ notes });

widths.forEach((width) => {
  appStories.add(`Width at ${width}px`, () => {
    const overview = createComponent('app', width);
    overview.innerHTML = `
      <cc-header-app class="head"></cc-header-app>
      <cc-tile-instances></cc-tile-instances>
      <cc-tile-scalability></cc-tile-scalability>
      <cc-tile-deployments></cc-tile-deployments>
      <cc-tile-consumption></cc-tile-consumption>
      <cc-tile-status-codes></cc-tile-status-codes>
      <cc-tile-requests></cc-tile-requests>
      <cc-logsmap class="main"></cc-logsmap>
    `;
    return overview;
  });
});

import '../../components/molecules/cc-block.js';
import notes from '../../.components-docs/cc-block.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory } from '../lib/make-story.js';

export default {
  title: '🧬 Molecules|<cc-block>',
  component: 'cc-block',
  parameters: { notes },
};

const htmlExample = `
  <div slot="title">This is my block</div>
  <div slot="main">
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
    <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
  </div>
`;

const conf = {
  component: 'cc-block',
};

export const defaultStory = makeStory(conf, {
  items: [{
    innerHTML: htmlExample,
  }],
});

export const icon = makeStory(conf, {
  items: [{
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
    innerHTML: htmlExample,
  }],
});

export const toggleWithOpen = makeStory(conf, {
  items: [{
    innerHTML: htmlExample,
    toggle: true,
    open: true,
  }],
});

export const toggleWithClose = makeStory(conf, {
  items: [{
    innerHTML: htmlExample,
    toggle: true,
    open: false,
  }],
});

export const iconAndToggle = makeStory(conf, {
  items: [{
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
    innerHTML: htmlExample,
    toggle: true,
    open: true,
  }],
});

enhanceStoriesNames({
  defaultStory,
  icon,
  toggleWithOpen,
  toggleWithClose,
  iconAndToggle,
});

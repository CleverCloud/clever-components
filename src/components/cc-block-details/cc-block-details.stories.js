import { makeStory } from '../../stories/lib/make-story.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import '../cc-block/cc-block.js';
import './cc-block-details.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-block-details>',
  component: 'cc-block-details',
};

const conf = {
  component: 'cc-block',
  css: [cliCommandsStyles],
};

const ccBlockHtmlExample = `
  <div slot="header-title">This is my block</div>
  <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
`;

const ccBlockDetailsContent = `
  <p class="text">
    Haec ad tenuem ideo aliquem ad haec tamquam te si.
    Insidiarum perlato praedicto quo cogitabatur perlato cubiculi aurum diligens astute hoc opera ut mota et <a href="https://github.com/CleverCloud/clever-tools/blob/master/docs/setup-systems.md" title="documentation - Installing Clever Tools - new window">link</a>.
  </p>
  <dl>
    <dt>Ad et securius ad perferens:</dt>
    <dd><code>clever fake-command --fake-arg fake-app-id_a5a437c5-b9c7-41c2-97f3-fc6432a72ec0</code></dd>
    <dt>Sollemni cum Caesare:</dt>
    <dd><code>clever fake-command --fake-arg fake-app-id_a5a437c5-b9c7-41c2-97f3-fc6432a72ec0</code></dd>
    <dt>Cautissimas et conserta habet:</dt>
    <dd><code>clever fake-command --fake-arg fake-app-id_a5a437c5-b9c7-41c2-97f3-fc6432a72ec0</code></dd>
  </dl>
`;

const defaultHtmlExample = `
  ${ccBlockHtmlExample}
  <cc-block-details slot="footer-left">
    <div slot="button-text">Command line</div>
    <a slot="link" href="">See documentation</a>
    <div slot="content">${ccBlockDetailsContent}</div>
  </cc-block-details>
`;

export const defaultStory = makeStory(conf, {
  items: [
    {
      innerHTML: defaultHtmlExample,
    },
  ],
});

const openHtmlExample = `
  ${ccBlockHtmlExample}
  <cc-block-details is-open=true slot="footer-left">
    <div slot="button-text">Command line</div>
    <a slot="link" href="">See documentation</a>
    <div slot="content">${ccBlockDetailsContent}</a></div>
  </cc-block-details>
`;

export const openStory = makeStory(conf, {
  items: [
    {
      innerHTML: openHtmlExample,
    },
  ],
});

const withoutLinkHtmlExample = `
  ${ccBlockHtmlExample}
  <cc-block-details slot="footer-left">
    <div slot="button-text">Command line</div>
    <div slot="content">${ccBlockDetailsContent}</div>
  </cc-block-details>
`;

export const withoutLinkStory = makeStory(conf, {
  items: [
    {
      innerHTML: withoutLinkHtmlExample,
    },
  ],
});

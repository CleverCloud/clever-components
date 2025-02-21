import { makeStory } from '../../stories/lib/make-story.js';
import './cc-block-details.js';
import '../cc-block/cc-block.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-block-details>',
  component: 'cc-block-details',
};

const conf = {
  component: 'cc-block',
};

const ccBlockHtmlExample = `
  <div slot="header-title">This is my block</div>
  <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
`;

const defaultHtmlExample = `
  ${ccBlockHtmlExample}
  <cc-block-details slot="footer-left">
    <div slot="button-text">Command line</div>
    <a slot="link" href="">See documentation</a>
    <div slot="content">Praesent tincidunt dapibus elit, sed posuere risus sodales quis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer ultrices maximus ligula eu efficitur. Nulla luctus ipsum vitae dui gravida, sodales ornare dolor viverra. Vivamus pretium scelerisque ultricies. Nulla consectetur euismod euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras dignissim id sapien non facilisis. Suspendisse vitae pretium orci. Nunc aliquam pellentesque nunc, at tincidunt nisi lobortis a. <a href="#">Fake link</a></div>
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
    <div slot="content">Praesent tincidunt dapibus elit, sed posuere risus sodales quis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer ultrices maximus ligula eu efficitur. Nulla luctus ipsum vitae dui gravida, sodales ornare dolor viverra. Vivamus pretium scelerisque ultricies. Nulla consectetur euismod euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras dignissim id sapien non facilisis. Suspendisse vitae pretium orci. Nunc aliquam pellentesque nunc, at tincidunt nisi lobortis a. <a href="#">Fake link</a></div>
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
    <div slot="content">Praesent tincidunt dapibus elit, sed posuere risus sodales quis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer ultrices maximus ligula eu efficitur. Nulla luctus ipsum vitae dui gravida, sodales ornare dolor viverra. Vivamus pretium scelerisque ultricies. Nulla consectetur euismod euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras dignissim id sapien non facilisis. Suspendisse vitae pretium orci. Nunc aliquam pellentesque nunc, at tincidunt nisi lobortis a. <a href="#">Fake link</a></div>
  </cc-block-details>
`;

export const withoutLinkStory = makeStory(conf, {
  items: [
    {
      innerHTML: withoutLinkHtmlExample,
    },
  ],
});

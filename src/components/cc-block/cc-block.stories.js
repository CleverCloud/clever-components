import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import './cc-block.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-block>',
  component: 'cc-block',
};

/**
 * @typedef {import('./cc-block.js').CcBlock} CcBlock
 */

const htmlExample = `
  <div slot="header-title">This is my block</div>
  <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
  <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
`;

const conf = {
  component: 'cc-block',
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: htmlExample,
    },
  ],
});

export const image = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      image: 'https://assets.clever-cloud.com/logos/nodejs.svg',
      innerHTML: htmlExample,
    },
  ],
});

export const imageSlotted = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <img slot="header-icon" src="https://assets.clever-cloud.com/logos/nodejs.svg" alt="Nodejs logo">
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const icon = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      icon: iconInfo,
      innerHTML: htmlExample,
    },
  ],
});

export const iconSlotted = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <svg slot="header-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></svg>
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const imageAndIcon = makeStory(conf, {
  docs: `
If you set both \`image\` and \`icon\` properties, the \`image\` property will be ignored:
  `,
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      image: 'https://assets.clever-cloud.com/logos/nodejs.svg',
      icon: iconInfo,
      innerHTML: htmlExample,
    },
  ],
});

export const ribbon = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      ribbon: 'info',
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const ribbonSlotted = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="ribbon">info</div>
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const ribbonWithToggle = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      toggle: 'open',
      innerHTML: `
      <div slot="ribbon">info</div>
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const toggleOpen = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="footer-right">Some content in the right footer side.</div>
     `,
      toggle: 'open',
    },
  ],
});

export const toggleClose = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="footer-right">Some content in the right footer side.</div>
     `,
      toggle: 'close',
    },
  ],
});

export const imageAndOpen = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      image: 'https://assets.clever-cloud.com/logos/nodejs.svg',
      innerHTML: htmlExample,
      toggle: 'open',
    },
  ],
});

export const iconAndOpen = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      icon: iconInfo,
      innerHTML: htmlExample,
      toggle: 'open',
    },
  ],
});

export const headerRightContent = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <cc-button slot="header-right">A button</cc-button>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const header = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header" style="font-size: large; color: white; background-color: #3a3871; padding: 2em;">Some custom content in the header.</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const contentHeader = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content-header" style="color: var(--cc-color-text-weak); display: block; font-style: italic; line-height: 1.5;">Some content in my content header.</div>
      <div slot="content-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content-body">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
`,
    },
  ],
});

export const contentBodyWithOverflow = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content-body" style="box-shadow: 0 0 10px 0 blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content-body" style="box-shadow: 0 0 10px 0 red; margin-top: 1em;">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const contentFooterAndHeader = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content-header" style="color: var(--cc-color-text-weak); display: block; font-style: italic; line-height: 1.5;">Some content in my content header.</div>
      <div slot="content-body">
      <input type="checkbox" id="text"><label for="text">Show text</label>
      <p class="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi beatae culpa eaque eum ex explicabo iusto laudantium magni odio possimus quaerat, qui sit tenetur totam velit veritatis vitae. Magni, nemo!</p>
      <p class="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi beatae culpa eaque eum ex explicabo iusto laudantium magni odio possimus quaerat, qui sit tenetur totam velit veritatis vitae. Magni, nemo!</p>
      <p class="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi beatae culpa eaque eum ex explicabo iusto laudantium magni odio possimus quaerat, qui sit tenetur totam velit veritatis vitae. Magni, nemo!</p>
      </div>
      <div slot="content-footer" style="color: var(--cc-color-text-weak); display: block; font-style: italic; line-height: 1.5;">Some content in my content footer.</div>

`,
    },
  ],
  css: `
  p.text {
    display: none;
  }

  input:checked ~ p.text {
    display: block;
  }
  `,
});

export const contentFooter = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content-body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content-body">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="content-footer" style="color: var(--cc-color-text-weak); display: block; font-style: italic; line-height: 1.5;">Some content in my content footer.</div>
`,
    },
  ],
});

export const content = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    },
  ],
});

export const footerLeft = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="footer-left">Some content in the left footer side.</div>
`,
    },
  ],
});

export const footerRight = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="footer-right">Some content in the right footer side.</div>
`,
    },
  ],
});

export const footerLeftAndRight = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="footer-left">Some content in the left footer side.</div>
      <div slot="footer-right">Some content in the right footer side.</div>
`,
    },
  ],
});

export const footer = makeStory(conf, {
  /** @type {Array<Partial<CcBlock>>} */
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <div slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div slot="content">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="footer" style="font-size: large; color: white; background-color: #3a3871;">Some custom content in the footer.</div>
`,
    },
  ],
});

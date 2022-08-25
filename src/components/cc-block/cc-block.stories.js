import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import './cc-block.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Molecules/<cc-block>',
  component: 'cc-block',
};

const htmlExample = `
  <div slot="title">This is my block</div>
  <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
  <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
`;

const conf = {
  component: 'cc-block',
};

export const defaultStory = makeStory(conf, {
  items: [{
    innerHTML: htmlExample,
  }],
});

export const overlayWithLoader = makeStory(conf, {
  items: [{
    // language=HTML
    innerHTML: `
      <div slot="title">This is my block</div>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <cc-loader slot="overlay"></cc-loader>
    `,
  }],
});

export const overlayWithErrorAlert = makeStory(conf, {
  items: [{
    // language=HTML
    innerHTML: `
      <div slot="title">This is my block</div>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
      <div slot="overlay">
        <cc-error mode="info">Something went wrong while loading something really, really important.</cc-error>
      </div>
    `,
  }],
});

export const icon = makeStory(conf, {
  items: [{
    icon: 'https://assets.clever-cloud.com/logos/nodejs.svg',
    innerHTML: htmlExample,
  }],
});

export const button = makeStory(conf, {
  items: [{
    innerHTML: `
      <div slot="title">This is my block</div>
      <cc-button slot="button">A button</cc-button>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
  }],
});

export const noHead = makeStory(conf, {
  items: [{
    noHead: true,
    innerHTML: `
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
  }],
});

export const ribbon = makeStory(conf, {
  items: [{
    ribbon: 'info',
    innerHTML: `
      <div slot="title">This is my block</div>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
  }],
});

export const ribbonWithState = makeStory(conf, {
  items: [{
    ribbon: 'info',
    state: 'open',
    innerHTML: `
      <div slot="title">This is my block</div>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
  }],
});

export const ribbonWithNoHead = makeStory(conf, {
  items: [{
    ribbon: 'info',
    noHead: true,
    innerHTML: `
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div>Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
  }],
});

export const stateWithOpen = makeStory(conf, {
  items: [{
    innerHTML: htmlExample,
    state: 'open',
  }],
});

export const stateWithClose = makeStory(conf, {
  items: [{
    innerHTML: htmlExample,
    state: 'close',
  }],
});

export const stateWithOverflow = makeStory(conf, {
  items: [{
    innerHTML: `
      <div slot="title">This is my block</div>
      <div style="box-shadow: 0 0 10px 0 blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
      <div style="box-shadow: 0 0 10px 0 red">Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.</div>
    `,
    state: 'open',
  }],
});

export const iconAndOpen = makeStory(conf, {
  items: [{
    icon: 'https://assets.clever-cloud.com/logos/nodejs.svg',
    innerHTML: htmlExample,
    state: 'open',
  }],
});

enhanceStoriesNames({
  defaultStory,
  overlayWithLoader,
  overlayWithErrorAlert,
  icon,
  button,
  noHead,
  ribbon,
  ribbonWithState,
  ribbonWithNoHead,
  stateWithOpen,
  stateWithClose,
  stateWithOverflow,
  iconAndOpen,
});

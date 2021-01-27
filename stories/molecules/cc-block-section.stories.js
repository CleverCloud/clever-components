import '../../src/atoms/cc-button.js';
import '../../src/atoms/cc-input-text.js';
import '../../src/molecules/cc-block-section.js';
import '../../src/molecules/cc-block.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🧬 Molecules/<cc-block-section>',
  component: 'cc-block-section',
};

const conf = {
  component: 'cc-block',
  css: `
    cc-button,
    cc-input-text {
      margin: 0;
    }
    
    cc-button {
      justify-self: start;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{
    innerHTML: `
      <div slot="title">This is my block</div>
      <cc-block-section>
        <div slot="title">Subtitle Foo</div>
        <div slot="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
      </cc-block-section>
      <cc-block-section>
        <div slot="title">Subtitle Bar</div>
        <div slot="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
        <cc-input-text label="Address:"></cc-input-text>
        <cc-button primary>ACTION!</cc-button>
      </cc-block-section>
      <cc-block-section>
        <div slot="title" class="danger">Danger section</div>
        <div slot="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.</div>
        <cc-button primary>THIRD!</cc-button>
      </cc-block-section>
    `,
  }],
});

export const infoWithEmptyColumn = makeStory(conf, {
  items: [{
    innerHTML: `
      <div slot="title">This is my block</div>
      <cc-block-section>
        <div slot="title">Subtitle Foo</div>
        <div slot="info"></div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
      </cc-block-section>
      <cc-block-section>
        <div slot="title">Subtitle Bar</div>
        <div slot="info"></div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
        <cc-input-text label="Address:"></cc-input-text>
        <cc-button primary>ACTION!</cc-button>
      </cc-block-section>
    `,
  }],
});

export const infoWithNoInfoColumn = makeStory(conf, {
  items: [{
    innerHTML: `
      <div slot="title">This is my block</div>
      <cc-block-section>
        <div slot="title">Subtitle Foo</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
      </cc-block-section>
      <cc-block-section>
        <div slot="title">Subtitle Bar</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
        <cc-input-text label="Address:"></cc-input-text>
        <cc-button primary>ACTION!</cc-button>
      </cc-block-section>
    `,
  }],
});

enhanceStoriesNames({
  defaultStory,
  infoWithEmptyColumn,
  infoWithNoInfoColumn,
});

import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import './cc-block-section.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-block-section>',
  component: 'cc-block-section',
};

const conf = {
  component: 'cc-block',
  // language=CSS
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
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <cc-block-section slot="content-body">
        <div slot="title">Subtitle Foo</div>
        <div slot="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
      </cc-block-section>
      <cc-block-section slot="content-body">
        <div slot="title">Subtitle Bar</div>
        <div slot="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
        <cc-input-text label="Address:"></cc-input-text>
        <cc-button primary>ACTION!</cc-button>
      </cc-block-section>
      <cc-block-section slot="content-body">
        <div slot="title" class="danger">Danger section</div>
        <div slot="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id.</div>
        <cc-button primary>THIRD!</cc-button>
      </cc-block-section>
    `,
    },
  ],
});

export const infoWithEmptyColumn = makeStory(conf, {
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <cc-block-section slot="content-body">
        <div slot="title">Subtitle Foo</div>
        <div slot="info"></div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
      </cc-block-section>
      <cc-block-section slot="content-body">
        <div slot="title">Subtitle Bar</div>
        <div slot="info"></div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
        <cc-input-text label="Address:"></cc-input-text>
        <cc-button primary>ACTION!</cc-button>
      </cc-block-section>
    `,
    },
  ],
});

export const infoWithNoInfoColumn = makeStory(conf, {
  items: [
    {
      innerHTML: `
      <div slot="header-title">This is my block</div>
      <cc-block-section slot="content-body">
        <div slot="title">Subtitle Foo</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
      </cc-block-section>
      <cc-block-section slot="content-body">
        <div slot="title">Subtitle Bar</div>
        <cc-input-text label="Name:"></cc-input-text>
        <cc-input-text label="Lastname:"></cc-input-text>
        <cc-input-text label="Address:"></cc-input-text>
        <cc-button primary>ACTION!</cc-button>
      </cc-block-section>
    `,
    },
  ],
});

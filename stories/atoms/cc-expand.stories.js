import '../../components/atoms/cc-expand.js';
import '../../components/atoms/cc-toggle.js';
import notes from '../../.components-docs/cc-expand.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { html, render } from 'lit-html';
import { makeStory } from '../lib/make-story.js';

export default {
  title: '1. Atoms|<cc-expand>',
  component: 'cc-expand',
  parameters: { notes },
};

const conf = {
  component: 'cc-expand',
};

// We don't want default story to be the first story because we won't have the story description displayed.
export const notAStory = () => `@see stories below...`;

export const defaultStory = makeStory(conf, {
  docs: `Change \`.box\` blocks (tomato background) height with the toggle and see how \`cc-expand\` (blue border) adapts its size.`,
  css: `
    .knob {
      margin-bottom: 1rem;
    }
    cc-toggle {
      margin: 0;
    }
    cc-expand {
      border: 3px solid blue;
    }
    .box { background-color: tomato; margin: 1rem; }
    .box[data-size="small"] { height: 60px }
    .box[data-size="medium"] { height: 120px }
    .box[data-size="big"] { height: 180px }
  `,
  dom: (container) => {

    const choices = [
      { label: 'small', value: 'small' },
      { label: 'medium', value: 'medium' },
      { label: 'big', value: 'big' },
    ];

    const onSize = ({ detail: size }) => render(template({ size }), container);

    function template ({ size }) {
      return html`
        <div class="knob">
          <cc-toggle value="${size}" .choices=${choices} @cc-toggle:input=${onSize}></cc-toggle>
        </div>
        <cc-expand>
          <div class="box" data-size="${size}"></div>
          <div class="box" data-size="${size}"></div>
        </cc-expand>
      `;
    }

    render(template({ size: 'medium' }), container);
  },
});

enhanceStoriesNames({ notAStory, defaultStory });

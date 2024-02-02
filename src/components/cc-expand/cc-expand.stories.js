import './cc-expand.js';
import '../cc-toggle/cc-toggle.js';
import { html, render } from 'lit';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🧬 Atoms/<cc-expand>',
  component: 'cc-expand',
};

const conf = {
  component: 'cc-expand',
};

// We don't want default story to be the first story because we won't have the story description displayed.
export const notAStory = () => `@see stories below...`;

export const defaultStory = makeStory(conf, {
  docs: `Change \`.box\` blocks (tomato background) height with the toggle and see how \`cc-expand\` (blue border) adapts its size.`,
  // language=CSS
  css: `
    .knob {
      margin-bottom: 1em;
    }
    cc-toggle {
      margin: 0;
    }
    cc-expand {
      border: 3px solid blue;
    }
    .box { background-color: tomato; margin: 1em; }
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

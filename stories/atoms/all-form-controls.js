import '../../src/atoms/cc-button.js';
import '../../src/atoms/cc-input-number.js';
import '../../src/atoms/cc-input-text.js';
import '../../src/atoms/cc-select.js';
import '../../src/atoms/cc-toggle.js';
import { makeStory } from '../lib/make-story.js';

export const allFormControlsStory = makeStory({
  dom: (container) => {
    container.innerHTML = `
      <div style="display: flex; gap: 1em; align-items: flex-end;">
        <cc-button>The button</cc-button>
        <cc-input-number label="The label" value="42"></cc-input-number>
        <cc-input-text label="The label" value="The value"></cc-input-text>
        <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-select>
        <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-toggle>
      </div>
    `;
  },
});

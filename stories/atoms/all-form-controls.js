import '../../src/atoms/cc-button.js';
import '../../src/atoms/cc-input-number.js';
import '../../src/atoms/cc-input-text.js';
import '../../src/atoms/cc-select.js';
import '../../src/atoms/cc-toggle.js';
import { makeStory } from '../lib/make-story.js';

const conf = {
  css: `
    h1 {
      font-size: 1.2em;
      margin-bottom: 1em;
    }

    h1+div {
      align-items: flex-end;
      border-bottom: solid 1px gray;
      display: flex;
      gap: 1em;
      margin-bottom: 2em;
      padding-bottom: 2em;
    }
  `,
};

export const allFormControlsStory = makeStory(conf,
  {
    dom: (container) => {
      container.innerHTML = `
      <h1>All form controls - basic</h1>
      <div>
        <cc-button>The button</cc-button>
        <cc-input-number label="The label" value="42"></cc-input-number>
        <cc-input-text label="The label" value="The value"></cc-input-text>
        <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-select>
        <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-toggle>
      </div>
      <h1>All form controls - disabled</h1>
      <div>
        <cc-button disabled>The button</cc-button>
        <cc-input-number label="The label" value="42" disabled></cc-input-number>
        <cc-input-text label="The label" value="The value" disabled></cc-input-text>
        <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one" disabled></cc-select>
        <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one" disabled></cc-toggle>
      </div>
      <h1>Form controls with readonly mode</h1>
      <div>
        <cc-input-number label="The label" value="42" readonly></cc-input-number>
        <cc-input-text label="The label" value="The value" readonly></cc-input-text>
      </div>
    `;
    },
  },
);

import '../../src/atoms/cc-button.js';
import '../../src/atoms/cc-input-number.js';
import '../../src/atoms/cc-input-text.js';
import '../../src/atoms/cc-select.js';
import '../../src/atoms/cc-toggle.js';
import { defaultThemeStyles } from '../../src/styles/default-theme.js';
import { makeStory } from '../lib/make-story.js';

const conf = {
  css: [
    defaultThemeStyles.toString(),
    // language=CSS
    `
      h1 {
        font-size: 1.2em;
        margin-bottom: 1em;
      }
  
      form {
        align-items: start;
        border-bottom: solid 1px gray;
        display: flex;
        gap: 1em;
        margin-bottom: 2em;
        padding-bottom: 2em;
      }
      
      code {
        background-color: var(--color-bg-neutral);
        padding: 0.3em;
      }
      
      cc-button {
        margin-top: var(--margin-top-btn-horizontal-form);
      }
    `].join('/n'),
};

export const allFormControlsStory = makeStory(conf,
  {
    dom: (container) => {
      container.innerHTML = `
        <h1>Horizontal layout for form elements</h1>
        <p>To make sure the <code>cc-button</code> element aligns with other form elements even when an error / help message is displayed, do as follows:</p>
        <ul>
          <li>Use <code>display: flex;</code> on the container of the form elements (typically the <code>form</code> element).</li>
          <li>Use <code>align-items: start;</code>.</li>
          <li>Import <code>defaultThemeStyles</code> and use <code>margin-top: var(--margin-top-btn-horizontal-form);</code> on the <code>cc-button</code> element.</li>
        </ul>
        <h1>All form controls - basic</h1>
        <form>
          <cc-button>The button</cc-button>
          <cc-input-number label="The label" value="42"></cc-input-number>
          <cc-input-text label="The label" value="The value"></cc-input-text>
          <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-select>
          <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-toggle>
        </form>
        <h1>All form controls - disabled</h1>
        <form>
          <cc-button disabled>The button</cc-button>
          <cc-input-number label="The label" value="42" disabled></cc-input-number>
          <cc-input-text label="The label" value="The value" disabled></cc-input-text>
          <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one" disabled></cc-select>
          <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one" disabled></cc-toggle>
        </form>
        <h1>Form controls with readonly mode</h1>
        <form>
          <cc-input-number label="The label" value="42" readonly></cc-input-number>
          <cc-input-text label="The label" value="The value" readonly></cc-input-text>
        </form>
        <h1>All form controls with help messages</h1>
        <form>
          <cc-button>The button</cc-button>
          <cc-input-number label="The label" value="42"><p slot="help">Small help message</p></cc-input-number>
          <cc-input-text label="The label" value="The value"><p slot="help">Small help message</p></cc-input-text>
          <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one">
            <p slot="help">Small help message</p>
          </cc-select>
          <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one">
            <p slot="help">Small help message</p>
          </cc-toggle>
        </form>
      `;
    },
  },
);

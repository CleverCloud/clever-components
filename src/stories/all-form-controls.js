import '../components/cc-button/cc-button.js';
import '../components/cc-input-date/cc-input-date.js';
import '../components/cc-input-number/cc-input-number.js';
import '../components/cc-input-text/cc-input-text.js';
import '../components/cc-select/cc-select.js';
import '../components/cc-toggle/cc-toggle.js';
import { makeStory } from './lib/make-story.js';

const conf = {
  // language=CSS
  css: `
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
      background-color: var(--cc-color-bg-neutral);
      padding: 0.3em;
    }

    cc-button {
      margin-top: var(--cc-margin-top-btn-horizontal-form);
    }
  `,
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
          <li>Use <code>margin-top: var(--cc-margin-top-btn-horizontal-form);</code> on the <code>cc-button</code> element.</li>
        </ul>
        <h1>All form controls - basic</h1>
        <form>
          <cc-button>The button</cc-button>
          <cc-input-number label="The label" value="42" controls></cc-input-number>
          <cc-input-date label="The label" value="2023-07-21T12:00:00.000Z" controls></cc-input-date>
          <cc-input-text label="The label" value="The value"></cc-input-text>
          <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-select>
          <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one"></cc-toggle>
        </form>
        <h1>All form controls - disabled</h1>
        <form>
          <cc-button disabled>The button</cc-button>
          <cc-input-number label="The label" value="42" disabled controls></cc-input-number>
          <cc-input-date label="The label" value="2023-07-21T12:00:00.000Z" disabled controls></cc-input-date>
          <cc-input-text label="The label" value="The value" disabled></cc-input-text>
          <cc-select label="The label" options='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one" disabled></cc-select>
          <cc-toggle legend="The label" choices='[{ "label": "one", "value": "one" }, { "label": "two", "value": "two" }]' value="one" disabled></cc-toggle>
        </form>
        <h1>Form controls with readonly mode</h1>
        <form>
          <cc-input-number label="The label" value="42" readonly controls></cc-input-number>
          <cc-input-date label="The label" value="2023-07-21T12:00:00.000Z" readonly controls></cc-input-date>
          <cc-input-text label="The label" value="The value" readonly></cc-input-text>
        </form>
        <h1>All form controls with help messages</h1>
        <form>
          <cc-button>The button</cc-button>
          <cc-input-number label="The label" value="42" controls><p slot="help">Small help message</p></cc-input-number>
          <cc-input-date label="The label" value="2023-07-21T12:00:00.000Z" controls><p slot="help">Small help message</p></cc-input-date>
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

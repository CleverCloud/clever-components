import './cc-popover-v1.js';
import './cc-popover-v2.js';
import './cc-popover-v3.js';
import { html, render } from 'lit';
import { iconRemixSettings_5Line as iconOptions } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Popover/<cc-popover>',
  component: 'cc-popover-v1',
};

const conf = {
  component: 'cc-popover-v1',
  // language=CSS
  css: `
    :host {
      max-width: 100% !important;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  // language=CSS
  css: `
    .v {
      margin-top: 1em;
    }
  `,
  dom: (container) => {
    return render(html`
      <div class="v">
        Version 1: Generic implementation
      </div>
      <cc-popover-v1>
        <cc-button
          .icon=${iconOptions}
          accessible-name="show content"
          slot="target"
        >Clic Me!
        </cc-button>
        <div>
          This is the content
        </div>
      </cc-popover-v1>

      <div class="v">
        Version 2: Glue is made outside the component with a cc-popover:toggle event
      </div>
      <cc-popover-v2>
        <cc-button
          .icon=${iconOptions}
          accessible-name="show content"
          slot="target"
          @cc-button:click=${(e) => dispatchCustomEvent(e.target, 'cc-popover:toggle')}
        >Clic Me!
        </cc-button>
        <div>
          This is the content
        </div>
      </cc-popover-v2>

      <div class="v">
        Version 3: Button is implemented inside the popover
      </div>
      <cc-popover-v3
        .icon=${iconOptions}
        accessible-name="show content"
      >
        <span slot="target">Clic Me!</span>
        <div>
          This is the content
        </div>
      </cc-popover-v3>
    `, container);
  },
});

enhanceStoriesNames({ defaultStory });

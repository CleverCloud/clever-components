import './cc-toaster.js';
import '../cc-button/cc-button.js';
import '../cc-input-number/cc-input-number.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-block/cc-block.js';
import { html, render } from 'lit';
import { sanitize } from '../../lib/i18n-sanitize.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const infoSvg = new URL('../../assets/information-fill.svg', import.meta.url).href;
const successSvg = new URL('../../assets/checkbox-circle-fill.svg', import.meta.url).href;
const warningSvg = new URL('../../assets/alert-fill.svg', import.meta.url).href;
const dangerSvg = new URL('../../assets/spam-2-fill.svg', import.meta.url).href;
const consoleImage = new URL('../../stories/assets/console.png', import.meta.url).href;

export default {
  title: '🛠 Toast/<cc-toaster>',
  component: 'cc-toaster',
};

const conf = {
  component: 'cc-toaster',
};

// We don't want default story to be the first story because we won't have the story description displayed.
export const notAStory = () => `@see stories below...`;

export const defaultStory = makeStory(conf, {
  docs: `Click on buttons to toast`,
  css: `
    :host {
      max-width: 100% !important;
    }
    
    .knob {
      margin-bottom: 1em;
      display: flex;
      gap: 1em;
    }
    
    .buttons {
      flex: 1;
    }
    
    .console {
      position: relative;
      display: inline-block;
      overflow: hidden;
    }
    
    cc-toaster {
      margin: 1em;
      position: absolute;
      z-index: 1000;
      left: 50%;
      transform: translate(-50%, 0);
      // max-width: 15em;
    }
    
    cc-toaster.top {
      top: 0;
    }

    cc-toaster.bottom {
      bottom: 0;
    }
        
    cc-toaster.left {
      left: 0;
      transform: unset;
    }
    
    cc-toaster.right {
      left: unset;
      right: 0;
      transform: unset;
    }
  `,
  dom: (container) => {
    const intents = ['info', 'success', 'warning', 'danger'];

    const intentsButtonProp = {
      info: {
        icon: infoSvg,
      },
      success: {
        icon: successSvg,
      },
      warning: {
        icon: warningSvg,
      },
      danger: {
        icon: dangerSvg,
      },
    };

    let options = {
      timeout: 5000,
      maxToasts: NaN,
      animation: 'fade',
      closeable: false,
      showProgress: false,
      position: 'top',
    };

    let i = 0;
    function toast (node, { intent }) {
      i++;

      container.querySelector('cc-toaster').show({
        title: sanitize`This is a <strong>${intent.toUpperCase()}</strong> notification <em>(${i})</em>`,
        message: sanitize`This is a <em>description</em> for the event. This <strong>HTML</strong> is <code>sanitized</code>`,
        intent,
      });
    }

    function refresh () {
      render(template(options), container);
    }

    const onMaxToastChanged = ({ detail: maxToasts }) => {
      options = { ...options, maxToasts };
      refresh();
    };

    const onTimeoutChanged = ({ detail: timeout }) => {
      options = { ...options, timeout };
      refresh();
    };

    const onClick = ({ target }) => {
      toast(target, { intent: target.dataset.intent });
    };

    const animations = ['fade', 'slide', 'fade-and-slide']
      .map((value) => ({
        label: value, value,
      }));

    const onAnimationChanged = ({ detail: animation }) => {
      options = { ...options, animation };
      refresh();
    };

    const positions = ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right']
      .map((value) => ({
        label: value, value,
      }));

    const onPositionChanged = ({ detail: position }) => {
      options = { ...options, position };
      refresh();
    };

    const onCloseableChanged = () => {
      options = { ...options, closeable: !options.closeable };
      refresh();
    };

    const onShowProgressChanged = () => {
      options = { ...options, showProgress: !options.showProgress };
      refresh();
    };

    function _renderButton (intent) {
      return html`<cc-button
            image=${intentsButtonProp[intent]?.icon}
            outlined
            data-intent="${intent}"
            ?success="${intent === 'success'}"
            ?warning="${intent === 'warning'}"
            ?danger="${intent === 'danger'}"
            @cc-button:click=${onClick}>
          ${intent}
        </cc-button>`;
    }

    function template ({ animation, maxToasts, position, timeout, closeable, showProgress }) {
      const options = {
        timeout,
        closeable,
        showProgress,
      };

      return html`
        <div class="knob">
          <cc-block class="buttons">
            <p>Click on buttons to trigger a toast</p>
            <cc-flex-gap style="--cc-gap: 0.5em;">${intents.map(_renderButton)}</cc-flex-gap>
          </cc-block>
          
          <cc-block class="options">
            <div slot="title">Options</div>
            
            <div>
              <cc-input-number 
                  label="Maximum number of toasts that can be displayed at a time"
                  value=${maxToasts}
                  @cc-input-number:input=${onMaxToastChanged}
              ></cc-input-number>
            </div>
            <div>
              <cc-toggle
                  legend="Position"
                  value=${position}
                  .choices=${positions} 
                  @cc-toggle:input=${onPositionChanged}
              ></cc-toggle>
            </div>
            <div>
              <cc-toggle 
                  legend="Kind of animation to be played when the toast appears"
                  value=${animation}
                  .choices=${animations}
                  @cc-toggle:input=${onAnimationChanged}
              ></cc-toggle>
            </div>
            <div>
              <cc-input-number 
                  value=${timeout} 
                  label="Time before the toast is automatically dismissed (0 for infinite time)"
                  @cc-input-number:input=${onTimeoutChanged}
              ></cc-input-number>
            </div>
            <div>
              <label for="closeable">
                <input id="closeable" type="checkbox" @change=${onCloseableChanged} .checked=${closeable}>
                Show close button
              </label>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <label for="showProgress">
                <input id="showProgress" type="checkbox" @change=${onShowProgressChanged} .checked=${showProgress}>
                Show progress bar
              </label>
            </div>
            
          </cc-block>
        </div>
        
        <div class="console">
          <img src="${consoleImage}" alt="Clever Console"/>
          <cc-toaster class="${position.split('-').join(' ')}"
                      max-toasts=${maxToasts}
                      animation="${animation}" 
                      position="${position}"
                      .toastDefaultOptions="${options}"
          ></cc-toaster>
        </div>
      `;
    }

    refresh();
  },
});

enhanceStoriesNames({
  notAStory,
  defaultStory,
});

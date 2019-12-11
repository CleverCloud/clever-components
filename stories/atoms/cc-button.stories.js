import '../../components/atoms/cc-button.js';
import closeSvg from '../../components/overview/close.svg';
import infoSvg from '../../components/overview/info.svg';
import notes from '../../.components-docs/cc-button.md';
import { createContainer } from '../lib/dom.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { text } from '@storybook/addon-knobs';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('cc-button:click');

export default {
  title: '1. Atoms|<cc-button>',
  parameters: { notes },
};

export const defaultStory = withActions(() => {

  const label = text('Button label', '');

  return `
    <div class="title">Simple:</div>
    <cc-button simple>${label || 'Simple'}</cc-button>
    <cc-button simple disabled>${label || 'Simple disabled'}</cc-button>
    <cc-button simple outlined>${label || 'Simple outlined'}</cc-button>
    <cc-button simple outlined disabled>${label || 'Simple outlined & disabled'}</cc-button>
    
    <div class="title">Simple with 3s delay and cancel action:</div>
    <cc-button simple delay="3">${label || 'Simple'}</cc-button>
    <cc-button simple disabled delay="3">${label || 'Simple disabled'}</cc-button>
    <cc-button simple outlined delay="3">${label || 'Simple outlined'}</cc-button>
    <cc-button simple outlined disabled delay="3">${label || 'Simple outlined & disabled'}</cc-button>
    
    <div class="title">Simple (skeleton):</div>
    <cc-button skeleton simple>${label || 'Simple'}</cc-button>
    <cc-button simple skeleton disabled>${label || 'Simple disabled'}</cc-button>
    <cc-button simple skeleton outlined>${label || 'Simple outlined'}</cc-button>
    <cc-button simple skeleton outlined disabled>${label || 'Simple outlined & disabled'}</cc-button>
    
    <div class="title">Primary:</div>
    <cc-button primary>${label || 'Primary'}</cc-button>
    <cc-button primary disabled>${label || 'Primary disabled'}</cc-button>
    <cc-button primary outlined>${label || 'Primary outlined'}</cc-button>
    <cc-button primary outlined disabled>${label || 'Primary outlined & disabled'}</cc-button>
    
    <div class="title">Primary with 3s delay and cancel action:</div>
    <cc-button primary delay="3">${label || 'Primary'}</cc-button>
    <cc-button primary disabled delay="3">${label || 'Primary disabled'}</cc-button>
    <cc-button primary outlined delay="3">${label || 'Primary outlined'}</cc-button>
    <cc-button primary outlined disabled delay="3">${label || 'Primary outlined & disabled'}</cc-button>
    
    <div class="title">Primary (skeleton):</div>
    <cc-button skeleton primary>${label || 'Primary'}</cc-button>
    <cc-button skeleton primary disabled>${label || 'Primary disabled'}</cc-button>
    <cc-button skeleton primary outlined>${label || 'Primary outlined'}</cc-button>
    <cc-button skeleton primary outlined disabled>${label || 'Primary outlined & disabled'}</cc-button>
    
    <div class="title">Success:</div>
    <cc-button success>${label || 'Success'}</cc-button>
    <cc-button success disabled>${label || 'Success disabled'}</cc-button>
    <cc-button success outlined>${label || 'Success outlined'}</cc-button>
    <cc-button success outlined disabled>${label || 'Success outlined & disabled'}</cc-button>
    
    <div class="title">Success with 3s delay and cancel action:</div>
    <cc-button success delay="3">${label || 'Success'}</cc-button>
    <cc-button success disabled delay="3">${label || 'Success disabled'}</cc-button>
    <cc-button success outlined delay="3">${label || 'Success outlined'}</cc-button>
    <cc-button success outlined disabled delay="3">${label || 'Success outlined & disabled'}</cc-button>
    
    <div class="title">Success (skeleton):</div>
    <cc-button skeleton success>${label || 'Success'}</cc-button>
    <cc-button skeleton success disabled>${label || 'Success disabled'}</cc-button>
    <cc-button skeleton success outlined>${label || 'Success outlined'}</cc-button>
    <cc-button skeleton success outlined disabled>${label || 'Success outlined & disabled'}</cc-button>
    
    <div class="title">Warning:</div>
    <cc-button warning>${label || 'Warning'}</cc-button>
    <cc-button warning disabled>${label || 'Warning disabled'}</cc-button>
    <cc-button warning outlined>${label || 'Warning outlined'}</cc-button>
    <cc-button warning outlined disabled>${label || 'Warning outlined & disabled'}</cc-button>
  
    <div class="title">Warning with 3s delay and cancel action:</div>
    <cc-button warning delay="3">${label || 'Warning'}</cc-button>
    <cc-button warning disabled delay="3">${label || 'Warning disabled'}</cc-button>
    <cc-button warning outlined delay="3">${label || 'Warning outlined'}</cc-button>
    <cc-button warning outlined disabled delay="3">${label || 'Warning outlined & disabled'}</cc-button>
    
    <div class="title">Warning (skeleton):</div>
    <cc-button skeleton warning>${label || 'Warning'}</cc-button>
    <cc-button warning skeleton disabled>${label || 'Warning disabled'}</cc-button>
    <cc-button warning skeleton outlined>${label || 'Warning outlined'}</cc-button>
    <cc-button warning skeleton outlined disabled>${label || 'Warning outlined & disabled'}</cc-button>
    
    <div class="title">Danger:</div>
    <cc-button danger>${label || 'Danger'}</cc-button>
    <cc-button danger disabled>${label || 'Danger disabled'}</cc-button>
    <cc-button danger outlined>${label || 'Danger outlined'}</cc-button>
    <cc-button danger outlined disabled>${label || 'Danger outlined & disabled'}</cc-button>
    
    <div class="title">Danger with 3s delay and cancel action:</div>
    <cc-button danger delay="3">${label || 'Danger'}</cc-button>
    <cc-button danger disabled delay="3">${label || 'Danger disabled'}</cc-button>
    <cc-button danger outlined delay="3">${label || 'Danger outlined'}</cc-button>
    <cc-button danger outlined disabled delay="3">${label || 'Danger outlined & disabled'}</cc-button>
    
    <div class="title">Danger (skeleton):</div>
    <cc-button skeleton danger>${label || 'Danger'}</cc-button>
    <cc-button danger skeleton disabled>${label || 'Danger disabled'}</cc-button>
    <cc-button danger skeleton outlined>${label || 'Danger outlined'}</cc-button>
    <cc-button danger skeleton outlined disabled>${label || 'Danger outlined & disabled'}</cc-button>
  `;
});

export const image = withActions(() => {
  return `
    <div class="title">With image</div>
    <cc-button image="${infoSvg}"></cc-button>
    <cc-button image="${closeSvg}"></cc-button>
  `;
});

export const delayAndDisabled = withActions(() => {

  const btn1 = document.createElement('cc-button');
  btn1.innerHTML = 'With delay';
  btn1.delay = '3';

  const btn2 = document.createElement('cc-button');
  btn2.innerHTML = 'Toggle disabled on other button';

  btn2.addEventListener('cc-button:click', () => {
    btn1.disabled = !btn1.disabled;
  });

  return createContainer([
    'Button with delay, when disabled it should stop the delay mechanism:',
    btn1,
    btn2,
  ]);
});

enhanceStoriesNames({ defaultStory, image, delayAndDisabled });

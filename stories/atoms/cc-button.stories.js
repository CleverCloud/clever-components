import '../../components/atoms/cc-button.js';
import notes from '../../.components-docs/cc-button.md';
import { storiesOf } from '@storybook/html';
import { text } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['cc-button:click'];

storiesOf('atoms', module)
  .add('<cc-button>', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');

    return `
      <div class="title">Simple:</div>
      <cc-button simple>${label || 'Simple'}</cc-button>
      <cc-button simple disabled>${label || 'Simple disabled'}</cc-button>
      <cc-button simple outlined>${label || 'Simple outlined'}</cc-button>
      <cc-button simple outlined disabled>${label || 'Simple outlined & disabled'}</cc-button>
      
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
      
      <div class="title">Danger (skeleton):</div>
      <cc-button skeleton danger>${label || 'Danger'}</cc-button>
      <cc-button danger skeleton disabled>${label || 'Danger disabled'}</cc-button>
      <cc-button danger skeleton outlined>${label || 'Danger outlined'}</cc-button>
      <cc-button danger skeleton outlined disabled>${label || 'Danger outlined & disabled'}</cc-button>
    `;
  }), { notes });

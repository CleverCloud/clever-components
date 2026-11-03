import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { sendMouse } from '@web/test-runner-commands';
import { html } from 'lit';
import './cc-popover.js';

async function clickCenter(popover) {
  // The host is `display: block`, so its center is not on the trigger.
  const trigger = popover.shadowRoot.querySelector('.trigger-badge, .trigger-button');
  const { x, y, width, height } = trigger.getBoundingClientRect();
  await sendMouse({ type: 'click', position: [Math.round(x + width / 2), Math.round(y + height / 2)] });
}

describe('cc-popover component', () => {
  for (const intent of [null, 'info']) {
    describe(`with ${intent == null ? 'button' : 'badge'} trigger`, () => {
      it('should stay open after a real click on the trigger, then close on a second one', async () => {
        const popover = await fixture(html`
          <cc-popover .intent=${intent}>
            <span slot="button-content">Trigger</span>
            <div>Content</div>
          </cc-popover>
        `);

        await clickCenter(popover);
        await elementUpdated(popover);
        expect(popover.isOpen).to.equal(true);

        await clickCenter(popover);
        await elementUpdated(popover);
        expect(popover.isOpen).to.equal(false);
      });

      it('should close after a real click outside', async () => {
        const popover = await fixture(html`
          <cc-popover .intent=${intent} style="margin: 5em">
            <span slot="button-content">Trigger</span>
            <div>Content</div>
          </cc-popover>
        `);

        await clickCenter(popover);
        await elementUpdated(popover);
        expect(popover.isOpen).to.equal(true);

        await sendMouse({ type: 'click', position: [1, 1] });
        await elementUpdated(popover);
        expect(popover.isOpen).to.equal(false);
      });
    });
  }
});

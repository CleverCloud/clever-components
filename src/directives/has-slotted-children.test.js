import { defineCE, elementUpdated } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { describe, expect, it } from 'vitest';
import { getElement } from '../../test/helpers/element-helper.js';
import { hasSlottedChildren } from './has-slotted-children.js';

describe('hasSlottedChildrenDirective', () => {
  it('Should set the right attribute when slot is used', async () => {
    const slot = defineCE(
      class extends LitElement {
        hasIsSlottedAttribute(name) {
          return this.shadowRoot.querySelector('.main').hasAttribute(`${name}-is-slotted`);
        }

        render() {
          return html`<div class="main" ${hasSlottedChildren()}><slot name="slotName"></slot></div>`;
        }
      },
    );

    const element = await getElement(`<${slot}><div slot="slotName">toto</div></${slot}>`);

    expect(element.hasIsSlottedAttribute('slotName')).toBe(true);
  });

  it('Should not set the attribute when slot is not used', async () => {
    const slot = defineCE(
      // eslint-disable-next-line wc/max-elements-per-file
      class extends LitElement {
        hasIsSlottedAttribute(name) {
          return this.shadowRoot.querySelector('.main').hasAttribute(`${name}-is-slotted`);
        }

        render() {
          return html`<div class="main" ${hasSlottedChildren()}><slot name="slotName"></slot></div>`;
        }
      },
    );

    const element = await getElement(`<${slot}><div>toto</div></${slot}>`);

    expect(element.hasIsSlottedAttribute('slotName')).toBe(false);
  });

  it('Should set the right attribute when stack slot is used', async () => {
    const slot = defineCE(
      // eslint-disable-next-line wc/max-elements-per-file
      class extends LitElement {
        hasIsSlottedAttribute(name) {
          return this.shadowRoot.querySelector('.main').hasAttribute(`${name}-is-slotted`);
        }

        render() {
          return html`<div class="main" ${hasSlottedChildren()}>
            <slot name="slotName"><slot name="innerSlotName"></slot></slot>
          </div>`;
        }
      },
    );

    const element = await getElement(`<${slot}><div slot="innerSlotName">toto</div></${slot}>`);

    expect(element.hasIsSlottedAttribute('slotName')).toBe(false);
    expect(element.hasIsSlottedAttribute('innerSlotName')).toBe(true);
  });

  it('Should set the default attribute when default slot is used', async () => {
    const slot = defineCE(
      // eslint-disable-next-line wc/max-elements-per-file
      class extends LitElement {
        hasDefaultIsSlottedAttribute() {
          return this.shadowRoot.querySelector('.main').hasAttribute(`is-slotted`);
        }

        render() {
          return html`<div class="main" ${hasSlottedChildren()}>
            <slot></slot>
          </div>`;
        }
      },
    );

    const element = await getElement(`<${slot}><div>toto</div></${slot}>`);

    expect(element.hasDefaultIsSlottedAttribute()).toBe(true);
  });

  it('Should remove the attribute when slot is not used anymore', async () => {
    const slot = defineCE(
      // eslint-disable-next-line wc/max-elements-per-file
      class extends LitElement {
        hasIsSlottedAttribute(name) {
          return this.shadowRoot.querySelector('.main').hasAttribute(`${name}-is-slotted`);
        }

        render() {
          return html`<div class="main" ${hasSlottedChildren()}><slot name="slotName"></slot></div>`;
        }
      },
    );

    const element = await getElement(`<${slot}><div slot="slotName">toto</div></${slot}>`);

    expect(element.hasIsSlottedAttribute('slotName')).toBe(true);

    element.innerHTML = 'toto';
    await elementUpdated(element);

    expect(element.hasIsSlottedAttribute('slotName')).toBe(false);
  });
});

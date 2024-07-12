import { expect } from '@bundled-es-modules/chai';
import { defineCE, fixture } from '@open-wc/testing-helpers';
import { LitElement, html } from 'lit';
import { findActiveElement, isParentOf } from '../src/lib/shadow-dom-utils.js';

describe('shadow-dom-utils', () => {
  const ce = defineCE(
    class extends LitElement {
      getButtonElement() {
        return this.shadowRoot.querySelector('button');
      }

      render() {
        return html`<button>button</button><slot></slot>`;
      }
    },
  );

  describe('findActiveElement', () => {
    it('should return button inside custom element', async () => {
      const element = await fixture(`<${ce}></${ce}>`);

      const elementInsideCustomElement = element.getButtonElement();
      elementInsideCustomElement.focus();
      expect(findActiveElement()).to.equal(elementInsideCustomElement);
      // the next line is just to demonstrate that document.activeElement stops to the custom element host (because of shadow dom isolation)
      expect(document.activeElement).to.equal(element);
    });

    it('should return button when deep inside custom element', async () => {
      await fixture(`<${ce}><${ce}><${ce} id="deepChild"></${ce}></${ce}></${ce}>`);
      const elementInsideCustomElement = document.querySelector('#deepChild').getButtonElement();
      elementInsideCustomElement.focus();
      expect(findActiveElement()).to.equal(elementInsideCustomElement);
    });

    it('should return button', async () => {
      const element = await fixture(`<button></button>`);
      element.focus();
      expect(findActiveElement()).to.equal(element);
    });

    it('should return null when focus it not a descendant', async () => {
      const element = await fixture(`<div id="child1"></div><button id="child2">button</button>`);
      document.querySelector('#child2').focus();
      expect(findActiveElement(element)).to.equal(null);
    });
  });

  describe('isParentOf', () => {
    it('should return false when child is the parent itself', async () => {
      const element = await fixture(`<div></div>`);
      expect(isParentOf(element, element)).to.equal(false);
    });

    it('should return true when child is first descendant of parent', async () => {
      const element = await fixture(`<div><span id="child"></span></div>`);
      expect(isParentOf(element, document.querySelector('#child'))).to.equal(true);
    });

    it('should return true when child is deep descendant of parent', async () => {
      const element = await fixture(`<div><div><div><span id="child"></span></div></div></div>`);
      expect(isParentOf(element, document.querySelector('#child'))).to.equal(true);
    });

    it('should return false when child is not a descendant', async () => {
      await fixture(`<div id="child1"></div><div id="child2"></div>`);
      expect(isParentOf(document.querySelector('#child1'), document.querySelector('#child2'))).to.equal(false);
    });

    it('should return true when child is a custom element', async () => {
      const element = await fixture(`<div><${ce} id="child"></${ce}></div>`);
      expect(isParentOf(element, document.querySelector('#child'))).to.equal(true);
    });

    it('should return true when child is inside a custom element', async () => {
      const element = await fixture(`<${ce} id="child"></${ce}>`);
      expect(isParentOf(element, document.querySelector('#child').getButtonElement())).to.equal(true);
    });

    it('should return true when child is deep inside a custom element', async () => {
      const element = await fixture(`<${ce}><${ce}><${ce} id="child"></${ce}></${ce}></${ce}>`);
      expect(isParentOf(element, document.querySelector('#child').getButtonElement())).to.equal(true);
    });
  });
});

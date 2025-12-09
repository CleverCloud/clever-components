import { expect } from '@bundled-es-modules/chai';
import { defineCE, fixture } from '@open-wc/testing-helpers';
import { LitElement, html } from 'lit';
import { findActiveElement, isParentOf, querySelectorDeep } from '../src/lib/shadow-dom-utils.js';

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

  describe('querySelectorDeep', () => {
    it('should return element when selector matches in root', async () => {
      const element = await fixture(`<div><span id="target"></span></div>`);
      expect(querySelectorDeep('#target', element)).to.equal(element.querySelector('#target'));
    });

    it('should return null when selector does not match anything', async () => {
      const element = await fixture(`<div></div>`);
      expect(querySelectorDeep('#nonexistent', element)).to.equal(null);
    });

    it('should return first element when multiple elements match', async () => {
      const element = await fixture(
        `<div><span class="item" id="first"></span><span class="item" id="second"></span></div>`,
      );
      expect(querySelectorDeep('.item', element)).to.equal(element.querySelector('#first'));
    });

    it('should find element inside a custom element shadow DOM', async () => {
      const element = await fixture(`<${ce}></${ce}>`);
      expect(querySelectorDeep('button', element)).to.equal(element.getButtonElement());
    });

    it('should find element deep inside nested custom elements', async () => {
      const element = await fixture(`<${ce}><${ce}><${ce} id="deepChild"></${ce}></${ce}></${ce}>`);
      expect(querySelectorDeep('button', element)).to.equal(element.getButtonElement());
    });

    it('should find slotted content', async () => {
      const element = await fixture(`<${ce}><span id="slotted"></span></${ce}>`);
      expect(querySelectorDeep('#slotted', element)).to.equal(element.querySelector('#slotted'));
    });

    it('should work with a custom root element', async () => {
      const element = await fixture(
        `<div><div id="branch1"><span id="target"></span></div><div id="branch2"></div></div>`,
      );
      const branch1 = element.querySelector('#branch1');
      const branch2 = element.querySelector('#branch2');
      expect(querySelectorDeep('#target', branch1)).to.equal(element.querySelector('#target'));
      expect(querySelectorDeep('#target', branch2)).to.equal(null);
    });

    it('should return null when searching in an empty root', async () => {
      const element = await fixture(`<div></div>`);
      expect(querySelectorDeep('*', element)).to.equal(null);
    });

    it('should work with different selector types', async () => {
      const element = await fixture(`<div><span id="by-id" class="by-class" data-test="value"></span></div>`);
      const target = element.querySelector('#by-id');
      expect(querySelectorDeep('#by-id', element)).to.equal(target);
      expect(querySelectorDeep('.by-class', element)).to.equal(target);
      expect(querySelectorDeep('span', element)).to.equal(target);
      expect(querySelectorDeep('[data-test]', element)).to.equal(target);
    });
  });
});

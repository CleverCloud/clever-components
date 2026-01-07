import { LitElement, html } from 'lit';
import { describe, expect, it } from 'vitest';
import { defineCE, fixture } from './helpers/element-helper.js';
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
      const element = await fixture(html`<${ce}></${ce}>`);

      const elementInsideCustomElement = element.getButtonElement();
      elementInsideCustomElement.focus();
      expect(findActiveElement()).toBe(elementInsideCustomElement);
      // the next line is just to demonstrate that document.activeElement stops to the custom element host (because of shadow dom isolation)
      expect(document.activeElement).toBe(element);
    });

    it('should return button when deep inside custom element', async () => {
      await fixture(html`<${ce}><${ce}><${ce} id="deepChild"></${ce}></${ce}></${ce}>`);
      const elementInsideCustomElement = document.querySelector('#deepChild').getButtonElement();
      elementInsideCustomElement.focus();
      expect(findActiveElement()).toBe(elementInsideCustomElement);
    });

    it('should return button', async () => {
      const element = await fixture(html`<button></button>`);
      element.focus();
      expect(findActiveElement()).toBe(element);
    });

    it('should return null when focus it not a descendant', async () => {
      const element = await fixture(html`<div id="child1"></div><button id="child2">button</button>`);
      document.querySelector('#child2').focus();
      expect(findActiveElement(element)).toBe(null);
    });
  });

  describe('isParentOf', () => {
    it('should return false when child is the parent itself', async () => {
      const element = await fixture(html`<div></div>`);
      expect(isParentOf(element, element)).toBe(false);
    });

    it('should return true when child is first descendant of parent', async () => {
      const element = await fixture(html`<div><span id="child"></span></div>`);
      expect(isParentOf(element, document.querySelector('#child'))).toBe(true);
    });

    it('should return true when child is deep descendant of parent', async () => {
      const element = await fixture(html`<div><div><div><span id="child"></span></div></div></div>`);
      expect(isParentOf(element, document.querySelector('#child'))).toBe(true);
    });

    it('should return false when child is not a descendant', async () => {
      await fixture(html`<div id="child1"></div><div id="child2"></div>`);
      expect(isParentOf(document.querySelector('#child1'), document.querySelector('#child2'))).toBe(false);
    });

    it('should return true when child is a custom element', async () => {
      const element = await fixture(html`<div><${ce} id="child"></${ce}></div>`);
      expect(isParentOf(element, document.querySelector('#child'))).toBe(true);
    });

    it('should return true when child is inside a custom element', async () => {
      const element = await fixture(html`<${ce} id="child"></${ce}>`);
      expect(isParentOf(element, document.querySelector('#child').getButtonElement())).toBe(true);
    });

    it('should return true when child is deep inside a custom element', async () => {
      const element = await fixture(html`<${ce}><${ce}><${ce} id="child"></${ce}></${ce}></${ce}>`);
      expect(isParentOf(element, document.querySelector('#child').getButtonElement())).toBe(true);
    });
  });

  describe('querySelectorDeep', () => {
    it('should return element when selector matches in root', async () => {
      const element = await fixture(html`<div><span id="target"></span></div>`);
      expect(querySelectorDeep('#target', element)).toBe(element.querySelector('#target'));
    });

    it('should return null when selector does not match anything', async () => {
      const element = await fixture(html`<div></div>`);
      expect(querySelectorDeep('#nonexistent', element)).toBe(null);
    });

    it('should return first element when multiple elements match', async () => {
      const element = await fixture(
        html`<div><span class="item" id="first"></span><span class="item" id="second"></span></div>`,
      );
      expect(querySelectorDeep('.item', element)).toBe(element.querySelector('#first'));
    });

    it('should find element inside a custom element shadow DOM', async () => {
      const element = await fixture(html`<${ce}></${ce}>`);
      expect(querySelectorDeep('button', element)).toBe(element.getButtonElement());
    });

    it('should find element deep inside nested custom elements', async () => {
      const element = await fixture(html`<${ce}><${ce}><${ce} id="deepChild"></${ce}></${ce}></${ce}>`);
      expect(querySelectorDeep('button', element)).toBe(element.getButtonElement());
    });

    it('should find slotted content', async () => {
      const element = await fixture(html`<${ce}><span id="slotted"></span></${ce}>`);
      expect(querySelectorDeep('#slotted', element)).toBe(element.querySelector('#slotted'));
    });

    it('should work with a custom root element', async () => {
      const element = await fixture(
        html`<div><div id="branch1"><span id="target"></span></div><div id="branch2"></div></div>`,
      );
      const branch1 = element.querySelector('#branch1');
      const branch2 = element.querySelector('#branch2');
      expect(querySelectorDeep('#target', branch1)).toBe(element.querySelector('#target'));
      expect(querySelectorDeep('#target', branch2)).toBe(null);
    });

    it('should return null when searching in an empty root', async () => {
      const element = await fixture(html`<div></div>`);
      expect(querySelectorDeep('*', element)).toBe(null);
    });

    it('should work with different selector types', async () => {
      const element = await fixture(html`<div><span id="by-id" class="by-class" data-test="value"></span></div>`);
      const target = element.querySelector('#by-id');
      expect(querySelectorDeep('#by-id', element)).toBe(target);
      expect(querySelectorDeep('.by-class', element)).toBe(target);
      expect(querySelectorDeep('span', element)).toBe(target);
      expect(querySelectorDeep('[data-test]', element)).toBe(target);
    });
  });
});

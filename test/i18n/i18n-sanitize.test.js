import { describe, expect, it } from 'vitest';
import { sanitize } from '../../src/lib/i18n/i18n-sanitize.js';

function compareChildNodes(domFragment, referenceChildNodes) {
  expect(domFragment.childNodes.length).toBe(referenceChildNodes.length);

  referenceChildNodes.forEach((referenceNode, i) => {
    const realNode = domFragment.childNodes[i];

    if (typeof referenceNode === 'string') {
      const text = referenceNode;
      expect(realNode.nodeType).toBe(document.TEXT_NODE);
      expect(realNode.data).toBe(text);
    } else {
      const [tag, children, referenceAttributes] = referenceNode;
      expect(realNode.nodeType).toBe(document.ELEMENT_NODE);
      expect(realNode.tagName.toLowerCase()).toBe(tag);

      if (referenceAttributes != null) {
        expect(realNode.attributes.length).toBe(referenceAttributes.length);
        Array.from(referenceAttributes).forEach(([attrName, attrValue]) => {
          expect(realNode.getAttribute(attrName)).toBe(attrValue);
        });
      }

      compareChildNodes(realNode, children);
    }
  });
}

describe('filter', () => {
  it('Normal text (no HTML)', () => {
    compareChildNodes(sanitize`One Two Three Four Five Six`, ['One Two Three Four Five Six']);
  });

  it('Authorize <strong>', () => {
    compareChildNodes(sanitize`One <strong>Two</strong> Three Four Five Six`, [
      'One ',
      ['strong', ['Two']],
      ' Three Four Five Six',
    ]);
  });

  it('Authorize <em>', () => {
    compareChildNodes(sanitize`One Two <em>Three</em> Four Five Six`, [
      'One Two ',
      ['em', ['Three']],
      ' Four Five Six',
    ]);
  });

  it('Authorize <code>', () => {
    compareChildNodes(sanitize`One Two Three <code>Four</code> Five Six`, [
      'One Two Three ',
      ['code', ['Four']],
      ' Five Six',
    ]);
  });

  it('Authorize <cc-link>', () => {
    compareChildNodes(sanitize`One Two Three Four <cc-link>Five</cc-link> Six`, [
      'One Two Three Four ',
      ['cc-link', ['Five']],
      ' Six',
    ]);
  });

  it('Replace non-authorized tags with a text node and escape the contents', () => {
    compareChildNodes(
      sanitize`One <div><strong>Two</strong></div> <pre><em>Three</em></pre> <h1><code>Four</code></h1> <div><code>Five</code></div> <section><a>Six</a></section>`,
      ['One Two Three Four Five Six'],
    );
  });

  it('Remove all attributes on authorized tags', () => {
    compareChildNodes(
      sanitize`One <strong href="/foo" onclick="alert('xss')">Two</strong> <em foo-attribute="bar">Three</em> <code class="the-class">Four</code> <cc-link>Five</cc-link> Six`,
      [
        'One ',
        ['strong', ['Two'], []],
        ' ',
        ['em', ['Three'], []],
        ' ',
        ['code', ['Four'], []],
        ' ',
        ['cc-link', ['Five'], []],
        ' Six',
      ],
    );
  });

  it('Keep title attribute on authorized tags', () => {
    compareChildNodes(
      sanitize`One <strong title="strong-title">Two</strong> <em title="em-title">Three</em> <code title="code-title">Four</code> <cc-link a11y-desc="a-title">Five</cc-link> Six`,
      [
        'One ',
        ['strong', ['Two'], [['title', 'strong-title']]],
        ' ',
        ['em', ['Three'], [['title', 'em-title']]],
        ' ',
        ['code', ['Four'], [['title', 'code-title']]],
        ' ',
        ['cc-link', ['Five'], [['a11y-desc', 'a-title']]],
        ' Six',
      ],
    );
  });

  it('Only keep href and title (a11y-desc) attributes on <cc-link> (remove every other attributes)', () => {
    compareChildNodes(
      sanitize`One Two Three Four <cc-link href="/foobar" download id="the-id" target="foobar" a11y-desc="a-title">Five</cc-link> Six`,
      [
        'One Two Three Four ',
        [
          'cc-link',
          ['Five'],
          [
            ['href', '/foobar'],
            ['a11y-desc', 'a-title'],
          ],
        ],
        ' Six',
      ],
    );
  });

  it('Everything that comes from params must be escaped (even authorized tags)', () => {
    const one = '<h1>One</h1>';
    const two = '<strong>Two</strong>';
    const three = '<em>Three</em>';
    const four = '<code>Four</code>';
    const five = '<a>Five</a>';
    const six = '<pre>Six</pre>';
    compareChildNodes(sanitize`${one} ${two} ${three} ${four} ${five} ${six}`, [
      '<h1>One</h1> <strong>Two</strong> <em>Three</em> <code>Four</code> <a>Five</a> <pre>Six</pre>',
    ]);
  });
});

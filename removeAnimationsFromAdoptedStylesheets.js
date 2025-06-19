clever-components--gh-actions/removeAnimationsFromAdoptedStylesheets.js
/**
 * Remove all @keyframes and animation-related rules from adopted stylesheets,
 * recursively including nested shadow roots.
 *
 * This function mutates constructable stylesheets (created via new CSSStyleSheet())
 * attached to the document or any shadow root via adoptedStyleSheets.
 *
 * Usage:
 *   removeAnimationsFromAdoptedStylesheets();
 */

function removeAnimationsFromAdoptedStylesheets(root = document) {
  /**
   * Remove @keyframes and animation-related rules from a single constructable stylesheet.
   * @param {CSSStyleSheet} sheet
   */
  function cleanSheet(sheet) {
    // Iterate backwards to avoid index issues when deleting rules
    for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
      const rule = sheet.cssRules[i];

      // Remove @keyframes rules (including vendor-prefixed)
      if (
        rule.type === CSSRule.KEYFRAMES_RULE ||
        rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE
      ) {
        sheet.deleteRule(i);
        continue;
      }

      // Remove style rules with animation or animation-* properties
      if (rule.type === CSSRule.STYLE_RULE) {
        const style = rule.style;
        let hasAnimation = false;

        // Check for 'animation' shorthand
        if (style.getPropertyValue('animation')) {
          hasAnimation = true;
        } else {
          // Check for any 'animation-*' property
          for (let j = 0; j < style.length; j++) {
            const prop = style[j];
            if (prop.startsWith('animation-')) {
              hasAnimation = true;
              break;
            }
          }
        }

        if (hasAnimation) {
          sheet.deleteRule(i);
        }
      }
    }
  }

  // Clean all constructable adopted stylesheets in this root
  if (root.adoptedStyleSheets) {
    for (const sheet of root.adoptedStyleSheets) {
      // Only constructable stylesheets are mutable (have replaceSync/insertRule)
      if (typeof sheet.replaceSync === 'function' || typeof sheet.insertRule === 'function') {
        try {
          cleanSheet(sheet);
        } catch (e) {
          // Ignore errors (e.g., CORS-protected sheets)
        }
      }
    }
  }

  // Recurse into shadow roots
  const tree = root === document ? root.body : root;
  if (tree) {
    const walker = document.createTreeWalker(
      tree,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.shadowRoot) {
        removeAnimationsFromAdoptedStylesheets(node.shadowRoot);
      }
    }
  }
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = removeAnimationsFromAdoptedStylesheets;
}
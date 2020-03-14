/* global globalThis */
const WHITELISTED_TAGS = ['STRONG', 'EM', 'CODE', 'A', 'BR'];

// Reuse one text node to escape HTML
const escapeHtml = (() => {

  // When used in node and document is not accessible, just return early
  if (globalThis.document == null) {
    return () => '';
  }

  // Idea came from lit-html.
  // Text node needs to be in a <span> (it would fail in <style> or <script>).
  const span = document.createElement('span');
  const textNode = document.createTextNode('');
  span.appendChild(textNode);

  return (dirtyHtml) => {
    textNode.data = dirtyHtml;
    return span.innerHTML;
  };
})();

// If sibling is text, get text content and remove if from the DOM
function absorbTextSibling (sibling) {
  if (sibling != null && sibling.nodeType === document.TEXT_NODE) {
    sibling.parentNode.removeChild(sibling);
    return sibling.data;
  }
  return '';
}

export function sanitize (statics, ...params) {

  let html = '';
  for (let i = 0; i < statics.length; i++) {
    html += statics[i];
    if (params[i] != null) {
      html += escapeHtml(params[i]);
    }
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  Array
    .from(template.content.querySelectorAll('*'))
    .forEach((node) => {

      // If tag is not whitelisted, transform it to a text node and merge it with previous and/or next siblings if they are text nodes
      if (!WHITELISTED_TAGS.includes(node.tagName)) {

        const previousText = absorbTextSibling(node.previousSibling);
        const nextText = absorbTextSibling(node.nextSibling);

        const newTextNode = document.createTextNode(previousText + node.textContent + nextText);
        node.parentNode.replaceChild(newTextNode, node);

        console.warn(`Node <${node.tagName.toLowerCase()}> is not allowed in translations!`);
      }
      else {

        // Whitelisted attributes: *[title] and a[href]
        Array
          .from(node.attributes)
          .filter((attr) => attr.name !== 'title' && (node.tagName !== 'A' || attr.name !== 'href'))
          .forEach((attr) => {
            console.warn(`Attribute ${attr.name} is not allowed on <${node.tagName.toLowerCase()}> in translations!`);
            return node.removeAttribute(attr.name);
          });

        // If link has href and external origin => force rel and target
        if (node.tagName === 'A' && node.getAttribute('href') != null && node.origin !== window.location.origin) {
          node.classList.add('sanitized-link');
          node.setAttribute('rel', 'noopener noreferrer');
          node.setAttribute('target', '_blank');
        }
      }
    });

  return template.content.cloneNode(true);
}

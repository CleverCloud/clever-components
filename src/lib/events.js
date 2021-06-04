/**
 * Send a custom event in the format node => tagName:eventSuffix
 * @param {HTMLElement} node
 * @param {String} eventNameOrSuffix - In case of an eventName it will dispatch the event associated to the node or dispatch the event directly if there's a suffix in the eventName
 * @param detail
 */
export function dispatchCustomEvent (node, eventNameOrSuffix, detail) {
  const eventName = eventNameOrSuffix.includes(':')
    ? eventNameOrSuffix
    : `${node.nodeName.toLocaleLowerCase()}:${eventNameOrSuffix}`;
  node.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true }));
}

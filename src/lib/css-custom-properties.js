/**
 * Get an object literally with CSS custom properties and their values
 * @param {HTMLElement} element
 * @returns {any}
 */
export function getCssCustomProperties (element) {
  const styles = getComputedStyle(element);
  const entries = Object
    .values(styles)
    .filter((name) => name.startsWith('--'))
    .map((name) => [name, styles.getPropertyValue(name)]);
  return Object.fromEntries(entries);
}

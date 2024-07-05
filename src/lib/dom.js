const timeoutCache = new WeakMap();

export function scrollChildIntoParent(parent, child) {
  const oldTimeoutId = timeoutCache.get(parent);
  clearTimeout(oldTimeoutId);

  const newTimeoutId = setTimeout(() => {
    if (child == null) {
      return;
    }
    doScrollChildIntoParent(parent, child);
  }, 200);

  timeoutCache.set(parent, newTimeoutId);
}

function doScrollChildIntoParent(parent, child) {
  // In our situation, we don't need to handle borders and paddings
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  if (childRect.top < parentRect.top) {
    const top = childRect.top - parentRect.top;
    parent.scrollBy({ top, behavior: 'smooth' });
  } else if (childRect.bottom > parentRect.bottom && childRect.top > parentRect.top) {
    const top = childRect.bottom - parentRect.bottom;
    parent.scrollBy({ top, behavior: 'smooth' });
  }
}

/**
 * @param {HTMLElement} element
 * @param {string} clazz
 * @return {boolean}
 */
export function hasClass(element, clazz) {
  return element.classList?.contains(clazz) ?? false;
}

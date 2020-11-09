const timeoutCache = new WeakMap();

export function scrollIntoView (parent, element) {

  const oldTimeoutId = timeoutCache.get(parent);
  clearTimeout(oldTimeoutId);

  const newTimeoutId = setTimeout(() => {
    if (element == null) {
      return;
    }
    // Don't scroll if parent is not scrollable
    if (parent.scrollHeight <= parent.offsetHeight) {
      return;
    }
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, 200);

  timeoutCache.set(parent, newTimeoutId);
}

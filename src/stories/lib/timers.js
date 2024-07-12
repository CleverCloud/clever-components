export function setTimeoutDom(fn, delay, domNode) {
  const id = setTimeout(() => {
    if (domNode.parentNode == null) {
      clearTimeout(id);
    } else {
      fn();
    }
  }, delay);
  return id;
}

export function setIntervalDom(fn, delay, domNode) {
  const id = setInterval(() => {
    if (domNode.parentNode == null) {
      clearInterval(id);
    } else {
      fn();
    }
  }, delay);
  return id;
}

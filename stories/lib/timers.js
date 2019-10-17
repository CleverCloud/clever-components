export function setTimeoutDom (fn, delay, domNode) {
  const id = setTimeout(() => {
    if (domNode.parentElement == null) {
      clearTimeout(id);
    }
    else {
      fn();
    }
  }, delay);
  return id;
}

export function setIntervalDom (fn, delay, domNode) {
  const id = setInterval(() => {
    if (domNode.parentElement == null) {
      clearInterval(id);
    }
    else {
      fn();
    }
  }, delay);
  return id;
}

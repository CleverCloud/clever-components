export function createContainer (elements) {
  const frag = document.createDocumentFragment();
  elements.forEach((el) => {
    if (typeof el === 'string') {
      const title = document.createElement('div');
      title.classList.add('title');
      title.innerHTML = el;
      frag.appendChild(title);
    }
    else {
      frag.appendChild(el);
    }
  });
  return frag;
}

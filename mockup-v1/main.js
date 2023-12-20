const menu = document.body.querySelector('menu');
menu.addEventListener('click', () => {
  if (menu.hasAttribute('open')) {
    menu.removeAttribute('open');
  }
  else {
    menu.setAttribute('open', '');
  }
});

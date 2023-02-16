
export async function copyToClipboard (text, html = null) {
  if (navigator.clipboard.write != null) {
    const items = {
      'text/plain': new Blob([text], { type: 'text/plain' }),
    };
    if (html != null) {
      items['text/html'] = new Blob([html], { type: 'text/html' });
    }
    // eslint-disable-next-line no-undef
    await navigator.clipboard.write([new ClipboardItem(items)]);
  }
  else if (document.execCommand != null) {
    const listener = (e) => {
      e.clipboardData.setData('text/plain', text);
      if (html != null) {
        e.clipboardData.setData('text/html', html);
      }
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }
  else {
    await navigator.clipboard.writeText(text);
  }
}

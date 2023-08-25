
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

/**
 * Constructs two versions of the lines of text:
 *
 * * A text version which is the lines joined with a carriage return.
 * * A html version
 *
 * @param {Array<string>} lines
 * @return {{text: string, html: string}}
 */
export function prepareLinesOfCodeForClipboard (lines) {
  const text = lines.join('\n');
  const html = formatLinesOfCodeToHtml(lines);
  return { text, html };
}

/**
 * Transforms the given lines into html. Useful when putting a html version of a text inside clipboard.
 */
export function formatLinesOfCodeToHtml (lines) {
  if (lines.length === 0) {
    return '';
  }
  if (lines.length === 1) {
    return `<code>${lines[0]}</code>`;
  }
  return `<pre>${lines.join('<br>')}</pre>`;
}

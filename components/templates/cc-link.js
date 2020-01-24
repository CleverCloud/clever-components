import { classMap } from 'lit-html/directives/class-map.js';
import { css, html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

function isDifferentOrigin (rawUrl) {
  try {
    const url = new URL(rawUrl, location.href);
    return (url.origin !== location.origin);
  }
  catch (e) {
    // Consider bad URLs as different origin
    return true;
  }
}

// NOTE: we could just create raw DOM but here we benefit from lit-html safe/escaping system on "content"
export const ccLink = (url, content, skeleton = false) => {
  const href = (url != null) ? url : undefined;
  const target = isDifferentOrigin(href) ? '_blank' : undefined;
  const rel = isDifferentOrigin(href) ? 'noopener noreferrer' : undefined;
  return html`<a class="cc-link ${classMap({ skeleton })}" href=${ifDefined(href)} target=${ifDefined(target)} rel=${ifDefined(rel)}>${content}</a>`;
};

// language=CSS
export const linkStyles = css`

  .cc-link {
    --color: hsl(209, 98%, 40%);
    color: var(--color);
  }

  .cc-link:hover {
    color: hsl(209, 98%, 25%);
  }

  .cc-link:focus {
    background-color: #fff;
    border-radius: 0.1rem;
    box-shadow: 0 0 0 .1rem #fff, 0 0 0 .3rem rgba(50, 115, 220, .25);
    outline: 0;
  }

  .cc-link::-moz-focus-inner {
    border: 0;
  }

  .cc-link.skeleton,
  .cc-link .skeleton {
    color: var(--color);
    background-color: var(--color);
  }
`;

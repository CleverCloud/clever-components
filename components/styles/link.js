import { css } from 'lit-element';

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

  .cc-link.skeleton {
    color: var(--color);
    background-color: var(--color);
  }
`;

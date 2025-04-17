import { css } from 'lit';

// language=CSS
export const cliCommands = css`
  cc-block-details a {
    color: var(--cc-color-text-primary-highlight, blue);
  }
  cc-block-details p {
    margin: 0;
  }
  cc-block-details dt {
    font-weight: bold;
  }
  cc-block-details dd {
    margin: 0;
    padding: 1em 0;
  }
  cc-block-details dl {
    margin: 0;
  }
  cc-block-details code {
    padding: 0.5em 1em;
    display: block;
  }
`;

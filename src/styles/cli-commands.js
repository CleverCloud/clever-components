import { css } from 'lit';

// language=CSS
export const cliCommandsStyles = css`
  cc-block-details a {
    color: var(--cc-color-text-primary-highlight, blue);
  }
  cc-block-details p {
    margin: 0;
  }
  cc-block-details dt {
    font-weight: bold;
    margin: 1em 0 0.5em 0;
  }
  cc-block-details dd {
    margin: 0;
  }
  cc-block-details dl {
    margin: 0;
  }
  cc-block-details code {
    padding: 0.5em 1em;
    display: block;
    border: 1px solid #dcdcdc;
    background-color: var(--cc-color-bg-neutral);
    border-radius: var(--cc-border-radius-default, 0.25em);
    font-family: var(--cc-ff-monospace);
  }
`;

import { css } from 'lit';

// language=CSS
export const cliCommandsStyles = css`
  cc-block-details [slot='content'] p {
    margin: 0;
  }

  cc-block-details [slot='content'] dl,
  cc-block-details [slot='content'] dt,
  cc-block-details [slot='content'] dd {
    margin: 0;
    padding: 0;
  }

  cc-block-details [slot='content'] dt {
    font-weight: bold;
    margin: 1em 0 0.5em;
  }
`;

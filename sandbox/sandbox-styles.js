import { css } from 'lit';

// language=CSS
export const sandboxStyles = css`
  :host {
    display: grid;
    gap: 1em;
    grid-template-areas:
      'ctrl-top .'
      'main     ctrl-right';
    grid-template-columns: 1fr max-content;
    grid-template-rows: max-content 1fr;
  }

  .ctrl-top {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    grid-area: ctrl-top;
  }

  .ctrl-right {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    grid-area: ctrl-right;
  }

  .main {
    border: 1px solid #555;
    grid-area: main;
    padding: 0.5em;
  }
`;

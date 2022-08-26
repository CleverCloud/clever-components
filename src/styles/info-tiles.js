import { css } from 'lit';

// language=CSS
export const tileStyles = css`
  :host {
    background-color: var(--cc-color-bg-default, #fff);
    border: 1px solid #bcc2d1;
    border-radius: 0.25em;
    box-sizing: border-box;
    display: grid;
    grid-gap: 1em;
    grid-template-rows: auto 1fr;
    min-height: 9em;
    overflow: hidden;
    padding: 1em;
  }

  .tile_title {
    color: var(--cc-color-text-weak);
    font-size: 1.25em;
    text-align: center;
  }
  
  .tile_title--image {
    text-align: left;
  }

  .tile_body {
    align-content: center;
    display: grid;
  }

  .tile_message {
    align-self: center;
    text-align: center;
  }
`;

// language=CSS
export const instanceDetailsStyles = css`
  :host {
    --bubble-d: 1.5em;
    --bubble-r: calc(var(--bubble-d) / 2);
  }

  .size-label {
    background-color: var(--cc-color-bg-neutral);
    border: 1px solid #484848;
    border-radius: 0.25em;
    box-sizing: border-box;
    display: block;
    font-weight: bold;
    height: 1.65em;
    line-height: 1.65em;
    padding: 0 var(--bubble-r);
    text-align: center;
  }

  .count-bubble {
    background-color: var(--color-legacy-grey, #000);
    border-radius: 50%;
    color: var(--cc-color-text-inverted, #fff);
    display: block;
    font-weight: bold;
    height: var(--bubble-d);
    line-height: var(--bubble-d);
    text-align: center;
    width: var(--bubble-d);
  }
`;

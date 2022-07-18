import { css } from 'lit-element';

// language=CSS
export const tileStyles = css`
  :host {
    background-color: var(--cc-color-bg-default, #fff);
    border: 1px solid #bcc2d1;
    border-radius: 0.25rem;
    box-sizing: border-box;
    display: grid;
    grid-gap: 1rem;
    grid-template-rows: auto 1fr;
    min-height: 9rem;
    overflow: hidden;
    padding: 1rem;
  }

  .tile_title {
    color: var(--cc-color-text-weak);
    font-size: 1.25rem;
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
    --bubble-d: 1.5rem;
    --bubble-r: calc(var(--bubble-d) / 2);
  }

  .size-label {
    background-color: var(--cc-color-bg-neutral);
    border: 1px solid #484848;
    border-radius: 0.25rem;
    box-sizing: border-box;
    display: block;
    font-weight: bold;
    height: 1.65rem;
    line-height: 1.65rem;
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

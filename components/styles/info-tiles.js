import { css } from 'lit-element';

// language=CSS
export const tileStyles = css`
  :host {
    background-color: #fff;
    border-radius: 0.25rem;
    border: 1px solid #bcc2d1;
    box-sizing: border-box;
    display: grid;
    grid-gap: 1rem;
    grid-template-rows: auto 1fr;
    min-height: 9rem;
    overflow: hidden;
    padding: 1rem;
  }

  .tile_title {
    color: #5D5D5D;
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
export const instanceDetails = css`
  :host {
    --bubble-d: 1.5rem;
    --bubble-r: calc(var(--bubble-d) / 2);
  }

  .size-label {
    background-color: #EAEAEA;
    border-radius: 0.25rem;
    border: 1px solid #484848;
    box-sizing: border-box;
    display: block;
    font-weight: bold;
    height: 1.65rem;
    line-height: 1.65rem;
    padding: 0 var(--bubble-r);
    text-align: center;
  }

  .count-bubble {
    background-color: #8C8C8C;
    border-radius: 50%;
    color: #fff;
    display: block;
    font-weight: bold;
    height: var(--bubble-d);
    line-height: var(--bubble-d);
    text-align: center;
    width: var(--bubble-d);
  }
`;

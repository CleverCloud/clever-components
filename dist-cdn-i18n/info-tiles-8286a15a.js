import{i as e}from"./lit-element-98ed46d4.js";const r=e`
  :host {
    display: grid;
    overflow: hidden;
    min-height: 9em;
    box-sizing: border-box;
    padding: 1em;
    border: 1px solid var(--cc-color-border-neutral, #aaa);
    background-color: var(--cc-color-bg-default, #fff);
    border-radius: var(--cc-border-radius-default, 0.25em);
    grid-gap: 1em;
    grid-template-rows: auto 1fr;
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
    display: grid;
    align-content: center;
  }

  .tile_message {
    align-self: center;
    text-align: center;
  }
`,o=e`
  :host {
    --bubble-d: 1.5em;
    --bubble-r: calc(var(--bubble-d) / 2);
  }

  .size-label {
    display: block;
    height: 1.65em;
    box-sizing: border-box;
    padding: 0 var(--bubble-r);
    border: 1px solid var(--cc-color-border-neutral, #aaa);
    background-color: var(--cc-color-bg-neutral);
    border-radius: var(--cc-border-radius-default, 0.25em);
    font-weight: bold;
    line-height: 1.65em;
    text-align: center;
  }

  .count-bubble {
    display: block;
    width: var(--bubble-d);
    height: var(--bubble-d);
    background-color: var(--color-legacy-grey, #000);
    border-radius: 50%;
    color: var(--cc-color-text-inverted, #fff);
    font-weight: bold;
    line-height: var(--bubble-d);
    text-align: center;
  }
`;export{o as i,r as t};

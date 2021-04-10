import { css } from 'lit-element';

// NOTES:
// * This is undocumented and private for now
// * Users won't be able to override these without setting it on each custom elements (if and when they have access to them)

// language=CSS
export const defaultThemeStyles = css`
  :host {
    --cc-ff-monospace: "SourceCodePro", "monaco", monospace;
  }
`;

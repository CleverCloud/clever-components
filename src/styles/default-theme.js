import { css } from 'lit-element';

// NOTES:
// * This is undocumented and private for now
// * Users won't be able to override these without setting it on each custom elements (if and when they have access to them)

// language=CSS
export const defaultThemeStyles = css`
  :host {
    --cc-ff-monospace: "SourceCodePro", "monaco", monospace;
    --cc-chart-color-skeleton: #bbb;
    --cc-chart-color-lightgray: #bbb;
    --cc-chart-color-green: #30ab61;
    --cc-chart-color-blue: #365bd3;
    --cc-chart-color-orange: #ff9f40;
    --cc-chart-color-red: #cf3942;
  }
`;

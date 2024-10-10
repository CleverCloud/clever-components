import { css } from 'lit';

// language=CSS
export const accessibilityStyles = css`
  .visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    top: 0; /* this fixes a bug in Chrome when this style is used into a grid element (and has overflow) */
    white-space: nowrap;
    width: 1px;
  }
`;

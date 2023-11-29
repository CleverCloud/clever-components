import { css } from 'lit';

// language=CSS
export const accessibilityStyles = css`
  .visually-hidden {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

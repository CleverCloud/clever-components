import { css } from 'lit';

// language=CSS
export const accessibilityStyles = css`
  .visually-hidden,
  .visually-hidden-focusable {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .visually-hidden-focusable:focus,
  .visually-hidden-focusable:active {
    position: unset;
    overflow: visible;
    width: auto;
    height: auto;
    margin: auto;
    clip: auto;
    clip-path: none;
    white-space: normal;
  }
`;

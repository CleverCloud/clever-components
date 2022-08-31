import { css, unsafeCSS } from 'lit';

export const innerSkeletonStyles = unsafeCSS(`
  animation-direction: alternate;
  animation-duration: 500ms;
  animation-iteration-count: infinite;
  animation-name: skeleton-pulse;
  animation-play-state: var(--cc-skeleton-state, running);
  color: transparent !important;
  cursor: progress;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`);

// language=CSS
export const skeletonPulseStyles = css`
  @keyframes skeleton-pulse {
    from {
      opacity: 0.85;
    }

    to {
      opacity: 0.45;
    }
  }
`;

// language=CSS
export const skeletonStyles = css`
  ${skeletonPulseStyles}

  .skeleton {
    ${innerSkeletonStyles};
  }
`;

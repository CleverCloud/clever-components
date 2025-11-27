import { css } from 'lit';

// language=CSS
export const skeletonStyles = css`
  @keyframes skeleton-pulse {
    from {
      opacity: 0.85;
    }

    to {
      opacity: 0.45;
    }
  }

  /* FIXME: temporary solution for Safari until we build a directive for skeletons. See https://github.com/CleverCloud/clever-components/issues/1111 for more info */
  * {
    animation: none;
  }

  .skeleton {
    animation-direction: alternate;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-name: skeleton-pulse;
    animation-play-state: var(--cc-skeleton-state, running);
    color: transparent;
    cursor: progress;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

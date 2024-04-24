import { css } from 'lit';

// language=CSS
export const waitingStyles = css`
  @keyframes waiting {
    from {
      opacity: 0.85;
    }

    to {
      opacity: 1;
    }
  }

  .cc-waiting {
    animation-direction: alternate;
    animation-duration: 500ms;
    animation-iteration-count: infinite;
    animation-name: waiting;
  }
`;

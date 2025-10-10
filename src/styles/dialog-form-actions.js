import { css } from 'lit';

/**
 * Shared styles for dialog form components.
 *
 * IMPORTANT: These styles depend on a container named "dialog"
 * being established by the parent cc-dialog component.
 * This container targets the `dialog` element within cc-dialog.
 * Components using these styles must be slotted within cc-dialog.
 */
export const dialogFormStyles = css`
  .dialog-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: end;
    margin-top: 3.75em;
  }

  @container dialog (max-width: 37em) {
    .dialog-actions {
      display: grid;
      justify-content: stretch;
      margin-top: 2em;
    }
  }
`;

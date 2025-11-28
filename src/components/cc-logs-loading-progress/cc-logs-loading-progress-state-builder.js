// FIXME: We're using `@typedef` instead of `@import` here due to a false positive from TS
// See: https://github.com/microsoft/TypeScript/issues/60908/
/**
 * @typedef {import('../../lib/logs/logs-stream.types.js').LogsStreamState} LogsStreamState
 * @typedef {import('../cc-logs-loading-progress/cc-logs-loading-progress.types.js').LogsLoadingProgressState } LogsLoadingProgressState
 */

/**
 * @param {LogsStreamState} progressState
 * @return {LogsLoadingProgressState|null}
 */
export function buildLogsLoadingProgressState(progressState) {
  if (progressState.type === 'idle') {
    return null;
  }
  if (progressState.type === 'connecting') {
    return null;
  }
  if (progressState.type === 'error') {
    return null;
  }
  if (progressState.type === 'waitingForFirstLog') {
    return null;
  }

  if (progressState.type === 'running') {
    return {
      type: 'running',
      ...progressState.progress,
      overflowing: progressState.overflowing,
    };
  }

  if (progressState.type === 'paused' && progressState.reason === 'user') {
    return {
      type: 'paused',
      ...progressState.progress,
      overflowing: progressState.overflowing,
    };
  }

  if (progressState.type === 'paused' && progressState.reason === 'overflow') {
    return {
      type: 'overflowLimitReached',
      ...progressState.progress,
    };
  }

  return {
    type: 'completed',
    ...progressState.progress,
    overflowing: progressState.overflowing,
  };
}

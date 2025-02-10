/**
 * @typedef {import('./cc-logs-loading-progress.types.js').LogsLoadingProgressState} LogsLoadingProgressState
 * @typedef {import('../../lib/logs/logs-stream.types.js').LogsStreamState} LogsProgressState
 */

/**
 * @param {LogsProgressState} progressState
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

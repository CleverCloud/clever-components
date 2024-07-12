import { DocCard } from '../cc-doc-card/cc-doc-card.types.js';

export type DocListState = DocListStateLoaded | DocListStateLoading | DocListStateError;

export interface DocListStateLoaded {
  type: 'loaded';
  docs: DocCard[];
}

export interface DocListStateLoading {
  type: 'loading';
}

export interface DocListStateError {
  type: 'error';
}

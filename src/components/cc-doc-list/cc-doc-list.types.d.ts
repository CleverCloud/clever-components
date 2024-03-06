import{DocCardStateLoaded} from "../cc-doc-card/cc-doc-card.types";
export type DocListState = DocListStateLoaded | DocListStateLoading | DocListStateError;
interface DocListStateLoaded {
  type: 'loaded';
  docs: DocCardStateLoaded[];
}

interface DocListStateLoading {
  type: 'loading';
}

interface DocListStateError {
  type: 'error';
}


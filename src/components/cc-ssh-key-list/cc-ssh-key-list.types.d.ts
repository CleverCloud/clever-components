//#region creation form
export interface NewKey {
  name: string;
  publicKey: string;
}

export interface CreateSshKeyFormState {
  type: 'idle' | 'creating';
}

//#endregion

//#region key lists
export type KeyDataState =
  | KeyDataStateLoading
  | KeyDataStateLoadedAndUnlinked
  | KeyDataStateLoadedAndLinked
  | KeyDataStateError;

// when exchange with API is occurring = loading SSH keys
// - is the initial state
interface KeyDataStateLoading {
  state: 'loading';
}

// when ready to receive user inputs (personal keys only)
interface KeyDataStateLoadedAndUnlinked {
  state: 'loaded';
  isGithubLinked: false;
  personalKeys: SshKeyState[];
}

// when ready to receive user inputs (personal keys & GitHub keys)
interface KeyDataStateLoadedAndLinked {
  state: 'loaded';
  isGithubLinked: true;
  personalKeys: SshKeyState[];
  githubKeys: SshKeyState[];
}

// when an error has occurred
interface KeyDataStateError {
  state: 'error';
}
//#endregion

//#region common

// SshKey
export interface SshKey {
  name: string;
  fingerprint: string;
}
interface SshKeyState extends SshKey {
  state: 'idle' | 'deleting' | 'importing';
}
//#endregion

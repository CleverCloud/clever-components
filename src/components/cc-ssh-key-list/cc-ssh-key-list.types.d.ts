import { CcSshKeyList } from './cc-ssh-key-list.js';

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
export type SshKeyListState =
  | SshKeyListStateLoading
  | SshKeyListStateLoadedAndUnlinked
  | SshKeyListStateLoadedAndLinked
  | SshKeyListStateError;

// when exchange with API is occurring = loading SSH keys
// - is the initial state
interface SshKeyListStateLoading {
  type: 'loading';
}

// when ready to receive user inputs (personal keys only)
interface SshKeyListStateLoadedAndUnlinked {
  type: 'loaded';
  isGithubLinked: false;
  personalKeys: SshKeyState[];
}

// when ready to receive user inputs (personal keys & GitHub keys)
interface SshKeyListStateLoadedAndLinked {
  type: 'loaded';
  isGithubLinked: true;
  personalKeys: SshKeyState[];
  githubKeys: GithubSshKeyState[];
}

// when an error has occurred
interface SshKeyListStateError {
  type: 'error';
}
//#endregion

//#region common

// SshKey
export interface SshKey {
  name: string;
  fingerprint: string;
}
interface SshKeyState extends SshKey {
  type: 'idle' | 'deleting';
}

export interface GithubSshKey extends SshKey {
  key: string;
}
interface GithubSshKeyState extends GithubSshKey {
  type: 'idle' | 'importing';
}
//#endregion

declare global {
  interface HTMLElementTagNameMap {
    'cc-ssh-key-list': CcSshKeyList;
  }
}

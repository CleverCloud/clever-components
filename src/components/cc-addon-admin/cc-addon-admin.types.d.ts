export type AddonAdminState =
  | AddonAdminStateLoaded
  | AddonAdminStateLoading
  | AddonAdminStateError
  | AddonAdminStateSaving;

export interface AddonAdminStateLoaded extends AddonAdminStateBase {
  type: 'loaded';
}

export interface AddonAdminStateLoading {
  type: 'loading';
}

export interface AddonAdminStateError {
  type: 'error';
}

export type AddonAdminStateSaving = AddonAdminStateDeleting | AddonAdminStateUpdatingName | AddonAdminStateUpdatingTags;

export interface AddonAdminStateDeleting extends AddonAdminStateBase {
  type: 'deleting';
}

export interface AddonAdminStateUpdatingName extends AddonAdminStateBase {
  type: 'updatingName';
}

export interface AddonAdminStateUpdatingTags extends AddonAdminStateBase {
  type: 'updatingTags';
}

interface AddonAdminStateBase {
  id: string;
  name: string;
  tags: string[];
}

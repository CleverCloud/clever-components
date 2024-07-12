export type AddonAdminState =
  | AddonAdminStateLoaded
  | AddonAdminStateLoading
  | AddonAdminStateError
  | AddonAdminStateSaving;

export interface AddonAdminStateLoaded {
  type: 'loaded';
  name: string;
  tags: string[];
}

export interface AddonAdminStateLoading {
  type: 'loading';
}

export interface AddonAdminStateError {
  type: 'error';
}

export type AddonAdminStateSaving = AddonAdminStateDeleting | AddonAdminStateUpdatingName | AddonAdminStateUpdatingTags;

export interface AddonAdminStateDeleting {
  type: 'deleting';
  name: string;
  tags: string[];
}

export interface AddonAdminStateUpdatingName {
  type: 'updatingName';
  name: string;
  tags: string[];
}

export interface AddonAdminStateUpdatingTags {
  type: 'updatingTags';
  name: string;
  tags: string[];
}

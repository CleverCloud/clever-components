export type AddonAdminState = AddonAdminStateLoaded | AddonAdminStateLoading | AddonAdminStateError | AddonAdminStateSaving;

export type AddonAdminStateNotError = AddonAdminStateLoading | AddonAdminStateSaving | AddonAdminStateLoaded;

interface AddonAdminStateLoaded {
  type: 'loaded';
  name: string;
  tags: [];
}

interface AddonAdminStateDeleting {
  type: 'deleting';
  name: string;
  tags: string[];
}

interface AddonAdminStateUpdatingName {
  type: 'updatingName';
  name: string;
  tags: string[];
}

interface AddonAdminStateUpdatingTags {
  type: 'updatingTagssss';
  name: string;
  tags: string[];
}

interface AddonAdminStateLoading {
  type: 'loading';
}

interface AddonAdminStateError {
  type: 'error';
}

export type AddonAdminStateSaving = AddonAdminStateDeleting | AddonAdminStateUpdatingName | AddonAdminStateUpdatingTags;

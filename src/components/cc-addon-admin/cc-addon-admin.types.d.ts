export type AddonAdminState = AddonAdminStateLoaded | AddonAdminStateLoading | AddonAdminStateError | AddonAdminStateSaving;

interface AddonAdminStateLoaded {
  type: 'loaded';
  name: string;
  tags: string[];
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
  type: 'updatingTags';
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

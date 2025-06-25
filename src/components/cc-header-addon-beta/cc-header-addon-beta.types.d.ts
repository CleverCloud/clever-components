export type CcHeaderAddonBetaState = CcHeaderAddonBetaStateLoaded;

/*
export interface CcHeaderAddonBetaStateLoading {
  type: 'loading';
}
*/

export interface CcHeaderAddonBetaStateLoaded extends Addon {
  type: 'loaded';
  addonHref: string;
  logsHref: string;
  zone: string;
}

export type Addon = {
  id: string;
  logo: string;
  name: string;
};

export type CcHeaderAddonBetaState = CcHeaderAddonBetaStateLoaded;

/*
export interface CcHeaderAddonBetaStateLoading {
  type: 'loading';
}
*/

export interface CcHeaderAddonBetaStateLoaded extends Addon {
  type: 'loaded';
  addonHref: String;
  logsHref: String;
  zone: String;
}

export type Addon = {
  id: String;
  logo: String;
  name: String;
};

export interface OauthConsumer {
  name: string;
  url: string;
  baseUrl: string;
  description: string;
  picture: string;
  rights: OauthConsumerRights;
  key: string;
  /** There is no secret if the user is not admin */
  secret?: string;
}

export type OauthConsumerRights = {
  almighty?: boolean;
  accessOrganisations: boolean;
  accessOrganisationsBills: boolean;
  accessOrganisationsConsumptionStatistics: boolean;
  accessOrganisationsCreditCount: boolean;
  accessPersonalInformation: boolean;
  manageOrganisations: boolean;
  manageOrganisationsApplications: boolean;
  manageOrganisationsMembers: boolean;
  manageOrganisationsServices: boolean;
  managePersonalInformation: boolean;
  manageSshKeys: boolean;
};

export type OauthConsumerInfoState =
  | OauthConsumerInfoStateLoading
  | OauthConsumerInfoStateLoaded
  | OauthConsumerInfoStateWaiting
  | OauthConsumerInfoStateError;

export interface OauthConsumerInfoStateLoading {
  type: 'loading';
}

export interface OauthConsumerInfoStateLoaded extends OauthConsumer {
  type: 'loaded';
}

export interface OauthConsumerInfoStateWaiting extends OauthConsumer {
  type: 'waiting';
}

export interface OauthConsumerInfoStateError {
  type: 'error';
}

// this is what we retrieve directly from the API
export interface RawOauthConsumer {
  name: string;
  description: string;
  key: string;
  url: string;
  picture: string;
  baseUrl: string;
  rights: OauthConsumerRights;
}

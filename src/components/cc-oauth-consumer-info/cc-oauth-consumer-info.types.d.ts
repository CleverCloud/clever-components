export interface OAuthConsumer {
  name: string;
  url: string;
  baseUrl: string;
  description: string;
  picture: string;
  rights: OAuthConsumerRights;
  key: string;
  secret: string;
}

export type OAuthConsumerRights = {
  almighty: boolean;
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

export type OAuthConsumerInfoState =
  | OAuthConsumerInfoStateLoading
  | OAuthConsumerInfoStateLoaded
  | OAuthConsumerInfoStateWaiting
  | OAuthConsumerInfoStateError;

export interface OAuthConsumerInfoStateLoading {
  type: 'loading';
}

export interface OAuthConsumerInfoStateLoaded extends OAuthConsumer {
  type: 'loaded';
}

export interface OAuthConsumerInfoStateWaiting extends OAuthConsumer {
  type: 'waiting';
}

export interface OAuthConsumerInfoStateError {
  type: 'error';
}

export interface OauthConsumer {
  name: string;
  url: string;
  baseUrl: string;
  description: string;
  picture: string;
  rights: OauthConsumerRights;
  key: string;
  secret: string;
}

export type OauthConsumerRights = {
  almighty: boolean; // nouvelle propriété, définie à false par défaut
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

export type OauthConsumerFormState =
  | OauthConsumerFormStateIdleCreate
  | OauthConsumerFormStateCreating
  | OauthConsumerFormStateIdleUpdate
  | OauthConsumerFormStateUpdating
  | OauthConsumerFormStateDeleting
  | OauthConsumerFormStateLoading
  | OauthConsumerFormStateError;

export interface OauthConsumerFormStateIdleCreate {
  type: 'idle-create';
}

export interface OauthConsumerFormStateCreating extends OauthConsumer {
  type: 'creating';
}

export interface OauthConsumerFormStateIdleUpdate extends OauthConsumer {
  type: 'idle-update';
}

export interface OauthConsumerFormStateUpdating extends OauthConsumer {
  type: 'updating';
}

export interface OauthConsumerFormStateDeleting extends OauthConsumer {
  type: 'deleting';
}

export interface OauthConsumerFormStateLoading {
  type: 'loading';
}

export interface OauthConsumerFormStateError {
  type: 'error';
}

// this is what we retrieve directly from the API
export interface RawUpdatedOauthConsumer {
  name: string;
  description: string;
  url: string;
  picture: string;
  baseUrl: string;
  rights: OauthConsumerRights;
}

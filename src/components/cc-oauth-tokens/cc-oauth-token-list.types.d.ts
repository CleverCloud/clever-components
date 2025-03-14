export type OauthTokenListState =
  | OauthTokenListStateLoaded
  | OauthTokenListStateLoading
  | OauthTokenListStateError
  | OauthTokenListStateRevokingAll;

export interface OauthTokenListStateLoaded {
  type: 'loaded';
  tokens: Array<OauthTokenState>;
}

export interface OauthTokenListStateRevokingAll {
  type: 'revoking-all';
  tokens: Array<OauthTokenStateRevoking | OauthTokenStateCurrent>;
}

export interface OauthTokenListStateLoading {
  type: 'loading';
}

export interface OauthTokenListStateError {
  type: 'error';
}

export type OauthTokenState = OauthTokenStateIdle | OauthTokenStateRevoking | OauthTokenStateCurrent;

export interface OauthTokenStateIdle extends OauthToken {
  type: 'idle';
}

export interface OauthTokenStateCurrent extends OauthToken {
  type: 'current';
}

interface OauthTokenStateRevoking extends OauthToken {
  type: 'revoking';
}

interface OauthToken {
  id: string;
  consumerName: string;
  creationDate: Date;
  expirationDate: Date;
  lastUsedDate: Date;
  imageUrl: string;
}

export type OauthTokenStateWithExpirationWarning = OauthTokenState & {
  isExpirationClose: boolean;
};

// FIXME: remove when clever-client exposes types
export type RawOauthTokenData = {
  token: string;
  consumer: {
    name: string;
    description: string;
    key: string;
    url: string;
    picture: string;
    baseUrl: string;
    rights: {
      almighty: boolean;
      access_organisations: boolean;
      manage_organisations: boolean;
      manage_organisations_services: boolean;
      manage_organisations_applications: boolean;
      manage_organisations_members: boolean;
      access_organisations_bills: boolean;
      access_organisations_credit_count: boolean;
      access_organisations_consumption_statistics: boolean;
      access_personal_information: boolean;
      manage_personal_information: boolean;
      manage_ssh_keys: boolean;
    };
  };
  creationDate: number;
  expirationDate: number;
  lastUtilisation: number;
  rights: {
    almighty: boolean;
    access_organisations: boolean;
    manage_organisations: boolean;
    manage_organisations_services: boolean;
    manage_organisations_applications: boolean;
    manage_organisations_members: boolean;
    access_organisations_bills: boolean;
    access_organisations_credit_count: boolean;
    access_organisations_consumption_statistics: boolean;
    access_personal_information: boolean;
    manage_personal_information: boolean;
    manage_ssh_keys: boolean;
  };
  employeeId: string | null;
  imageUrl: string;
};

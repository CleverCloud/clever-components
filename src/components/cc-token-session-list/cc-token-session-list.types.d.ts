export type TokenSessionListState =
  | TokenSessionListStateLoaded
  | TokenSessionListStateLoading
  | TokenSessionListStateError
  | TokenSessionListStateRevokingAll;

export interface TokenSessionListStateLoaded {
  type: 'loaded';
  currentSessionToken: SessionToken;
  otherSessionTokens: Array<SessionTokenState>;
}

export interface TokenSessionListStateRevokingAll {
  type: 'revoking-all';
  currentSessionToken: SessionToken;
  otherSessionTokens: Array<SessionTokenStateRevoking>;
}

export interface TokenSessionListStateLoading {
  type: 'loading';
}

export interface TokenSessionListStateError {
  type: 'error';
}

export type SessionTokenState = SessionTokenStateIdle | SessionTokenStateRevoking;

export interface SessionTokenStateIdle extends SessionToken {
  type: 'idle';
}

interface SessionTokenStateRevoking extends SessionToken {
  type: 'revoking';
}

interface SessionToken {
  id: string;
  creationDate: Date;
  expirationDate: Date;
  lastUsedDate: Date;
  isCleverTeam: boolean;
}

// FIXME: remove when clever-client exposes types
export interface RawTokenData {
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
}

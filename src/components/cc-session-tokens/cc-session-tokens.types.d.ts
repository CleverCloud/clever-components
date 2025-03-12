export type SessionTokensState =
  | SessionTokensStateLoaded
  | SessionTokensStateLoading
  | SessionTokensStateError
  | SessionTokensStateRevokingAllTokens;

export interface SessionTokensStateLoaded {
  type: 'loaded';
  tokens: Array<SessionTokenState>;
}

export interface SessionTokensStateRevokingAllTokens {
  type: 'revoking-all';
  tokens: Array<SessionTokenState & ({ type: 'revoking' } | { isCurrentSession: true; type: 'idle' })>;
}

export interface SessionTokensStateLoading {
  type: 'loading';
}

export interface SessionTokensStateError {
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
  creationDate: number | string; // timestamp as number or string with ISO format with timezone information
  expirationDate: number | string; // timestamp as number or string with ISO format with timezone information
  lastUsedDate: number | string; // timestamp as number or string with ISO format with timezone information
  isCurrentSession: boolean;
  isCleverTeam: boolean;
}

export type SessionTokenStateWithExpirationWarning = SessionTokenState & {
  isExpirationClose: boolean;
};

export type RawSessionTokenData = {
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
};

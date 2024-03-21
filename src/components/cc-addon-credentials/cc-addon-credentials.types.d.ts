export type AddonCredentialsState = AddonCredentialsStateLoaded | AddonCredentialsStateLoading | AddonCredentialsStateError;

interface AddonCredentialsStateLoaded {
  type: 'loaded';
  credentials: Credential[];
  image: string;
  name: string;
  toggleState: boolean;
  addonType: AddonType;
}

interface AddonCredentialsStateLoading {
  type: 'loading';
  credentials: Credential[];
}

interface AddonCredentialsStateError {
  type: 'error';
}

interface Credential {
  type: "auth-token" | "host" | "password" | "url" | "user";
  value: string;
  secret: boolean;
}

export type AddonType = "apm" | "elasticsearch" | "kibana" | "pulsar";

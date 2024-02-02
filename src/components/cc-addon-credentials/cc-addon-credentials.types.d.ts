export interface Credential {
  type: "auth-token" | "host" | "password" | "url" | "user";
  value: string;
  secret: boolean;
}

export type AddonType = "apm" | "elasticsearch" | "kibana" | "pulsar";

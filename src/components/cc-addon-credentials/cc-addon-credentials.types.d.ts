export interface Credential {
  type: "auth-token" | "host" | "password" | "url" | "user" | "port";
  value: string;
  secret: boolean;
}

export type AddonType = "apm" | "elasticsearch" | "kibana" | "pulsar" | "materia-kv";

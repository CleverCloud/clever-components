interface Credential {
  type: "auth-token" | "host" | "password" | "url" | "user";
  value: string;
  secret: boolean;
}

type AddonType = "apm" | "elasticsearch" | "kibana" | "pulsar";

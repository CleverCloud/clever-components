interface Credential {
  type: "auth-token" | "host" | "password" | "url" | "user" | "port";
  value: string;
  secret: boolean;
}

type AddonType = "apm" | "elasticsearch" | "kibana" | "pulsar" | "materiadb-kv";

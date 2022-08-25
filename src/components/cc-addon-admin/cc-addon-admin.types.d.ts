export interface Addon {
  id: string,
  realId: string,
  name: string,
  provider: AddonProvider,
  plan: AddonPlan,
  creationDate: Date | number | string,
}

export type AddonType = "apm" | "elasticsearch" | "kibana" | "pulsar";

interface AddonProvider {
  name: string,
  logoUrl: string,
}

interface AddonPlan {
  name: string,
}

interface BackupDetails {
  providerId: string,
  passwordForCommand: string,
  list: Backup[],
}

export interface Backup {
  createdAt: Date,
  expiresAt: Date
  url: string,
  restoreCommand?: string,
  deleteCommand?: string,
}

export interface Credential {
  type: "auth-token" | "host" | "password" | "url" | "user",
  value: string,
  secret: boolean,
}

export interface Option {
  name: string,
  enabled: boolean,
  // Option specific params
  flavor: Flavor, // for "apm" and "kibana" options
  price: number, // for "encryption" option
}

interface Feature {
  name: string,
  value: string,
}

interface Flavor {
  name: string,
  cpus: number,
  gpus: number,
  mem: number,
  microservice: boolean,
  monthlyCost: number,
}

interface Link {
  type: "elasticsearch" | "kibana" | "apm",
  href?: string,
}

interface ElasticOptions extends GenericOptions {
  apm: boolean,
  kibana: boolean,
}

interface GenericOptions {
  encryption: boolean,
}

export type OverlayType = "restore" | "delete";

export interface Versions {
  current: string,
  available: string
}

export type ErrorType = false | "loading" | "saving";

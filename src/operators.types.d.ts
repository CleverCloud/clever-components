export interface RawOperator {
  resourceId: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: string;
  version: string;
  appVersion: string;
  accessUrl: string;
  availableVersions: string[];
  resources: {
    entrypoint: string;
    [key: string]: string;
  };
  features: {
    networkGroup?: string;
  };
  envVars: Record<string, string>;
}

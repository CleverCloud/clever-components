export interface App {
  name: string,                   // Name of the application
  commit?: string,                // Head commit on remote repo if app is not brand new (full SHA-1)
  variantName: string,            // Human name of the variant (PHP, Ruby, Python...)
  variantLogo: string,            // HTTPS URL to the logo of the variant
  lastDeploymentLogsUrl?: string, // URL to the logs for the last deployment if app is not brand new
}

export type AppStatus = "restart-failed" | "restarting" | "restarting-with-downtime"
  | "running" | "start-failed" | "starting" | "stopped" | "unknown";

interface Application {
  name: string,
  link: string,
  instance: Instance,
  zone: Zone,
}
interface Instance {
  variant: InstanceVariant,
}

interface InstanceVariant {
  name: string,
  logo: string,
}


export interface Organisation {
  name: string,
  avatar: string,
  cleverEnterprise: boolean,
  emergencyNumber: string,
}

export interface Orga {
  name: string,
  avatar: string,
  cleverEnterprise: boolean,
  emergencyNumber: string,
}

interface Zone {
  countryCode: string,   // ISO 3166-1 alpha-2 code of the country (2 letters): "FR", "CA", "US"...
  city: string,          // Name of the city in english: "Paris", "Montreal", "New York City"...
  country: string,       // Name of the country in english: "France", "Canada", "United States"...
  displayName?: string,  // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
  tags: string[],        // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
}

export type ToggleStateType = 'off' | 'open' | 'close';


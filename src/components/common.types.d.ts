export interface App {
  name: string; // Name of the application
  commit?: string; // Head commit on remote repo if app is not brand new (full SHA-1)
  variantName: string; // Human name of the variant (PHP, Ruby, Python...)
  variantLogo: string; // HTTPS URL to the logo of the variant
  lastDeploymentLogsUrl?: string; // URL to the logs for the last deployment if app is not brand new
}

export interface Addon {
  id: string;
  realId: string;
  name: string;
  provider: AddonProvider;
  plan: AddonPlan;
  creationDate: Date | number | string;
}

interface AddonPlan {
  name: string;
}

interface AddonProvider {
  name: string;
  logoUrl: string;
}

interface AddonOption {
  name: string;
  enabled: boolean;
  icon?: IconModel;
  // Option specific params
  flavor: Flavor; // for "apm" and "kibana" options
  apm?: boolean;
  kibana?: boolean;
  encryption?: boolean;
}

export interface Scalability {
  minFlavor: Flavor;
  maxFlavor: Flavor;
  minInstances: number;
  maxInstances: number;
}

export interface Flavor {
  name: string;
  cpus: number;
  gpus: number;
  mem: number;
  microservice: boolean;
  monthlyCost?: number | null;
}

export interface IconModel {
  content: string;
}

interface InvoiceAmount {
  amount: number;
  currency: 'EUR' | 'USD';
}

export interface Invoice {
  downloadUrl: string;
  emissionDate: string;
  invoiceHtml: string;
  number: string;
  paymentUrl: string;
  status: InvoiceStatusType;
  total: InvoiceAmount;
  type: InvoiceType;
}

export type InvoiceStatusType = 'PENDING' | 'PROCESSING' | 'PAID' | 'PAYMENTHELD' | 'CANCELED' | 'REFUNDED' | 'WONTPAY';

export type InvoiceType = 'INVOICE' | 'CREDITNOTE';

interface HeatmapPoint {
  lat: number; // Latitude
  lon: number; // Longitude
  count: number; // Number of occurences for this location
}

type MapModeType = 'points' | 'heatmap';

interface Point {
  lat: number; // Latitude
  lon: number; // Longitude
  count?: number; // Number of occurences for this location (default: 1)
  delay?: number | string; // How long the point needs to stay (in ms), 'none' for a fixed point, (default: 1000)
  tooltip?: string; // Tooltip when the point is hovered
  marker?: Marker;
}

interface Marker {
  tag: string; // The HTML tag name used for the marker
  // Additional specific properties for the marker custom element.
}

interface Currency {
  code: string;
  changeRate: number;
}

interface Plan {
  productName: string;
  name: string;
  price: number; // price in euros for 1 hour
  features: Feature[];
  quantity: number;
}

interface Feature {
  code:
    | 'connection-limit'
    | 'cpu'
    | 'databases'
    | 'disk-size'
    | 'gpu'
    | 'has-logs'
    | 'has-metrics'
    | 'max-db-size'
    | 'memory'
    | 'version';
  type: 'boolean' | 'shared' | 'bytes' | 'number' | 'runtime' | 'string';
  value?: number | string; // Only required for a plan feature
  name?: string;
}

interface PricingSection {
  type: SectionType;
  progressive?: boolean; // defaults to false
  secability?: number; // defaults to 1
  intervals: PricingInterval[];
}

interface PricingInterval {
  minRange: number; // byte
  maxRange: number; // byte
  price: number; // "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic
}

type SectionType = 'inbound-traffic' | 'outbound-traffic' | 'storage' | 'private-users' | 'public-users';

type ActionType = 'add' | 'none';

interface Temporality {
  type: 'second' | 'minute' | 'hour' | 'day' | '30-days' | '1000-minutes';
  digits: number; // how many fraction digits to display the price
}

interface RedirectionNamespace {
  namespace: string;
}

interface Redirection {
  namespace: string;
  sourcePort: number;
}

interface Zone {
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 code of the country (2 letters): "FR", "CA", "US"...
  city: string; // Name of the city in english: "Paris", "Montreal", "New York City"...
  country: string; // Name of the country in english: "France", "Canada", "United States"...
  displayName?: string; // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
  tags: string[]; // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
  lat: number; // Latitude
  lon: number; // Longitude
}

type ToggleStateType = 'off' | 'open' | 'close';

type AppStatus =
  | 'restart-failed'
  | 'restarting'
  | 'restarting-with-downtime'
  | 'running'
  | 'start-failed'
  | 'starting'
  | 'stopped'
  | 'unknown';

/* region env-var */

export interface EnvVar {
  name: string;
  value: string;
  isNew?: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
}

interface EnvVarParseError {
  line?: number;
  msg: string;
  isWarning: Boolean;
}

type EnvVarValidationMode = 'simple' | 'strict';

type EnvVarEditorState = EnvVarEditorStateLoading | EnvVarEditorStateLoaded;

interface EnvVarEditorStateLoading {
  type: 'loading';
}

interface EnvVarEditorStateLoaded {
  type: 'loaded';
  validationMode: EnvVarValidationMode;
  variables: Array<EnvVar>;
}

/* endregion */

export type NotificationIntent = 'info' | 'success' | 'warning' | 'danger';

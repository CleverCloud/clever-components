import { InvoiceStatus } from '@clevercloud/client/cc-api-commands/invoice/invoice.types.js';
import { EnvVarValidationMode } from '@clevercloud/client/utils/environment.types.js';
import { TemplateResult } from 'lit';

export type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

export type ObjectOrFunction<T, R = void> = T | ((obj: T) => R);

export type UpdateCallback<T> = <V extends T, R extends T>(property: V | ((obj: V) => R | void)) => void;

export interface App {
  name: string; // Name of the application
  commit?: string; // Head commit on remote repo if app is not brand new (full SHA-1)
  variantName: string; // Human name of the variant (PHP, Ruby, Python...)
  variantLogo: string; // HTTPS URL to the logo of the variant
  lastDeploymentLogsUrl?: string; // URL to the logs for the last deployment if app is not brand new
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
}

export type AddonOption = EncryptionAddonOption | ElasticAddonOption<Flavor | FlavorWithMonthlyCost>;

export type AddonOptionWithMetadata = {
  icon?: IconModel;
  title?: string | Node;
  logo?: string;
  description: string | Node | TemplateResult<1>;
} & Pick<AddonOption, 'name' | 'enabled'>;

export interface EncryptionAddonOption {
  name: 'encryption';
  enabled: boolean;
}

export interface ElasticAddonOption<FlavorType> {
  name: 'kibana' | 'apm';
  enabled: boolean;
  flavor: FlavorType;
}

export interface FlavorWithMonthlyCost extends Flavor {
  monthlyCost: {
    amount: number;
    currency: string;
  };
}

export type AddonOptionStates = { [optionName: string]: boolean };

export interface IconModel {
  content: string;
}

interface InvoiceAmount {
  amount: number;
  currency: string; // ISO 4217 currency code
}

export interface Invoice {
  downloadUrl: string;
  emissionDate: string;
  invoiceHtml?: string;
  number: string;
  paymentUrl: string;
  status: InvoiceStatus;
  total: InvoiceAmount;
  type: InvoiceType;
}

export type InvoiceType = 'INVOICE' | 'CREDITNOTE';

interface HeatmapPoint {
  lat: number; // Latitude
  lon: number; // Longitude
  count: number; // Number of occurrences for this location
}

type MapModeType = 'points' | 'heatmap';

interface Point {
  name?: string;
  // Latitude
  lat: number;
  // Longitude
  lon: number;
  // Number of occurrences for this location (default: 1)
  count?: number;
  // How long the point needs to stay (in ms), (default: 1000)
  delay?: number;
  // Tooltip when the point is hovered
  tooltip?: string | { tag: string; [p: string]: any };
  marker?: Marker;
  zIndexOffset?: number;
}

interface Marker {
  // The HTML tag name used for the marker
  tag: string;
  // Additional specific properties for the marker custom element.
  [p: string]: any;
}

interface Plan {
  productName?: string;
  name: string;
  price: number; // price in euros for 1 hour
  priceId?: string;
  features: FormattedFeature[];
  quantity?: number;
}

interface ConsumptionPlan {
  productName: string;
  name: string;
  price: number;
  sections: Array<PricingSection>;
  quantity?: number;
}

export interface FormattedFeature {
  // `string & {}` means any string other than the ones listed before. Without this, you get no autocomplete because string and 'toto' overlap.
  code:
    | 'connection-limit'
    | 'cpu'
    | 'gpu'
    | 'is-migratable'
    | 'databases'
    | 'dedicated'
    | 'disk-size'
    | 'has-logs'
    | 'has-metrics'
    | 'max-db-size'
    | 'memory'
    | 'version'
    | (string & {});
  // `string & {}` means any string other than the ones listed before. Without this, you get no autocomplete because string and 'toto' overlap.
  type: 'boolean' | 'shared' | 'boolean-shared' | 'bytes' | 'number' | 'runtime' | 'number-cpu-runtime' | 'string';
  value?: number | string | { cpu: number; shared: boolean; nice: number };
  name?: string;
}

export interface PricingSection {
  type: SectionType;
  service:
    | 'cellar.storage'
    | 'cellar.outbound'
    | 'fsbucket.storage'
    | 'pulsar.storage.cold'
    | 'pulsar.storage.hot'
    | 'pulsar.throughput.in'
    | 'pulsar.throughput.out'
    | 'heptapod.storage'
    | 'heptapod.private_active_users'
    | 'heptapod.public_active_users';
  progressive?: boolean; // defaults to false
  secability?: number; // defaults to 1
  intervals: PricingInterval[];
  quantity?: number;
}

export interface PricingInterval {
  minRange: number; // byte
  maxRange?: number; // byte
  price: number; // "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic
}

type SectionType =
  | 'inbound-traffic'
  | 'outbound-traffic'
  | 'storage'
  | 'hot-storage'
  | 'cold-storage'
  | 'private-users'
  | 'public-users';

type ActionType = 'add' | 'none';

interface Temporality {
  type: 'second' | 'minute' | 'hour' | 'day' | '30-days' | '1000-minutes';
  digits?: number; // how many fraction digits to display the price
}

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

export interface EnvVarParseError {
  line?: number | '?';
  msg: string | Node;
  isWarning: Boolean;
}

export type EnvVarEditorState = EnvVarEditorStateLoading | EnvVarEditorStateLoaded;

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

export interface Notification {
  message: string | Node;
  title?: string;
  intent: NotificationIntent;
  options?: NotificationOptions;
}

export interface NotificationOptions {
  timeout?: number;
  closeable?: boolean;
}

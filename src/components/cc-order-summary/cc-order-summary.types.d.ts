export interface OrderSummary {
  name: string;
  tags?: Array<string>;
  logo?: LogoInfos;
  configuration?: Array<ConfigurationItem>;
  submitStatus?: 'disabled' | 'waiting';
  skeleton: boolean;
}

export interface LogoInfos {
  url: string;
  alt: string;
}

export interface ConfigurationItem {
  label: string;
  value: string;
}

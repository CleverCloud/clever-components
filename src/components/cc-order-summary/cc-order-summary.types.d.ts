export interface OrderSummary {
  name: string;
  tags?: Array<string>;
  logo?: LogoInfos;
  configuration?: Array<ConfigurationItem>;
  submitStatus?: 'disabled' | 'waiting';
}

export interface LogoInfos {
  url: string;
  alt: string;
}

export interface ConfigurationItem {
  label: string;
  value: string;
  a11yLive?: boolean;
  skeleton?: boolean;
  skeletonValueOnly?: boolean;
}

export interface OrderSummary {
  name: string;
  productName?: string;
  tags?: Array<string>;
  logo?: LogoInfos;
  configuration?: Array<ConfigurationItem>;
  total?: TotalItem;
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

export type TotalItem = Omit<ConfigurationItem, 'skeleton'>;

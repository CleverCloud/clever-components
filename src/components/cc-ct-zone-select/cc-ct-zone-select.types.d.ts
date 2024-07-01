export type ZoneItemState = ZoneItemStateLoaded | ZoneItemStateLoading;

export interface ZoneItemStateLoaded extends ZoneItem {
  type: 'loaded';
}

export interface ZoneItemStateLoading {
  type: 'loading';
}

interface ZoneItem {
  name: string;
  city: string;
  countryCode: string;
  infra: string;
  tags: Array<String>;
}


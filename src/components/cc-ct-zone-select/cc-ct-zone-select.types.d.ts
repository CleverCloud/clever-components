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
  infra: string;
  flagUrl: string;
  images: Array<string>;
  tags: Array<string>;
}


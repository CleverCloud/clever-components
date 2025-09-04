export interface ZoneItem {
  code: string;
  country: string;
  countryCode: string;
  name: string;
  flagUrl: string;
  images: Array<ZoneImage>;
  disabled?: boolean;
  selected?: boolean;
}

export interface ZoneImage {
  url: string | URL;
  alt: string;
}

export type ZonesSections = Array<ZoneSection> | [SingleZoneSection];

export interface ZoneSection {
  title: string;
  zones: Array<ZoneItem>;
}

export interface SingleZoneSection {
  zones: Array<ZoneItem>;
}

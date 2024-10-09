import { ZoneImage } from '../cc-zone-card/cc-zone-card.types.js';

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

export type ZonesSections = Array<ZoneSection> | [SingleZoneSection];

export interface ZoneSection {
  title: string;
  zones: Array<ZoneItem>;
}

export interface SingleZoneSection {
  zones: Array<ZoneItem>;
}

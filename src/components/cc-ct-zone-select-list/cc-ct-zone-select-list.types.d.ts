import { ZoneImage } from "../cc-ct-zone-select/cc-ct-zone-select.types.js";

export interface ZoneItem {
  code: string;
  country: string;
  countryCode: string;
  name: string;
  flagUrl: string;
  images: Array<ZoneImage>;
  tags: Array<string>;
  disabled?: boolean;
  selected?: boolean;
}

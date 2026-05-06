import { IconModel } from '../common.types.js';

export type SearchBarItemType = 'app' | 'addon' | 'network-group' | 'cke';

export interface SearchBarItem {
  label: string;
  href: string;
  id?: string;
  itemType?: SearchBarItemType;
  matchers?: string[];
}

export interface SearchBarSection {
  label: string;
  icon: IconModel;
  items: SearchBarItem[];
}

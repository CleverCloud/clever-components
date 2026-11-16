import { IconModel } from '../common.types.js';

export type SearchBarItemType = 'app' | 'addon' | 'network-group' | 'cke' | 'oauth-consumer' | 'addon-provider';

export interface SearchBarItem {
  label: string;
  href: string;
  id?: string;
  /** Extra texts the item can be found by, searched like its label and id but never displayed. */
  aliases?: string[];
  itemType?: SearchBarItemType;
  matchers?: string[];
  /** Tags the user put on the item, as is (`env:prod`, `production`): found by `tag:<tag>` tokens. */
  tags?: string[];
}

export interface SearchBarSection {
  label: string;
  icon: IconModel;
  items: SearchBarItem[];
}

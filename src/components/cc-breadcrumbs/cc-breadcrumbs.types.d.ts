import { IconModel } from '../common.types.js';

export interface CcBreadcrumbsItem {
  value: string;
  label?: string;
  icon?: IconModel;
  /**
   * WARNING: When `label` is an empty string, you MUST set this value to provide accessible text for the icon.
   * Otherwise, the link will have no discernible text, which is a serious accessibility issue (WCAG: Links must have discernible text).
   */
  iconA11yName?: string;
}

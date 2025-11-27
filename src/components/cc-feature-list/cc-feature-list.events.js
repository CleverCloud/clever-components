import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a feature setting changes.
 * @extends {CcEvent<{featureId: string, newValue: string}>}
 */
export class CcFeatureSettingChangeEvent extends CcEvent {
  static TYPE = 'cc-feature-setting-change';

  /**
   * @param {{featureId: string, newValue: string}} detail
   */
  constructor(detail) {
    super(CcFeatureSettingChangeEvent.TYPE, detail);
  }
}

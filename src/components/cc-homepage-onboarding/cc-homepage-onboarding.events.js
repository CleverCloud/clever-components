import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the "new resource" form is submitted with a selected organisation.
 * @extends {CcEvent<string>}
 */
export class CcHomepageOnboardingNewResourceEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-new-resource';

  /**
   * @param {string} detail - The selected organisation ID.
   */
  constructor(detail) {
    super(CcHomepageOnboardingNewResourceEvent.TYPE, detail);
  }
}

import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the "new resource" button is clicked.
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

/**
 * Dispatched when the "new project" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingNewProjectEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-new-project';

  constructor() {
    super(CcHomepageOnboardingNewProjectEvent.TYPE);
  }
}

/**
 * Dispatched when the "secure account" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingSecureEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-secure';

  constructor() {
    super(CcHomepageOnboardingSecureEvent.TYPE);
  }
}

/**
 * Dispatched when the "SSH keys" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingSshKeysEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-ssh-keys';

  constructor() {
    super(CcHomepageOnboardingSshKeysEvent.TYPE);
  }
}

/**
 * Dispatched when the "CLI" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingCliEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-cli';

  constructor() {
    super(CcHomepageOnboardingCliEvent.TYPE);
  }
}

/**
 * Dispatched when the "new organisation" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingNewOrganisationEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-new-organisation';

  constructor() {
    super(CcHomepageOnboardingNewOrganisationEvent.TYPE);
  }
}

/**
 * Dispatched when the "configure payment" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingConfigPaymentEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-config-payment';

  constructor() {
    super(CcHomepageOnboardingConfigPaymentEvent.TYPE);
  }
}

/**
 * Dispatched when the "contact support" button is clicked.
 * @extends {CcEvent}
 */
export class CcHomepageOnboardingSupportEvent extends CcEvent {
  static TYPE = 'cc-homepage-onboarding-support';

  constructor() {
    super(CcHomepageOnboardingSupportEvent.TYPE);
  }
}

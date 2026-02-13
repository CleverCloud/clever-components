import { CcEvent } from '../../lib/events.js';
import { IconModel } from '../common.types.js';

export type HomepageOnboardingState =
  | HomepageOnboardingStateLoaded
  | HomepageOnboardingStateLoading
  | HomepageOnboardingStateError;

export type HomepageOnboardingCardId =
  | 'newResource'
  | 'newProject'
  | 'secure'
  | 'sshKeys'
  | 'cli'
  | 'newOrganisation'
  | 'configPayment'
  | 'support';

export interface HomepageOnboardingStateLoaded {
  type: 'loaded';
  userType: 'new-user' | 'already-user';
  cardIds: Array<HomepageOnboardingCardId>;
  organisationOptions: { label: string; value: string }[];
}

export interface HomepageOnboardingStateLoading {
  type: 'loading';
}

export interface HomepageOnboardingStateError {
  type: 'error';
}

export interface HomepageOnboardingCard {
  title: string;
  description: string;
  icon: IconModel;
  iconColor: 'purple' | 'blue' | 'white' | 'dark-purple' | 'orange' | 'dark-orange';
  buttonText: string;
  select?: { title: string; placeholder: string };
  event?: (...args: any[]) => CcEvent<any>;
}

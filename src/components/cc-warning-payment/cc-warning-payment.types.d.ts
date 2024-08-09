export type PaymentWarningModeType = 'home' | 'overview' | 'billing';

export interface PaymentMethodError {
  type: number;
  orgaName?: string;
  orgaBillingLink?: string;
}

type PaymentWarningModeType = "home" | "overview" | "billing";

interface PaymentMethodError {
  type: number;
  orgaName?: string;
  orgaBillingLink?: string;
}

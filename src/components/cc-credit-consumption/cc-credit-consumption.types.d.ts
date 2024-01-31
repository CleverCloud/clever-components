import { HeaderOrgaStateLoaded, HeaderOrgaStateLoading } from "../cc-header-orga/cc-header-orga.types.js";
import { OneDayOfConsumption } from "../cc-daily-consumption/cc-daily-consumption.types.js";
import { Coupon } from "../cc-free-credits/cc-free-credits.types.js";

export type CreditConsumptionState = CreditConsumptionStateLoading | CreditConsumptionStateError | CreditConsumptionStateLoaded;

interface CreditConsumptionStateLoading {
  state: 'loading';
}

interface CreditConsumptionStateError {
  state: 'error';
}

export interface CreditConsumptionStateLoaded {
  state: 'loaded';
  orgaInfo: OrgaInfoLoaded;
  consumption: {
    period: ConsumptionPeriod;
    currency: Currency;
    prepaidCredits: PrepaidCredits;
    consumptions: OneDayOfConsumption[];
    coupons: Coupon[]; 
  };
}

export interface SkeletonData {
  state: 'loading';
  orgaInfo: OrgaInfoLoading;
  consumption: {
    period: ConsumptionPeriod;
    currency: 'EUR';
    prepaidCredits: PrepaidCreditsEnabled;
    consumptions: OneDayOfConsumption[];
    coupons: [];
  };
}

export type Currency = 'EUR' | 'USD';

export type PrepaidCredits = PrepaidCreditsEnabled | PrepaidCreditsDisabled;

export type OrgaInfo = OrgaInfoLoaded | OrgaInfoLoading;

export interface OrgaInfoLoaded extends HeaderOrgaStateLoaded {
  invoicedOrganization?: {
    id: string;
    name: string;
  },
  discount: number;
  priceFactor: number;
}

export interface OrgaInfoLoading extends HeaderOrgaStateLoading {
  name: null;
  avatar: null;
  cleverEnterprise: false;
  emergencyNumber: null;
  invoicedOrganization: null;
  discount: 0;
  priceFactor: 1;
}

interface PrepaidCreditsEnabled {
  enabled: true;
  total: number;
}

interface PrepaidCreditsDisabled {
  enabled: false;
}

interface ConsumptionPeriod {
  start: Date;
  end: Date;
}

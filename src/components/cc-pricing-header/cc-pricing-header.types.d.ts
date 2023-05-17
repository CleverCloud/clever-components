import { Zone } from '../common.types.js';

interface PricingZoneStateLoading {
    state: 'loading';
}

interface PricingZoneStateLoaded {
    state: 'loaded';
    value: Zone[];
}

export type PricingZoneState = PricingZoneStateLoading | PricingZoneStateLoaded;

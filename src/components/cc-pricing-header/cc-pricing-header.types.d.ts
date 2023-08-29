import { Zone } from '../common.types.js';

interface PricingZoneStateLoading {
    state: 'loading';
}

interface PricingZoneStateError {
    state: 'error';
}

interface PricingZoneStateLoaded {
    state: 'loaded';
    value: Zone[];
}

export type PricingZoneState = PricingZoneStateLoading | PricingZoneStateError | PricingZoneStateLoaded;

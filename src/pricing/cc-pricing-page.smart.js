import './cc-pricing-page.js';
import '../smart/cc-smart-container.js';
import { fetchAllCurrencies, fetchAllZones } from '../lib/api-helpers.js';
import { fromCustomEvent, LastPromise, merge, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-pricing-page',
  params: {
    currencyCode: { type: String },
    zoneId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {
    const currencies_lp = new LastPromise();
    const zones_lp = new LastPromise();

    const error$ = merge(currencies_lp.error$, zones_lp.error$);

    const onCurrencyChanged$ = fromCustomEvent(component, 'cc-pricing-page:change-currency');
    const onZoneChanged$ = fromCustomEvent(component, 'cc-pricing-page:change-zone');

    const contextAndCurrencies$ = context$.pipe(withLatestFrom(currencies_lp.value$));

    unsubscribeWithSignal(disconnectSignal, [
      error$.subscribe(console.error),
      currencies_lp.value$.subscribe((currencies) => {
        component.currencies = currencies;
      }),
      zones_lp.value$.subscribe((zones) => {
        component.zones = zones;
      }),
      context$.subscribe(({ zoneId }) => {
        component.zoneId = zoneId;
      }),
      contextAndCurrencies$.subscribe(([context, currencies]) => {
        component.currency = currencies?.find((currency) => currency.code === context.currencyCode);
      }),
      onZoneChanged$.subscribe((zoneId) => {
        container.context = { ...container.context, zoneId };
      }),
      onCurrencyChanged$.subscribe((currency) => {
        container.context = { ...container.context, currencyCode: currency?.code };
      }),
    ]);
    currencies_lp.push((signal) => fetchAllCurrencies({ signal }));
    zones_lp.push((signal) => fetchAllZones({ signal }));
  },

});

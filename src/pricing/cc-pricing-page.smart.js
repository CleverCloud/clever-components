import './cc-pricing-page.js';
import '../smart/cc-smart-container.js';
import { fromCustomEvent, LastPromise, merge, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { defineComponent } from '../lib/smart-manager.js';
import { fetchAllCurrencies, fetchAllZones } from '../lib/api-helpers.js';

// const SHORT_DESC = 'Hey, this is a short description of the addon.';

const RATES = { EUR: 1, CAD: 1.4849, HKD: 9.17, ISK: 149.8, PHP: 57.335, DKK: 7.436, HUF: 364.78, CZK: 26.233, AUD: 1.5548, RON: 4.8865, SEK: 10.1935, IDR: 17024.39, INR: 85.7605, BRL: 6.696, RUB: 90.0115, HRK: 7.5748, JPY: 128.75, THB: 36.746, CHF: 1.1045, SGD: 1.5899, PLN: 4.6399, BGN: 1.9558, TRY: 9.4313, CNY: 7.722, NOK: 10.1653, NZD: 1.6948, ZAR: 17.6852, USD: 1.1802, MXN: 24.6616, ILS: 3.9091, GBP: 0.86068, KRW: 1340.88, MYR: 4.8937 };
const getCurrencySymbol = (currency) => new Intl.NumberFormat('fr', {
  style: 'currency',
  currency: currency,
  currencyDisplay: 'narrowSymbol',
  maximumFractionDigits: 0,
}).formatToParts(0).find((p) => p.type === 'currency').value;

defineComponent({
  selector: 'cc-pricing-page',
  params: {
    zoneId: { type: String },
    currencyCode: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {
    const currencies_lp = new LastPromise();
    const zones_lp = new LastPromise();

    const error$ = merge(currencies_lp.error$, zones_lp.error$);

    const onZoneChanged$ = fromCustomEvent(component, 'cc-pricing-page:change-zone');
    const onCurrencyChanged$ = fromCustomEvent(component, 'cc-pricing-page:change-currency');

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
    currencies_lp.push((signal) => fetchAllCurrencies({signal}));
    zones_lp.push((signal) => fetchAllZones({signal}));
  },

});

function sleep () {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

async function fetchPriceSystem (zoneId) {
  // const [pricingList, currencies] = await Promise.all([
  //     fetch(`https://api.clever-cloud.com/v4/billing/price-system?zone_id=${zoneId}`).then((r) => r.json()),
  //     fetch(`https://api.exchangeratesapi.io/latest?base=EUR`).then((r) => r.json()),
  // ]);
  const pricingList = await fetch(`https://api.clever-cloud.com/v4/billing/price-system?zone_id=${zoneId}`).then((r) => r.json());
  await sleep();
  // return { pricingList, zoneId };
  // console.log(currencies);
  return { pricingList, zoneId, currencies: formatCurrencies(RATES) };
}

// TODO: TEMP => Change when changeRate is available on the pricing API
function formatCurrencies (currencies) {
  // TODO: Remove if we fetch from exchange api
  const formattedCurrencies = [];
  for (const key of Object.keys(currencies)) {
    formattedCurrencies.push({
      code: key,
      displayValue: `${key} ${getCurrencySymbol(key)}`,
      changeRate: currencies[key],
    });
  }
  console.log('fc', formattedCurrencies);
  return formattedCurrencies;
}

import './cc-pricing-page.js';
import '../smart/cc-smart-container.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { defineComponent } from '../lib/smart-manager.js';
import { lang } from '../translations/translations.en.js';

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
  },
  onConnect (container, component, context$, disconnectSignal) {
    const product_lp = new LastPromise();

    const onZoneChanged$ = fromCustomEvent(component, 'cc-pricing-page:change-zone');
    const onCurrencyChanged$ = fromCustomEvent(component, 'cc-pricing-page:change-currency');

    unsubscribeWithSignal(disconnectSignal, [
      product_lp.error$.subscribe((err) => console.error(err)),
      product_lp.value$.subscribe((priceSystem) => {
        // Do we even need the pricing list ?
        component.pricingList = priceSystem.pricingList;
        component.zone = priceSystem.zoneId;
        component.currencies = formatCurrencies(RATES);
      }),
      context$.subscribe(({ zoneId }) => {
        product_lp.push(() => fetchPriceSystem(zoneId));
      }),
      onZoneChanged$.subscribe(({ zoneId }) => {
        container.context = { ...container.context, zoneId };
      }),
      onCurrencyChanged$.subscribe(({ currencyCode }) => {
        container.context = { ...container.context, currencyCode };
      }),
    ]);

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
  return { pricingList, zoneId };
  // console.log(currencies);
  // return { pricingList, zoneId, currencies: {EUR: 1, ...currencies.rates} };
}

// TODO: TEMP => Change when changeRate is available on the pricing API
function formatCurrencies (currencies) {
  // TODO: Remove if we fetch from exchange api
  const formattedCurrencies = { ...currencies };
  for (const key of Object.keys(currencies)) {
    formattedCurrencies[key] = {
      code: key,
      displayValue: `${key} ${getCurrencySymbol(key)}`,
      changeRate: formattedCurrencies[key],
    };
  }
  return formattedCurrencies;
}

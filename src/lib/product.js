export function formatAddonProduct (addonProvider, priceSystem, selectedFeatures) {
  return {
    name: addonProvider.name,
    icon: addonProvider.logoUrl,
    description: addonProvider.longDesc,
    features: formatAddonFeatures(addonProvider.features, selectedFeatures),
    plans: formatAddonPlans(addonProvider.plans, priceSystem, selectedFeatures),
  };
}

// API returns interval prices in "euros / gigabyte / 1 hour" for "storage" (specified with service.time_interval_for_price.interval : "PT1H")
// and just "euros / gigabyte" for timeless sections like traffic.
// We want interval prices to be in "euros / byte / 30 days" for "storage" and "euros / byte" for others.
// Therefore, we need to apply a price factor for on interval prices.
const THIRTY_DAYS_IN_HOURS = 24 * 30;

export function formatAddonCellar (priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'cellar.storage'),
      },
      {
        type: 'outbound-traffic',
        ...formatProductConsumptionIntervals(priceSystem, 'cellar.outbound'),
      },
    ],
  };
}

export function formatAddonFsbucket (priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'fsbucket.storage'),
      },
    ],
  };
}

export function formatAddonPulsar (priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'pulsar_storage_size'),
      },
      {
        type: 'inbound-traffic',
        ...formatProductConsumptionIntervals(priceSystem, 'pulsar_throughput_in'),
      },
      {
        type: 'outbound-traffic',
        ...formatProductConsumptionIntervals(priceSystem, 'pulsar_throughput_out'),
      },
    ],
  };
}

export function formatAddonHeptapod (priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'heptapod.storage'),
      },
      {
        type: 'private-users',
        progressive: true,
        ...formatProductConsumptionIntervals(priceSystem, 'heptapod.private_active_users'),
      },
      {
        type: 'public-users',
        progressive: true,
        ...formatProductConsumptionIntervals(priceSystem, 'heptapod.public_active_users'),
      },
    ],
  };
}

function formatProductConsumptionIntervals (priceSystem, serviceName) {

  const service = priceSystem.countable.find((c) => c.service === serviceName);

  const secability = (service?.data_quantity_for_price?.secability === 'insecable')
    ? service.data_quantity_for_price.quantity
    : 1;

  const timeFactor = (service?.time_interval_for_price?.interval === 'PT1H') ? THIRTY_DAYS_IN_HOURS : 1;
  const quantityFactor = service?.data_quantity_for_price?.quantity ?? 1;

  const priceFactor = timeFactor / quantityFactor;

  const intervals = service.price_plans.map((interval, idx, allIntervals) => {
    const minRange = (idx === 0) ? 0 : allIntervals[idx - 1].max_quantity;
    return {
      minRange,
      maxRange: interval.max_quantity,
      price: interval.price * priceFactor,
    };
  });

  return { secability, intervals };
}

function formatAddonFeatures (providerFeatures, selectedFeatures) {

  // If selectedFeatures is not specified, we just use the features as is
  const featureCodes = (selectedFeatures == null)
    ? providerFeatures.map((f) => f.name_code).filter((code) => code != null)
    : selectedFeatures;

  return featureCodes
    .map((code) => {
      return providerFeatures.find((f) => f.name_code === code);
    })
    .filter((feature) => feature != null)
    .map((feature) => {
      return {
        code: feature.name_code,
        type: feature.type.toLowerCase(),
        // Only used when we format plan features
        value: feature.computable_value ?? '',
      };
    });
}

function formatAddonPlans (allPlans, priceSystem, selectedFeatures) {
  return allPlans.map((plan) => {
    const priceItem = priceSystem.runtime.find((runtime) => runtime.slug_id.toLowerCase() === plan.price_id.toLowerCase());
    return {
      name: plan.name,
      price: priceItem?.price ?? 0,
      features: formatAddonFeatures(plan.features, selectedFeatures),
    };
  });
}

export function formatRuntimeProduct (runtime, priceSystem) {
  const features = formatRuntimeFeatures(runtime);
  return {
    name: runtime.variant.name,
    icon: runtime.variant.logo,
    // The runtime description is not really useful here
    features,
    plans: formatRuntimePlans(runtime.flavors, priceSystem, features),
  };
}

function formatRuntimeFeatures (runtime) {
  const features = [
    { code: 'cpu', type: 'number-cpu-runtime' },
    { code: 'memory', type: 'bytes' },
  ];
  if (runtime.variant.slug.startsWith('ml_')) {
    features.push({ code: 'gpu', type: 'number' });
  }
  return features;
}

function formatRuntimePlans (allFlavors, priceSystem, features) {
  return allFlavors.map((flavor) => {
    const priceItem = priceSystem.runtime.find((runtime) => runtime.slug_id.toLowerCase() === flavor.price_id.toLowerCase());
    return {
      name: flavor.name,
      price: priceItem?.price ?? 0,
      features: formatRuntimeFeatureValues(features, flavor),
    };
  });
}

function formatRuntimeFeatureValues (allFeatures, flavor) {
  return allFeatures.map((feature) => {
    return {
      ...feature,
      value: getRuntimeFeatureValue(feature.code, flavor),
    };
  });
}

function getRuntimeFeatureValue (featureCode, flavor) {
  switch (featureCode) {
    case 'cpu':
      return {
        cpu: flavor.cpus,
        shared: flavor.microservice,
        nice: flavor.nice,
      };
    case 'memory':
      return flavor.memory.value;
    case 'gpu':
      return flavor.gpus;
  }
}

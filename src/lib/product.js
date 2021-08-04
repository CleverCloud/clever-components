export function formatAddonProduct (addonProvider, priceSystem, selectedFeatures, currency) {
  return {
    name: addonProvider.name,
    icon: addonProvider.logoUrl,
    description: addonProvider.longDesc,
    features: formatAddonFeatures(addonProvider.features, selectedFeatures),
    plans: formatAddonPlans(addonProvider.plans, priceSystem, selectedFeatures),
    currency,
  };
}

export function formatAddonCellar (priceSystem, currency) {
  const cellarStorage = priceSystem.countable.find((c) => c.service === 'cellar.storage').price_plans;
  const cellarTraffic = priceSystem.countable.find((c) => c.service === 'cellar.outbound').price_plans;
  return {
    intervals: {
      storage: formatProductStorageIntervals(cellarStorage),
      traffic: formatProductStorageIntervals(cellarTraffic),
    },
    currency,
  };
}

export function formatAddonFsbucket (priceSystem, currency) {
  const fsbucketStorage = priceSystem.countable.find((c) => c.service === 'fsbucket.storage').price_plans;
  return {
    intervals: {
      storage: formatProductStorageIntervals(fsbucketStorage),
    },
    currency,
  };
}

function formatProductStorageIntervals (rawIntervals) {
  return rawIntervals.map((interval, idx, allIntervals) => {
    const minRange = (idx === 0) ? 0 : allIntervals[idx - 1].max_quantity;
    return {
      minRange,
      maxRange: interval.max_quantity,
      price: interval.price,
    };
  });
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
        value: feature.computable_value || '',
      };
    });
}

function formatAddonPlans (allPlans, priceSystem, selectedFeatures) {
  return allPlans.map((plan) => {
    const priceItem = priceSystem.runtime.find((runtime) => runtime.slug_id.toLowerCase() === plan.price_id.toLowerCase());
    return {
      name: plan.name,
      price: (priceItem != null) ? priceItem.price : 0,
      features: formatAddonFeatures(plan.features, selectedFeatures),
    };
  });
}

export function formatRuntimeProduct (runtime, priceSystem, currency) {
  const features = formatRuntimeFeatures(runtime);
  return {
    name: runtime.variant.name,
    icon: runtime.variant.logo,
    // The runtime description is not really useful here
    features,
    plans: formatRuntimePlans(runtime.flavors, priceSystem, features),
    currency,
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
      price: (priceItem != null) ? priceItem.price : 0,
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

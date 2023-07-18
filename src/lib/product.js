export function formatAddonProduct (addonProvider, priceSystem, selectedFeatures) {
  return {
    name: addonProvider.name,
    productFeatures: formatAddonFeatures(addonProvider.features, selectedFeatures),
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
        name: feature.name,
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
    productFeatures: features,
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

export function getRunnerProduct (productId) {

  const baseProduct = {
    type: 'docker',
    // Fake date
    version: '20211001',
    name: 'Docker',
    // not used
    defaultFlavor: null,
    // not used
    buildFlavor: null,
    enabled: true,
    comingSoon: false,
    maxInstances: 40,
    tags: [],
    deployments: [
      'git',
    ],
  };

  if (productId === 'jenkins-runner') {
    return {
      ...baseProduct,
      variant: {
        // Fake UUID
        id: 'b8093938-4846-4f74-8c4a-82660180093e',
        slug: 'jenkins-runner',
        name: 'Jenkins runner',
        deployType: 'docker',
        logo: 'https://assets.clever-cloud.com/logos/jenkins.svg',
      },
      description: 'Jenkins runner',
      flavors: [
        getRunnerFlavor('jenkins-runner.', 'XS', 1, 2),
        getRunnerFlavor('jenkins-runner.', 'S', 2, 4),
        getRunnerFlavor('jenkins-runner.', 'M', 4, 8),
        getRunnerFlavor('jenkins-runner.', 'L', 6, 12),
        getRunnerFlavor('jenkins-runner.', 'XL', 8, 16),
        getRunnerFlavor('jenkins-runner.', '2XL', 12, 24),
        getRunnerFlavor('jenkins-runner.', '3XL', 16, 32),
      ],
    };
  }
  if (productId === 'heptapod-runner') {
    return {
      ...baseProduct,
      variant: {
        // Fake UUID
        id: '9b207292-732b-4594-b48b-09a91ac72f0c',
        slug: 'heptapod-runner',
        name: 'Heptapod runner',
        deployType: 'docker',
        logo: 'https://assets.clever-cloud.com/logos/heptapod.svg',
      },
      description: 'Heptapod runner',
      flavors: [
        getRunnerFlavor('heptapod-runner.', 'XS', 1, 2, true, 5),
        getRunnerFlavor('heptapod-runner.', 'S', 2, 4, true, 5),
        getRunnerFlavor('heptapod-runner.', 'M', 4, 8, true, 5),
        getRunnerFlavor('heptapod-runner.', 'L', 6, 12, true, 5),
        getRunnerFlavor('heptapod-runner.', 'XL', 8, 16, true, 5),
        getRunnerFlavor('heptapod-runner.', '2XL', 12, 24, true, 5),
        getRunnerFlavor('heptapod-runner.', '3XL', 16, 32, true, 5),
      ],
    };
  }
}

function getRunnerFlavor (prefix, name, cpus, memory, microservice = false, nice = 0) {
  return {
    name,
    // not used
    mem: null,
    cpus,
    gpus: 0,
    disk: null,
    // not used
    price: null,
    available: true,
    microservice,
    // eslint-disable-next-line camelcase
    machine_learning: false,
    nice,
    // eslint-disable-next-line camelcase
    price_id: prefix + name,
    memory: {
      unit: 'B',
      value: memory * 1024 ** 3,
      // not used
      formatted: null,
    },
  };
}

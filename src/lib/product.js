/**
 * @typedef {import('../components/common.types.js').AddonProvider} AddonProvider
 * @typedef {import('../components/common.types.js').RawAddonProvider} RawAddonProvider
 * @typedef {import('../components/common.types.js').PriceSystem} PriceSystem
 * @typedef {import('../components/common.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('../components/common.types.js').PricingSection} PricingSection
 * @typedef {import('../components/common.types.js').PricingInterval} PricingInterval
 * @typedef {import('../components/common.types.js').Plan} Plan
 * @typedef {import('../components/common.types.js').Instance} Instance
 * @typedef {import('../components/cc-pricing-product/cc-pricing-product.types.js').PricingProductStateLoaded} PricingProductStateLoaded
 * @typedef {import('../components/cc-pricing-estimation/cc-pricing-estimation.types.js').PricingEstimationStateLoaded} PricingEstimationStateLoaded
 * @typedef {import('../components/cc-pricing-estimation/cc-pricing-estimation.types.js').FormattedRuntimePrice} FormattedRuntimePrice
 */

/**
 * Formats an add-on product with its features and plans.
 *
 * @param {RawAddonProvider} addonProvider
 * @param {PriceSystem} priceSystem
 * @param {Array<FormattedFeature['code']>} selectedFeatures
 * @returns {Omit<PricingProductStateLoaded, 'type'>}
 */
export function formatAddonProduct(addonProvider, priceSystem, selectedFeatures) {
  // We filter out add-ons that are not attached to any zone. This is sometimes done on dev plans to disable them.
  const addonPlansWithZones = addonProvider.plans.filter((plan) => plan.zones.length > 0);
  return {
    name: addonProvider.name,
    productFeatures: formatAddonFeatures(addonProvider.features, selectedFeatures),
    plans: formatAddonPlans(addonPlansWithZones, priceSystem, selectedFeatures),
  };
}

// API returns interval prices in "euros / gigabyte / 1 hour" for "storage" (specified with service.time_interval_for_price.interval : "PT1H")
// and just "euros / gigabyte" for timeless sections like traffic.
// We want interval prices to be in "euros / byte / 30 days" for "storage" and "euros / byte" for others.
// Therefore, we need to apply a price factor for on interval prices.
const THIRTY_DAYS_IN_HOURS = 24 * 30;

/**
 * Formats the add-on data for Cellar.
 *
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @returns {{ sections: Array<PricingSection> }} An object containing sections for storage and outbound traffic.
 */
export function formatAddonCellar(priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'cellar.storage'),
        service: 'cellar.storage',
      },
      {
        type: 'outbound-traffic',
        ...formatProductConsumptionIntervals(priceSystem, 'cellar.outbound'),
        service: 'cellar.outbound',
      },
    ],
  };
}

/**
 * Formats the add-on data for FSBucket.
 *
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @returns {{ sections: Array<PricingSection> }} An object containing a section for storage.
 */
export function formatAddonFsbucket(priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'fsbucket.storage'),
        service: 'fsbucket.storage',
      },
    ],
  };
}

/**
 * Formats the add-on data for Pulsar.
 *
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @returns {{ sections: Array<PricingSection> }} An object containing sections for storage, inbound traffic, and outbound traffic.
 */
export function formatAddonPulsar(priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'pulsar_storage_size'),
        service: 'pulsar_storage_size',
      },
      {
        type: 'inbound-traffic',
        ...formatProductConsumptionIntervals(priceSystem, 'pulsar_throughput_in'),
        service: 'pulsar_throughput_in',
      },
      {
        type: 'outbound-traffic',
        ...formatProductConsumptionIntervals(priceSystem, 'pulsar_throughput_out'),
        service: 'pulsar_throughput_out',
      },
    ],
  };
}

/**
 * Formats the add-on data for Heptapod.
 *
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @returns {{ sections: Array<PricingSection> }} An object containing sections for storage, private users, and public users.
 */
export function formatAddonHeptapod(priceSystem) {
  return {
    sections: [
      {
        type: 'storage',
        ...formatProductConsumptionIntervals(priceSystem, 'heptapod.storage'),
        service: 'heptapod.storage',
      },
      {
        type: 'private-users',
        progressive: true,
        ...formatProductConsumptionIntervals(priceSystem, 'heptapod.private_active_users'),
        service: 'heptapod.private_active_users',
      },
      {
        type: 'public-users',
        progressive: true,
        ...formatProductConsumptionIntervals(priceSystem, 'heptapod.public_active_users'),
        service: 'heptapod.public_active_users',
      },
    ],
  };
}

/**
 * Formats the consumption intervals for a product based on the price system and service name.
 *
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @param {string} serviceName - The name of the service to format consumption intervals for.
 * @returns {Pick<PricingSection, 'secability' | 'intervals'>}
 */
export function formatProductConsumptionIntervals(priceSystem, serviceName) {
  const service = priceSystem.countable.find((c) => c.service === serviceName);

  const secability =
    service?.data_quantity_for_price?.secability === 'insecable' ? service.data_quantity_for_price.quantity : 1;

  const timeFactor = service?.time_interval_for_price?.interval === 'PT1H' ? THIRTY_DAYS_IN_HOURS : 1;
  const quantityFactor = service?.data_quantity_for_price?.quantity ?? 1;

  const priceFactor = timeFactor / quantityFactor;

  const intervals = service.price_plans.map((interval, idx, allIntervals) => {
    const minRange = idx === 0 ? 0 : allIntervals[idx - 1].max_quantity;
    /** @type {PricingInterval} */
    const formattedInterval = {
      minRange,
      maxRange: interval.max_quantity,
      price: interval.price * priceFactor,
    };
    return formattedInterval;
  });

  return { secability, intervals };
}

/**
 * Formats add-on features based on provider features and selected features.
 *
 * @param {RawAddonProvider['features']|RawAddonProvider['plans'][number]['features']} providerFeatures - Array of provider feature objects.
 * @param {Array<FormattedFeature['code']>} [selectedFeatures] - Array of selected feature codes.
 * @returns {Array<FormattedFeature>} Formatted addon features.
 */
export function formatAddonFeatures(providerFeatures, selectedFeatures) {
  // If selectedFeatures is not specified, we just use the features as is
  const featureCodes =
    selectedFeatures == null
      ? providerFeatures.map((f) => f.name_code).filter((code) => code != null)
      : selectedFeatures;

  return featureCodes
    .map((code) => {
      return providerFeatures.find((f) => f.name_code === code);
    })
    .filter((feature) => feature != null)
    .map((feature) => {
      /** @type {FormattedFeature} */
      const formattedFeature = {
        code: feature.name_code,
        type: /** @type {FormattedFeature['type']} */ (feature.type.toLowerCase()),
        // @ts-ignore Only used when we format plan features
        value: feature.computable_value ?? '',
        name: feature.name,
      };

      return formattedFeature;
    });
}

/**
 * Formats add-on plans based on provided plans, price system, and selected features.
 *
 * @param {RawAddonProvider['plans']} allPlans - Array of all available plans.
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @param {Array<FormattedFeature['code']>} selectedFeatures - Array of selected feature codes.
 * @returns {Pick<Plan, 'name' | 'price' | 'features' | 'priceId'>[]} Formatted add-on plans with name, price, and features.
 */
function formatAddonPlans(allPlans, priceSystem, selectedFeatures) {
  return allPlans.map((plan) => {
    const priceItem = priceSystem.runtime.find(
      (runtime) => runtime.slug_id.toLowerCase() === plan.price_id.toLowerCase(),
    );

    return {
      name: plan.name,
      price: priceItem?.price ?? 0,
      features: formatAddonFeatures(plan.features, selectedFeatures),
      priceId: priceItem?.slug_id,
    };
  });
}

/**
 * Formats a runtime product with its features and plans.
 *
 * @param {Instance} runtime - The runtime object containing variant and flavors information.
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @returns {Omit<PricingProductStateLoaded, 'type'>} Formatted runtime product with name, features, and plans.
 */
export function formatRuntimeProduct(runtime, priceSystem) {
  const features = formatRuntimeFeatures(runtime);
  return {
    name: runtime.variant.name,
    productFeatures: features,
    plans: formatRuntimePlans(runtime.flavors, priceSystem, features),
  };
}

/**
 * Formats runtime features based on the provided runtime object.
 *
 * @param {Instance} runtime - The runtime object containing variant information.
 * @returns {Array<FormattedFeature>} An array of feature objects with code and type properties.
 */
function formatRuntimeFeatures(runtime) {
  /** @type {Array<FormattedFeature>} */
  const features = [
    { code: 'cpu', type: 'number-cpu-runtime' },
    { code: 'memory', type: 'bytes' },
  ];
  if (runtime.variant.slug.startsWith('ml_')) {
    features.push({ code: 'gpu', type: 'number' });
  }
  return features;
}

/**
 * Formats runtime plans based on the provided flavors, price system, and features.
 *
 * @param {Instance['flavors']} allFlavors - Array of all available flavors.
 * @param {PriceSystem} priceSystem - The price system object containing pricing information.
 * @param {Array<FormattedFeature>} features - Array of formatted features.
 * @returns {Pick<Plan, 'name' | 'price' | 'features' | 'priceId'>[]} Formatted runtime plans with name, price, and features.
 */
function formatRuntimePlans(allFlavors, priceSystem, features) {
  return allFlavors.map((flavor) => {
    const priceItem = priceSystem.runtime.find(
      (runtime) => runtime.slug_id.toLowerCase() === flavor.price_id.toLowerCase(),
    );
    return {
      name: flavor.name,
      price: priceItem?.price ?? 0,
      features: formatRuntimeFeatureValues(features, flavor),
      priceId: priceItem.slug_id,
    };
  });
}

/**
 * Formats runtime feature values based on the provided features and flavor.
 *
 * @param {Array<FormattedFeature>} allFeatures - Array of all formatted features.
 * @param {Instance['flavors'][number]} flavor - The flavor object containing feature values.
 * @returns {Array<FormattedFeature>} An array of feature objects with added value property.
 */
function formatRuntimeFeatureValues(allFeatures, flavor) {
  return allFeatures.map((feature) => ({
    ...feature,
    value: getRuntimeFeatureValue(feature.code, flavor),
  }));
}

/**
 * Gets the runtime feature value based on the feature code and flavor.
 *
 * @param {FormattedFeature['code']} featureCode - The code of the feature to get the value for.
 * @param {Instance['flavors'][number]} flavor - The flavor object containing feature details.
 * @returns {FormattedFeature['value']} The feature value based on the feature code.
 */
function getRuntimeFeatureValue(featureCode, flavor) {
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
    default:
      return null;
  }
}

/**
 * Returns a runner product based on the provided product ID.
 *
 * @param {string} productId - The ID of the product to retrieve ('jenkins-runner' or 'heptapod-runner').
 * @returns {Partial<Instance>|void} The runner product object if a valid product ID is provided, undefined otherwise.
 */
export function getRunnerProduct(productId) {
  /** @type {Partial<Instance>} */
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
    deployments: ['git'],
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

/**
 * Generates a runner flavor object with the specified parameters.
 *
 * @param {string} prefix - The prefix for the price_id.
 * @param {string} name - The name of the flavor.
 * @param {number} cpus - The number of CPUs for the flavor.
 * @param {number} memory - The amount of memory in GB for the flavor.
 * @param {boolean} [microservice=false] - Whether the flavor is a microservice.
 * @param {number} [nice=0] - The nice value for the flavor.
 * @returns {Instance['flavors'][number]} The runner flavor object.
 */
function getRunnerFlavor(prefix, name, cpus, memory, microservice = false, nice = 0) {
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

/**
 * @param {PriceSystem} priceSystem
 * @returns {Omit<PricingEstimationStateLoaded, 'type'>}
 */
export function formatEstimationPrices(priceSystem) {
  /* eslint-disable camelcase */
  const runtimePrices = priceSystem.runtime
    .filter(({ source }) => source !== 'adc')
    .map(({ slug_id, price }) => {
      /** @type {FormattedRuntimePrice} */
      const formattedProductPrice = {
        priceId: slug_id,
        price,
      };
      return formattedProductPrice;
    });
  /* eslint-enable camelcase */

  const countablePrices = [
    ...formatAddonCellar(priceSystem).sections,
    ...formatAddonFsbucket(priceSystem).sections,
    ...formatAddonPulsar(priceSystem).sections,
    ...formatAddonHeptapod(priceSystem).sections,
  ];

  return { runtimePrices, countablePrices };
}

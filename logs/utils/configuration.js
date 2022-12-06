
const defaultConf = {
  zeroDownTime: false,
  cancelOnPush: false,
  separateBuild: false,
  minFlavor: 'XS',
  maxFlavor: 'XS',
  minInstances: 1,
  maxInstances: 1,
};

export function getConfUpdater (api) {
  return {
    async update (conf, useDefaults = false) {
      const c = useDefaults ? {
        ...defaultConf,
        ...conf,
      } : conf;

      await api.update({
        homogeneous: !c.zeroDownTime,
        cancelOnPush: c.cancelOnPush,
        separateBuild: c.separateBuild,
        minFlavor: c.minFlavor,
        maxFlavor: c.maxFlavor,
        minInstances: c.minInstances,
        maxInstances: c.maxInstances,
      });
    },

    async reset (conf = {}) {
      await this.update(conf, true);
    },
  };
}

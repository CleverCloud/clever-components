import { get, getAllDeployments, getAllInstances, undeploy, redeploy, update } from '@clevercloud/client/cjs/api/v2/application.js';
import { sendToApi } from './http.js';

export function getApi (ownerId, appId, apiConfig) {
  return {
    async getAppConfig () {
      return get({ id: ownerId, appId: appId })
        .then(sendToApi({ apiConfig }))
        .then((appConfig) => {
          return {
            zone: appConfig.zone,
            deployment: appConfig.last_deploy,
            separateBuild: appConfig.separateBuild,
            hScaling: `${appConfig.instance.minInstances} - ${appConfig.instance.maxInstances}`,
            vScaling: `${appConfig.instance.minFlavor.name} - ${appConfig.instance.maxFlavor.name}`,
          };
        });
    },

    async getDeployments (limit = 1) {
      return getAllDeployments({ id: ownerId, appId: appId, limit })
        .then(sendToApi({ apiConfig }));
    },

    async getInstances (deployment) {
      return getAllInstances({ id: ownerId, appId: appId, deploymentId: deployment.uuid, withDeleted: true })
        .then(sendToApi({ apiConfig }));
    },

    async undeploy () {
      return undeploy({ id: ownerId, appId: appId })
        .then(sendToApi({ apiConfig }));
    },

    async redeploy (useCache = true, commit = undefined) {
      return redeploy({ id: ownerId, appId: appId, useCache, commit })
        .then(sendToApi({ apiConfig }));
    },

    async update (conf) {
      return update({ id: ownerId, appId: appId }, conf)
        .then(sendToApi({ apiConfig }));
    },
  };
}

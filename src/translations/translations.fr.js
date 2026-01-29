import { getDevHubUrl, getDocUrl } from '../lib/dev-hub-url.js';
import {
  prepareFormatDate,
  prepareFormatDateOnly,
  prepareFormatDatetime,
  prepareFormatDistanceToNow,
  prepareFormatHours,
} from '../lib/i18n/i18n-date.js';
import { getCountryName } from '../lib/i18n/i18n-display.js';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  prepareNumberBytesFormatter,
  prepareNumberUnitFormatter,
} from '../lib/i18n/i18n-number.js';
import { sanitize } from '../lib/i18n/i18n-sanitize.js';
import { preparePlural } from '../lib/i18n/i18n-string.js';

/**
 * @import { Flavor, FlavorWithMonthlyCost } from '../components/common.types.js'
 */

export const lang = 'fr';

const plural = preparePlural(lang);

const UNITS_FR = {
  year: 'année',
  month: 'mois',
  week: 'semaine',
  day: 'jour',
  hour: 'heure',
  minute: 'minute',
  second: 'seconde',
};

const formatDate = prepareFormatDate(lang);
const formatDateOnly = prepareFormatDateOnly(lang);
const formatDatetime = prepareFormatDatetime(lang);
const formatHours = prepareFormatHours(lang);
const formatDistanceToNow = prepareFormatDistanceToNow(
  lang,
  (value, unit) => {
    const frUnit = UNITS_FR[unit];
    const pluralUnit = frUnit.endsWith('s') ? plural(value, frUnit, frUnit) : plural(value, frUnit);
    return `il y a ${value} ${pluralUnit}`;
  },
  "à l'instant",
);

const formatNumberUnit = prepareNumberUnitFormatter(lang);
const BYTES_SI_SEPARATOR = '\u202f';
const BYTES_SYMBOL = 'o';
const formatBytes = prepareNumberBytesFormatter(lang, BYTES_SYMBOL, BYTES_SI_SEPARATOR);
const formatBytesSi = prepareNumberUnitFormatter(lang, BYTES_SYMBOL, BYTES_SI_SEPARATOR);

/**
 * @param {number} value
 * @return {string}
 */
function getUnit(value) {
  return formatBytesSi(value).split(BYTES_SI_SEPARATOR)[1];
}

// Shared logic between translations, is it a good idea?
/**
 * @param {Flavor} flavor
 * @return {string}
 */
function formatFlavor(flavor) {
  const cpu = `CPUs\u00A0: ${flavor.cpus}`;
  const shared = flavor.microservice ? ` (partagé)` : '';
  const gpu = flavor.gpus > 0 ? `GPUs\u00A0: ${flavor.gpus}` : '';
  const mem = `RAM\u00A0: ${formatBytes(flavor.mem * 1024 * 1024)}`;
  return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
}

const getCliInstructions = () =>
  sanitize`Pour installer les Clever Tools (CLI), suivez les instructions de la <cc-link href="${getDocUrl('/cli/install')}" a11y-desc="documentation - Installer les Clever Tools - en Anglais">documentation</cc-link>.`;

export const translations = {
  //#region cc-addon-admin
  'cc-addon-admin.admin': `Administration de l'add-on`,
  'cc-addon-admin.danger-zone': `Zone de danger`,
  'cc-addon-admin.delete': `Supprimer l'add-on`,
  'cc-addon-admin.delete-backups': `Les sauvegardes sont conservées suivant la politique de rétention.`,
  'cc-addon-admin.delete-disclaimer': `Supprimer cet add-on le rend immédiatement indisponible.`,
  'cc-addon-admin.delete-vm': `La base de données est conservée 24 heures.`,
  'cc-addon-admin.delete-vm-and-backups': `La base de données est conservée 24 heures, les sauvegardes suivant la politique de rétention.`,
  'cc-addon-admin.delete.dialog.confirm': `Supprimer l'add-on`,
  'cc-addon-admin.delete.dialog.desc': `En supprimant cet add-on, vous risquez de perdre toutes ses données. Veuillez consulter les conditions générales d'utilisation du fournisseur de cet add-on pour plus d'informations.`,
  'cc-addon-admin.delete.dialog.heading': `Confirmation de suppression`,
  'cc-addon-admin.delete.dialog.label': `Saisissez le nom de l'add-on`,
  'cc-addon-admin.delete.error': /** @param {{ name: string }} _ */ ({ name }) =>
    `Une erreur est survenue lors de la suppression de l'add-on "${name}".`,
  'cc-addon-admin.delete.success': /** @param {{ name: string }} _ */ ({ name }) =>
    `L'add-on "${name}" a bien été supprimé.`,
  'cc-addon-admin.error-loading': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  'cc-addon-admin.heading.name': `Nom`,
  'cc-addon-admin.heading.tags': `Tags`,
  'cc-addon-admin.input.name': `Nom de l'add-on`,
  'cc-addon-admin.input.tags': `Tags de l'add-on`,
  'cc-addon-admin.tags-description': `Les tags vous permettent de classer vos applications et add-ons afin de les catégoriser`,
  'cc-addon-admin.tags-empty': `Pas de tags définis`,
  'cc-addon-admin.tags-update': `Mettre à jour les tags`,
  'cc-addon-admin.update': `Mettre à jour le nom`,
  'cc-addon-admin.update-name.error': `Une erreur est survenue lors de la mise à jour du nom de votre add-on.`,
  'cc-addon-admin.update-name.success': `Le nom de votre add-on a bien été mis à jour.`,
  'cc-addon-admin.update-tags.error': `Une erreur est survenue lors de la mise à jour des tags de votre add-on.`,
  'cc-addon-admin.update-tags.success': `Les tags de votre add-on ont bien été mis à jour.`,
  //#endregion
  //#region cc-addon-backups
  'cc-addon-backups.cli.content.download-backup-command': `Télécharger une sauvegarde de la base de données\u00A0:`,
  'cc-addon-backups.cli.content.instruction': getCliInstructions,
  'cc-addon-backups.cli.content.intro': `
      Vous pouvez gérer les sauvegardes directement depuis votre terminal en utilisant les commandes ci-dessous.
    `,
  'cc-addon-backups.cli.content.list-backups-command': `Lister les sauvegardes de bases de données disponibles\u00A0:`,
  'cc-addon-backups.command-password': `Cette commande vous demandera votre mot de passe, le voici\u00A0:`,
  'cc-addon-backups.delete': /** @param {{createdAt: string|number}} _ */ ({ createdAt }) =>
    sanitize`Supprimer la sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong>`,
  'cc-addon-backups.delete-command-label': `Commande de suppression`,
  'cc-addon-backups.delete-command-password-label': `Mot de passe pour la commande de suppression`,
  'cc-addon-backups.delete.btn': `supprimer…`,
  'cc-addon-backups.delete.manual.description.es-addon': () =>
    sanitize`Vous pouvez supprimer cette sauvegarde manuellement grâce à l'outil <cc-link href="https://curl.se/docs/">cURL</cc-link> en exécutant cette commande\u00A0:`,
  'cc-addon-backups.delete.manual.title': `Suppression manuelle`,
  'cc-addon-backups.delete.with-service.description.es-addon': /** @param {{href: string}} _ */ ({ href }) =>
    sanitize`Vous pouvez supprimer cette sauvegarde avec Kibana en vous rendant sur le <cc-link href="${href}">dépôt de sauvegardes</cc-link>.`,
  'cc-addon-backups.delete.with-service.title.es-addon': `Suppression avec Kibana`,
  'cc-addon-backups.description.es-addon': `Les sauvegardes sont gérées par Elasticsearch lui-même. Vous pouvez définir la rétention ainsi que la périodicité des sauvegardes dans l'interface de Kibana.`,
  'cc-addon-backups.description.es-addon-old': `Les sauvegardes sont gérées par Elasticsearch lui-même. La version de votre Elasticsearch ne permet pas de définir de politique de rétention. La suppression d'une sauvegarde se fait manuellement avec l'API d'Elasticsearch.`,
  'cc-addon-backups.description.jenkins': `Les sauvegardes sont réalisées en archivant les données contenues dans Jenkins.`,
  'cc-addon-backups.description.mongodb-addon': () =>
    sanitize`Les sauvegardes sont réalisées en utilisant l'outil <cc-link href="https://docs.mongodb.com/v4.0/reference/program/mongodump/">mongodump</cc-link>.`,
  'cc-addon-backups.description.mysql-addon': () =>
    sanitize`Les sauvegardes sont réalisées en utilisant l'outil <cc-link href="https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html">mysqldump</cc-link>.`,
  'cc-addon-backups.description.postgresql-addon': () =>
    sanitize`Les sauvegardes sont réalisées en utilisant l'outil <cc-link href="https://www.postgresql.org/docs/current/app-pgdump.html">pg_dump</cc-link>.`,
  'cc-addon-backups.description.redis-addon': `Les sauvegardes sont réalisées en archivant les données contenues dans Redis.`,
  'cc-addon-backups.empty': `Il n'y a aucune sauvegarde pour l'instant.`,
  'cc-addon-backups.link.es-addon': `ouvrir dans Kibana`,
  'cc-addon-backups.link.es-addon-old': `ouvrir dans Elasticsearch`,
  'cc-addon-backups.link.jenkins': `télécharger`,
  'cc-addon-backups.link.mongodb-addon': `télécharger`,
  'cc-addon-backups.link.mysql-addon': `télécharger`,
  'cc-addon-backups.link.postgresql-addon': `télécharger`,
  'cc-addon-backups.link.redis-addon': `télécharger`,
  'cc-addon-backups.loading-error': `Une erreur est survenue pendant le chargement des sauvegardes.`,
  'cc-addon-backups.restore': /** @param {{createdAt: string|number}} _ */ ({ createdAt }) =>
    sanitize`Restaurer la sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong>`,
  'cc-addon-backups.restore-command-label': `Commande de restauration`,
  'cc-addon-backups.restore-command-password-label': `Mot de passe pour la commande de restauration`,
  'cc-addon-backups.restore.btn': `restaurer…`,
  'cc-addon-backups.restore.manual.description.es-addon': () =>
    sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <cc-link href="https://curl.se/docs/">cURL</cc-link> en exécutant cette commande\u00A0:`,
  'cc-addon-backups.restore.manual.description.jenkins': `La restauration de backups Jenkins doit passer par notre support. Créez un ticket en indiquant l'ID de votre add-on ainsi que la date du backup à restaurer et nous le ferons pour vous.`,
  'cc-addon-backups.restore.manual.description.mongodb-addon': () =>
    sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <cc-link href="https://docs.mongodb.com/v4.0/reference/program/mongorestore/">mongorestore</cc-link> en exécutant cette commande\u00A0:`,
  'cc-addon-backups.restore.manual.description.mysql-addon': () =>
    sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à la CLI <cc-link href="https://dev.mysql.com/doc/refman/8.0/en/mysql.html">mysql</cc-link> en exécutant cette commande\u00A0:`,
  'cc-addon-backups.restore.manual.description.postgresql-addon': () =>
    sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <cc-link href="https://www.postgresql.org/docs/current/app-pgrestore.html">pg_restore</cc-link> en exécutant cette commande\u00A0:`,
  'cc-addon-backups.restore.manual.description.redis-addon': `La restauration de backups Redis doit passer par notre support. Créez un ticket en indiquant l'ID de votre add-on ainsi que la date du backup à restaurer et nous le ferons pour vous`,
  'cc-addon-backups.restore.manual.title': `Restauration manuelle`,
  'cc-addon-backups.restore.with-service.description.es-addon': /** @param {{href: string}} _ */ ({ href }) =>
    sanitize`Vous pouvez restaurer cette sauvegarde avec Kibana en vous rendant sur le <cc-link href="${href}">dépôt de sauvegardes</cc-link>.`,
  'cc-addon-backups.restore.with-service.title.es-addon': `Restauration avec Kibana`,
  'cc-addon-backups.text': /** @param {{createdAt: string|number, expiresAt: string|number}} _ */ ({
    createdAt,
    expiresAt,
  }) => {
    return sanitize`Sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expire le <strong>${formatDateOnly(expiresAt)}</strong>)`;
  },
  'cc-addon-backups.text.user-defined-retention': /** @param {{createdAt: string|number}} _ */ ({ createdAt }) =>
    sanitize`Sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expire après la durée de rétention définie)`,
  'cc-addon-backups.title': `Sauvegardes`,
  //#endregion
  //#region cc-addon-credentials
  'cc-addon-credentials.description.apm': `Utilisez ces identifiants pour connecter une instance d'APM Server à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.elasticsearch': `Utilisez ces identifiants pour vous connecter à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.kibana': `Utilisez ces identifiants pour connecter une instance de Kibana à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.materia-kv': `Utilisez ces informations pour vous connecter à votre add-on Materia KV.`,
  'cc-addon-credentials.description.pulsar': `Utilisez ces informations pour vous connecter à votre add-on Pulsar.`,
  'cc-addon-credentials.field.auth-token': `Token`,
  'cc-addon-credentials.field.host': `Hôte`,
  'cc-addon-credentials.field.password': `Mot de passe`,
  'cc-addon-credentials.field.port': `Port`,
  'cc-addon-credentials.field.url': `URL`,
  'cc-addon-credentials.field.user': `Utilisateur`,
  'cc-addon-credentials.get-credentials.error': `Une erreur est survenue lors de la mise à jour des infos, veuillez raffraîchir la page`,
  'cc-addon-credentials.loading-error': `Une erreur est survenue pendant le chargement des informations de connexion`,
  'cc-addon-credentials.renew-secret.error': `Une erreur est survenue pendant le renouvellement du secret`,
  'cc-addon-credentials.renew-secret.success': `Le secret a été renouvelé avec succès`,
  'cc-addon-credentials.title': /** @param {{name: string}} _ */ ({ name }) => `Identifiants ${name}`,
  //#endregion
  //#region cc-addon-credentials-beta
  'cc-addon-credentials-beta.choice.admin': `Admin`,
  'cc-addon-credentials-beta.choice.api': `API`,
  'cc-addon-credentials-beta.choice.apm': `APM`,
  'cc-addon-credentials-beta.choice.cli': `CLI`,
  'cc-addon-credentials-beta.choice.default': `Par défaut`,
  'cc-addon-credentials-beta.choice.direct': `Direct`,
  'cc-addon-credentials-beta.choice.elastic': `Elastic`,
  'cc-addon-credentials-beta.choice.kibana': `Kibana`,
  'cc-addon-credentials-beta.doc-link.keycloak': `Multi-instances sécurisé - Documentation`,
  'cc-addon-credentials-beta.doc-link.otoroshi-api': `Gérer Otoroshi via son API - Documentation`,
  'cc-addon-credentials-beta.doc-link.otoroshi-ng': `Otoroshi dans un Network Group - Documentation`,
  'cc-addon-credentials-beta.download-s3cfg-file': `Télécharger le fichier s3cfg pré-rempli`,
  'cc-addon-credentials-beta.error': `Une erreur est survenue pendant le chargement des informations`,
  'cc-addon-credentials-beta.heading': `Accès`,
  'cc-addon-credentials-beta.ng-multi-instances.disabling.error': `Une erreur est survenue lors de la désactivation du multi-instances sécurisé`,
  'cc-addon-credentials-beta.ng-multi-instances.disabling.success': `Le multi-instances sécurisé a été désactivé avec succès`,
  'cc-addon-credentials-beta.ng-multi-instances.enabling.error': `Une erreur est survenue lors de l'activation du multi-instances sécurisé`,
  'cc-addon-credentials-beta.ng-multi-instances.enabling.success': `Le multi-instances sécurisé a été activé avec succès`,
  'cc-addon-credentials-beta.ng-standard.disabling.error': `Une erreur est survenue lors de la désactivation du Network Group`,
  'cc-addon-credentials-beta.ng-standard.disabling.success': `Le Network Group a été désactivé avec succès`,
  'cc-addon-credentials-beta.ng-standard.enabling.error': `Une erreur est survenue lors de l'activation du Network Group`,
  'cc-addon-credentials-beta.ng-standard.enabling.success': `Le Network Group a été activé avec succès`,
  'cc-addon-credentials-beta.renew-secret': `Renouveler le secret`,
  //#endregion
  //#region cc-addon-credentials-content
  'cc-addon-credentials-content.code.api-client-secret': `Secret du client API`,
  'cc-addon-credentials-content.code.api-client-user': `Utilisateur du client API`,
  'cc-addon-credentials-content.code.api-key': `Clé API`,
  'cc-addon-credentials-content.code.api-password': `Mot de passe API`,
  'cc-addon-credentials-content.code.api-url': `URL de l'API`,
  'cc-addon-credentials-content.code.cluster-full-name': `Nom complet du cluster`,
  'cc-addon-credentials-content.code.database-name': `Nom de la base de données`,
  'cc-addon-credentials-content.code.direct-host': `Hôte direct`,
  'cc-addon-credentials-content.code.direct-port': `Port direct`,
  'cc-addon-credentials-content.code.direct-uri': `URI directe`,
  'cc-addon-credentials-content.code.download-file': `Télécharger le fichier`,
  'cc-addon-credentials-content.code.host': `Hôte`,
  'cc-addon-credentials-content.code.initial-password': `Mot de passe initial`,
  'cc-addon-credentials-content.code.initial-user': `Utilisateur initial`,
  'cc-addon-credentials-content.code.key-id': `ID`,
  'cc-addon-credentials-content.code.key-secret': `Secret`,
  'cc-addon-credentials-content.code.network-group-multi-instances': `Multi-instances sécurisé`,
  'cc-addon-credentials-content.code.network-group-standard': `Network Group`,
  'cc-addon-credentials-content.code.open-api-url': `URL OpenAPI`,
  'cc-addon-credentials-content.code.password': `Mot de passe`,
  'cc-addon-credentials-content.code.port': `Port`,
  'cc-addon-credentials-content.code.tenant-namespace': `Tenant/Namespace`,
  'cc-addon-credentials-content.code.token': `Token`,
  'cc-addon-credentials-content.code.uri': `URI`,
  'cc-addon-credentials-content.code.url': `URL`,
  'cc-addon-credentials-content.code.user': `Utilisateur`,
  'cc-addon-credentials-content.ng.disable': `Désactiver`,
  'cc-addon-credentials-content.ng.enable-multi-instances': `Activer le multi-instances sécurisé`,
  'cc-addon-credentials-content.ng.enable-standard': `Activer le Network Group`,
  //#endregion
  //#region cc-addon-elasticsearch-options
  'cc-addon-elasticsearch-options.additional-cost': () =>
    sanitize`<strong>Activer ces options augmentera votre consommation de crédits.</strong>`,
  'cc-addon-elasticsearch-options.description': `Cet add-on fait partie de l'offre Suite Elastic qui inclue deux options. Ces options sont déployées comme des applications et sont gérées et mises à jour par Clever Cloud. Elles apparaîtront donc comme des applications habituelles que vous pouvez arrêter, supprimer, scaler comme n'importe quelle autre application.`,
  'cc-addon-elasticsearch-options.details.apm': () =>
    sanitize`Elastic APM est un serveur de monitoring de performance applicative pour la Suite Elastic. Déployer cette option permet d'envoyer automatiquement les métriques de toute application liée à cette instance d'add-on Elasticsearch, en supposant que vous utilisez bien l'agent Elastic APM dans les dépendances de vos applications. Retrouvez plus de détails dans <cc-link href="https://www.elastic.co/guide/en/apm/get-started/current/overview.html">la documentation officielle de APM server</cc-link>.`,
  'cc-addon-elasticsearch-options.details.kibana': () =>
    sanitize`Kibana est l'interface d'administration de la Suite Elastic. Kibana vous permet de visualiser vos données Elasticsearch et de naviguer dans la Suite Elastic. Vous voulez effectuer le suivi de la charge de travail liée à la recherche ou comprendre le flux des requêtes dans vos applications\u202f? Kibana est là pour ça. Retrouvez plus de détails dans <cc-link href="https://www.elastic.co/guide/en/kibana/master/index.html">la documentation officielle de Kibana</cc-link>.`,
  'cc-addon-elasticsearch-options.error.icon-a11y-name': `Avertissement`,
  'cc-addon-elasticsearch-options.title': `Options pour la Suite Elastic`,
  'cc-addon-elasticsearch-options.warning.apm': `Si vous activez cette option, nous allons déployer et gérer pour vous un APM server`,
  'cc-addon-elasticsearch-options.warning.flavor': /** @param {Flavor} flavor */ (flavor) =>
    sanitize`Par défaut, l'application sera démarrée sur une <strong title="${formatFlavor(flavor)}">instance ${flavor.name}</strong>.`,
  'cc-addon-elasticsearch-options.warning.kibana': `Si vous activez cette option, nous allons déployer et gérer pour vous un Kibana.`,
  'cc-addon-elasticsearch-options.warning.monthly-cost': /** @param {FlavorWithMonthlyCost['monthlyCost']} _ */ ({
    amount,
    currency,
  }) =>
    sanitize`Cela devrait coûter environ <strong>${formatCurrency(lang, amount, { currency: currency })} par mois</strong>.`,
  //#endregion
  //#region cc-addon-encryption-at-rest-option
  'cc-addon-encryption-at-rest-option.description': () =>
    sanitize`Le chiffrement au repos chiffre l'intégralité du disque de données afin de ne pas y stocker d'informations en clair. Grâce à cette sécurité, l'accès physique au disque empêchera toute lecture des données stockées. Plus d'information dans notre <cc-link href="${getDocUrl('/administrate/encryption-at-rest')}">documentation</cc-link>.`,
  'cc-addon-encryption-at-rest-option.title': `Chiffrement au repos`,
  //#endregion
  //#region cc-addon-features
  'cc-addon-features.details': `Ci-dessous, les spécifications de votre add-on. Elles peuvent évoluer et une migration de l'add-on peut être nécessaire pour en bénéficier.`,
  'cc-addon-features.feature-name.disk': `Disque`,
  'cc-addon-features.feature-name.memory': `Mémoire`,
  'cc-addon-features.feature-name.nodes': `Nœuds`,
  'cc-addon-features.feature-value.dedicated': `Dédié`,
  'cc-addon-features.feature-value.no': `Non`,
  'cc-addon-features.feature-value.yes': `Oui`,
  'cc-addon-features.loading-error': `Une erreur est survenue pendant le chargement des spécifications de l'add-on`,
  'cc-addon-features.title': `Spécifications`,
  //#endregion
  //#region cc-addon-header
  'cc-addon-header.action.get-config': `Obtenir le Kubeconfig`,
  'cc-addon-header.action.open-addon': /** @param {{ linkName: string }} _ */ ({ linkName }) => `Ouvrir ${linkName}`,
  'cc-addon-header.action.restart': `Redémarrer`,
  'cc-addon-header.action.restart-rebuild': `Re-build et redémarrer`,
  'cc-addon-header.error': `Une erreur est survenue pendant le chargement des informations`,
  'cc-addon-header.error.fetch-kubeconfig': `Une erreur est survenue lors du rafraîchissement du lien Kubeconfig, veuillez raffraîchir la page`,
  'cc-addon-header.logs.link': `Voir les logs`,
  'cc-addon-header.rebuild.error': `Une erreur est survenue pendant le re-build de l'add-on`,
  'cc-addon-header.rebuild.success.message': /** @param {{logsUrl: string, docsUrl: string}} _ */ ({
    logsUrl,
    docsUrl,
  }) =>
    sanitize`Le processus de re-build et de redémarrage de votre add-on et de ses ressources est en cours.  Consultez les <cc-link href="${logsUrl}">logs</cc-link> ou la <cc-link href=${docsUrl}>documentation</cc-link> pour plus d'informations.`,
  'cc-addon-header.rebuild.success.title': `Re-build et redémarrage en cours`,
  'cc-addon-header.restart.error': `Une erreur est survenue pendant le redémarrage de l'add-on`,
  'cc-addon-header.restart.success.message': /** @param {{logsUrl: string, docsUrl: string}} _ */ ({
    logsUrl,
    docsUrl,
  }) =>
    sanitize`Le processus de redémarrage de votre add-on et de ses ressources est en cours. Consultez les <cc-link href="${logsUrl}">logs</cc-link> ou la <cc-link href=${docsUrl}>documentation</cc-link> pour plus d'informations.`,
  'cc-addon-header.restart.success.title': `Redémarrage en cours`,
  'cc-addon-header.state-msg.deployment-failed': `Le déploiement a échoué`,
  'cc-addon-header.state-msg.deployment-is-active': /** @param {{ providerId: string }} _ */ ({ providerId }) =>
    `Votre ${providerId === 'kubernetes' ? 'cluster' : 'instance'} ${providerId} est disponible !`,
  'cc-addon-header.state-msg.deployment-is-deploying': `En cours de déploiement…`,
  'cc-addon-header.state-msg.unknown-state': `État inconnu, essayez de redémarrer ou de contacter notre support si vous avez des questions`,
  //#endregion
  //#region cc-addon-info
  'cc-addon-info.billing.heading': `Facturation`,
  'cc-addon-info.creation-date.heading': `Date de création`,
  'cc-addon-info.creation-date.human-friendly-date': /** @param {{ date: string | number }} _ */ ({ date }) =>
    formatDatetime(date),
  'cc-addon-info.doc-link.cellar': `Cellar - Documentation`,
  'cc-addon-info.doc-link.elastic': `Elastic Stack - Documentation`,
  'cc-addon-info.doc-link.jenkins': `Jenkins - Documentation`,
  'cc-addon-info.doc-link.keycloak': `Keycloak - Documentation`,
  'cc-addon-info.doc-link.kubernetes': `Kubernetes - Documentation`,
  'cc-addon-info.doc-link.materia-kv': `Materia KV - Documentation`,
  'cc-addon-info.doc-link.matomo': `Matomo - Documentation`,
  'cc-addon-info.doc-link.metabase': `Metabase - Documentation`,
  'cc-addon-info.doc-link.otoroshi': `Otoroshi - Documentation`,
  'cc-addon-info.doc-link.pulsar': `Pulsar - Documentation`,
  'cc-addon-info.encryption.heading': `Chiffrement au repos`,
  'cc-addon-info.error': `Une erreur est survenue pendant le chargement des informations`,
  'cc-addon-info.grafana.link': `Ouvrir Grafana`,
  'cc-addon-info.heading': `Informations`,
  'cc-addon-info.last-ip.heading': `Dernière IP`,
  'cc-addon-info.number-of-members.heading': `Nombre de membres`,
  'cc-addon-info.number-of-peers.heading': `Nombre de pairs`,
  'cc-addon-info.plan.heading': `Plan`,
  'cc-addon-info.resources.heading': `Ressources`,
  'cc-addon-info.role.heading': `Rôle`,
  'cc-addon-info.scalability-link.heading': `Scalabilité`,
  'cc-addon-info.scalability.link': `Configurer la scalabilité`,
  'cc-addon-info.service.name.addon': /** @param {{name: string}} _ */ ({ name }) => `Add-on ${name}`,
  'cc-addon-info.service.name.app': /** @param {{name: string}} _ */ ({ name }) => `Application ${name}`,
  'cc-addon-info.specification.connection-limit': `Limite de connexions`,
  'cc-addon-info.specification.cpu': `vCPUs`,
  'cc-addon-info.specification.data-exploration': `Exploration des données`,
  'cc-addon-info.specification.databases': `Bases de données`,
  'cc-addon-info.specification.db-analysis': `Analyse BDD`,
  'cc-addon-info.specification.dedicated': `Dédié`,
  'cc-addon-info.specification.disk-size': `Taille du disque`,
  'cc-addon-info.specification.gpu': `GPUs`,
  'cc-addon-info.specification.has-logs': `Logs`,
  'cc-addon-info.specification.has-metrics': `Métriques`,
  'cc-addon-info.specification.heading': `Spécifications`,
  'cc-addon-info.specification.is-migratable': `Outil de migration`,
  'cc-addon-info.specification.max-db-size': `Taille BDD max`,
  'cc-addon-info.specification.memory': `RAM`,
  'cc-addon-info.specification.plan': `Plan`,
  'cc-addon-info.specification.users': `Utilisateurs`,
  'cc-addon-info.specification.version': `Version`,
  'cc-addon-info.subnet.heading': `Sous-réseau`,
  'cc-addon-info.total-content.buckets': `Buckets`,
  'cc-addon-info.total-content.heading': `Contenu`,
  'cc-addon-info.total-content.objects': `Objets`,
  'cc-addon-info.traffic.heading': `Trafic`,
  'cc-addon-info.traffic.inbound': `Entrant`,
  'cc-addon-info.traffic.inbound.inbound-in-bytes': /** @param {{bytes: number}} _ */ ({ bytes }) =>
    formatBytes(bytes, 1),
  'cc-addon-info.traffic.outbound': `Sortant`,
  'cc-addon-info.traffic.outbound.outbound-in-bytes': /** @param {{bytes: number}} _ */ ({ bytes }) =>
    formatBytes(bytes, 1),
  'cc-addon-info.type.boolean': /** @param {{boolean: boolean}} _ */ ({ boolean }) => `${boolean ? 'Oui' : 'Non'}`,
  'cc-addon-info.type.boolean-shared': /** @param {{shared: boolean}} _ */ ({ shared }) =>
    `${shared ? 'Partagé' : 'Dédié'}`,
  'cc-addon-info.type.bytes': /** @param {{bytes: number}} _ */ ({ bytes }) => formatBytes(bytes, 0, 3),
  'cc-addon-info.type.number': /** @param {{number: number}} _ */ ({ number }) => formatNumber(lang, number),
  'cc-addon-info.type.number-cpu-runtime': /** @param {{cpu: number, shared: boolean}} _ */ ({ cpu, shared }) => {
    return shared
      ? sanitize`<em title="Accès au vCPU moins prioritaire">${formatNumber(lang, cpu)}<code>*</code></em>`
      : formatNumber(lang, cpu);
  },
  'cc-addon-info.used-spaces.heading': `Stockage utilisé`,
  'cc-addon-info.used-spaces.size': `Taille`,
  'cc-addon-info.used-spaces.size.size-in-bytes': /** @param {{bytes: number}} _ */ ({ bytes }) =>
    formatBytes(bytes, 1),
  'cc-addon-info.version.btn': `Mise à jour disponible`,
  'cc-addon-info.version.dialog.btn.submit': `Mettre à jour et rebuild`,
  'cc-addon-info.version.dialog.desc': /** @param {{ url: string }} _ */ ({ url }) =>
    sanitize`Une ou plusieurs nouvelles versions sont disponibles. Choisissez la version que vous souhaitez appliquer et confirmez pour rebuild et redémarrer application. Consultez notre <cc-link href="${url}">Changelog</cc-link> pour en savoir plus.`,
  'cc-addon-info.version.dialog.heading': `Mise à jour disponible`,
  'cc-addon-info.version.dialog.select.desc': `Version actuelle`,
  'cc-addon-info.version.dialog.select.help': /** @param {{ currentVersion: string }} _ */ ({ currentVersion }) =>
    `Sélectionnez la version cible à mettre à jour à partir de ${currentVersion}`,
  'cc-addon-info.version.dialog.select.label': () => sanitize`<strong>vers</strong>`,
  'cc-addon-info.version.heading': `Version`,
  'cc-addon-info.version.update.error': `Une erreur est survenue pendant la mise à jour de la version`,
  'cc-addon-info.version.update.success.content': /** @param {{logsUrl: string}} _*/ ({ logsUrl }) =>
    sanitize`La mise à jour et le redémarrage de l'application est en cours. Consultez les <cc-link href="${logsUrl}">logs</cc-link>.`,
  'cc-addon-info.version.update.success.heading': /** @param {{ version: string }} _ */ ({ version }) =>
    `Mise à jour vers "${version}" en cours`,
  //#endregion
  //#region cc-addon-jenkins-options
  'cc-addon-jenkins-options.description': `Sélectionnez les options que vous souhaitez pour votre add-on Jenkins.`,
  'cc-addon-jenkins-options.title': `Options pour l'add-on Jenkins`,
  //#endregion
  //#region cc-addon-linked-apps
  'cc-addon-linked-apps.details': `Ci-dessous la liste des applications liées à l'add-on. L'add-on expose ses variables d'environnement aux applications qui lui sont liées.`,
  'cc-addon-linked-apps.loading-error': `Une erreur est survenue pendant le chargement des applications liées.`,
  'cc-addon-linked-apps.no-linked-applications': `Aucune application liée pour l'instant.`,
  'cc-addon-linked-apps.title': `Applications liées`,
  //#endregion
  //#region cc-addon-mongodb-options
  'cc-addon-mongodb-options.description': `Sélectionnez les options que vous souhaitez pour votre add-on MongoDB.`,
  'cc-addon-mongodb-options.title': `Options pour l'add-on MongoDB`,
  //#endregion
  //#region cc-addon-mysql-options
  'cc-addon-mysql-options.description': `Sélectionnez les options que vous souhaitez pour votre add-on MySQL.`,
  'cc-addon-mysql-options.title': `Options pour l'add-on MySQL`,
  //#endregion
  //#region cc-addon-option
  'cc-addon-option.disabled': `Désactivé`,
  'cc-addon-option.enabled': `Activé`,
  //#endregion
  //#region cc-addon-option-form
  'cc-addon-option-form.confirm': `Confirmer les options`,
  //#endregion
  //#region cc-addon-postgresql-options
  'cc-addon-postgresql-options.description': `Sélectionnez les options que vous souhaitez pour votre add-on PostgreSQL.`,
  'cc-addon-postgresql-options.title': `Options pour l'add-on PostgreSQL`,
  //#endregion
  //#region cc-addon-redis-options
  'cc-addon-redis-options.description': `Sélectionnez les options que vous souhaitez pour votre add-on Redis.`,
  'cc-addon-redis-options.title': `Options pour l'add-on Redis`,
  //#endregion
  //#region cc-ansi-palette
  'cc-ansi-palette.compliant': `Couleur qui respecte le RGAA`,
  'cc-ansi-palette.fg-bg': /** @param {{foreground: string, background: string}} _ */ ({ foreground, background }) =>
    `Texte\u00A0: ${foreground}, Fond\u00A0: ${background}`,
  'cc-ansi-palette.hover': /** @param {{color: string}} _ */ ({ color }) => `Survol\u00A0: ${color}`,
  'cc-ansi-palette.not-compliant': `Couleur qui ne respecte pas le RGAA`,
  'cc-ansi-palette.ratio': /** @param {{ratio: number}} _ */ ({ ratio }) =>
    formatNumber(lang, ratio, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(5, '0'),
  'cc-ansi-palette.selected': /** @param {{color: string}} _ */ ({ color }) => `Sélection\u00A0: ${color}`,
  //#endregion
  //#region cc-article-card
  'cc-article-card.date': /** @param {{date: string}} _ */ ({ date }) => formatDateOnly(date),
  //#endregion
  //#region cc-article-list
  'cc-article-list.error': `Une erreur est survenue pendant le chargement des articles.`,
  //#endregion
  //#region cc-beta
  'cc-beta.label': `bêta`,
  //#endregion
  //#region cc-block-details
  'cc-block-details.cli.text': `Ligne de commande`,
  //#endregion
  //#region cc-button
  'cc-button.cancel': `Cliquez pour annuler`,
  //#endregion
  //#region cc-cellar-bucket-list
  'cc-cellar-bucket-list.count': /** @param {{count: number}} _ */ ({ count }) => formatNumber(lang, count),
  'cc-cellar-bucket-list.create.bucket-name.help.case': `Les noms de bucket ne doivent pas contenir de caractères majuscules ou de tirets bas.`,
  'cc-cellar-bucket-list.create.bucket-name.help.ip': `Les noms de bucket ne peuvent pas être formatés comme une adresse IP.`,
  'cc-cellar-bucket-list.create.bucket-name.help.labels': `Les noms de bucket doivent être une série d'une ou plusieurs étiquettes. Les étiquettes adjacentes sont séparées par un point (.). Les noms de bucket peuvent contenir des lettres minuscules, des chiffres et des tirets. Chaque étiquette doit commencer et se terminer par une lettre minuscule ou un chiffre.`,
  'cc-cellar-bucket-list.create.bucket-name.help.size': `Les noms de bucket doivent contenir entre 3 et 63 caractères.`,
  'cc-cellar-bucket-list.create.bucket-name.help.start': `Les noms de bucket doivent commencer par une lettre minuscule ou un chiffre.`,
  'cc-cellar-bucket-list.create.bucket-name.label': `Nom du bucket`,
  'cc-cellar-bucket-list.create.error.bucket-already-exists': `Ce nom de bucket est déjà utilisé`,
  'cc-cellar-bucket-list.create.error.bucket-name-invalid': `Le nom de bucket est invalide`,
  'cc-cellar-bucket-list.create.error.too-many-buckets': `Vous avez atteint le nombre maximum de buckets. Vous ne pouvez pas en créer de nouveau.`,
  'cc-cellar-bucket-list.create.submit': `Créer le bucket`,
  'cc-cellar-bucket-list.create.title': `Créer un bucket`,
  'cc-cellar-bucket-list.date': /** @param {{date: string}} _ */ ({ date }) => formatDateOnly(date),
  'cc-cellar-bucket-list.details.actions.delete.button': `Supprimer le bucket`,
  'cc-cellar-bucket-list.details.actions.delete.must-be-empty': `Le bucket doit être vide pour être supprimé`,
  'cc-cellar-bucket-list.details.actions.title': `Actions`,
  'cc-cellar-bucket-list.details.heading': `Détails du bucket`,
  'cc-cellar-bucket-list.details.overview.created-at': `Date de création`,
  'cc-cellar-bucket-list.details.overview.date': /** @param {{date: string}} _ */ ({ date }) => formatDate(date),
  'cc-cellar-bucket-list.details.overview.objects-count': `Nombre d'objets`,
  'cc-cellar-bucket-list.details.overview.size': `Taille`,
  'cc-cellar-bucket-list.details.overview.size-in-bytes': /** @param {{size: number}} _ */ ({ size }) => {
    const formatted = formatBytes(size);
    const exact = `${formatNumber(lang, size)}${BYTES_SI_SEPARATOR}${BYTES_SYMBOL}`;
    return formatted === exact
      ? formatted
      : `${formatted} (${formatNumber(lang, size)}${BYTES_SI_SEPARATOR}octet${size <= 1 ? '' : 's'})`;
  },
  'cc-cellar-bucket-list.details.overview.title': `Aperçu du bucket`,
  'cc-cellar-bucket-list.details.overview.updated-at': `Dernière modification`,
  'cc-cellar-bucket-list.details.overview.versioning': `Versionnage`,
  'cc-cellar-bucket-list.details.overview.versioning.disabled': `Désactivé`,
  'cc-cellar-bucket-list.details.overview.versioning.enabled': `Activé`,
  'cc-cellar-bucket-list.details.overview.versioning.suspended': `Suspendu`,
  'cc-cellar-bucket-list.empty.no-filtered-items': `Aucun bucket ne correspond au filtre`,
  'cc-cellar-bucket-list.empty.no-items': `Vous n'avez aucun bucket`,
  'cc-cellar-bucket-list.error': `Une erreur est survenue pendant le chargement de la liste des buckets`,
  'cc-cellar-bucket-list.error.bucket-creation-failed': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `La création du bucket ${bucketName} a échoué`,
  'cc-cellar-bucket-list.error.bucket-deletion-failed': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `La suppression du bucket ${bucketName} a échoué`,
  'cc-cellar-bucket-list.error.bucket-fetch-failed': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Impossible de récupérer le bucket ${bucketName}`,
  'cc-cellar-bucket-list.error.bucket-not-empty': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Le bucket ${bucketName} ne peut pas être supprimé car il n'est pas vide`,
  'cc-cellar-bucket-list.error.bucket-not-found': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Le bucket ${bucketName} n'existe pas`,
  'cc-cellar-bucket-list.grid.a11y-name': `Liste des buckets`,
  'cc-cellar-bucket-list.grid.column.last-update': `Dernière modification`,
  'cc-cellar-bucket-list.grid.column.name': `Nom du bucket`,
  'cc-cellar-bucket-list.grid.column.objects': `Objets`,
  'cc-cellar-bucket-list.grid.column.size': `Taille`,
  'cc-cellar-bucket-list.grid.show-details.a11y-name': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Afficher les détails du bucket ${bucketName}`,
  'cc-cellar-bucket-list.heading.create.button': `Créer un bucket`,
  'cc-cellar-bucket-list.heading.filter.button': `Filtrer`,
  'cc-cellar-bucket-list.heading.filter.label': `Filtre`,
  'cc-cellar-bucket-list.heading.title': `Liste des buckets`,
  'cc-cellar-bucket-list.size': /** @param {{size: number}} _ */ ({ size }) => formatBytes(size),
  'cc-cellar-bucket-list.success.bucket-already-deleted': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Le bucket ${bucketName} était déjà supprimé`,
  'cc-cellar-bucket-list.success.bucket-created': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Le bucket ${bucketName} a été créé avec succès`,
  'cc-cellar-bucket-list.success.bucket-deleted': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Le bucket ${bucketName} a été supprimé avec succès`,
  //#endregion
  //#region cc-cellar-explorer
  'cc-cellar-explorer.error': `Une erreur est survenue pendant le chargement`,
  //#endregion
  //#region cc-cellar-object-list
  'cc-cellar-object-list.back-to-bucket-list': `Retour à la liste des buckets`,
  'cc-cellar-object-list.date': /** @param {{date: string}} _ */ ({ date }) => formatDateOnly(date),
  'cc-cellar-object-list.details.actions.delete.button': `Supprimer l'objet`,
  'cc-cellar-object-list.details.actions.download.button': `Télécharger l'objet`,
  'cc-cellar-object-list.details.actions.title': `Actions`,
  'cc-cellar-object-list.details.heading': `Détails de l'objet`,
  'cc-cellar-object-list.details.overview.content-type': `Content-Type`,
  'cc-cellar-object-list.details.overview.date': /** @param {{date: string}} _ */ ({ date }) => formatDate(date),
  'cc-cellar-object-list.details.overview.location': `Emplacement`,
  'cc-cellar-object-list.details.overview.size': `Taille`,
  'cc-cellar-object-list.details.overview.size-in-bytes': /** @param {{size: number}} _ */ ({ size }) => {
    const formatted = formatBytes(size);
    const exact = `${formatNumber(lang, size)}${BYTES_SI_SEPARATOR}${BYTES_SYMBOL}`;
    return formatted === exact
      ? formatted
      : `${formatted} (${formatNumber(lang, size)}${BYTES_SI_SEPARATOR}octet${size <= 1 ? '' : 's'})`;
  },
  'cc-cellar-object-list.details.overview.title': `Aperçu de l'objet`,
  'cc-cellar-object-list.details.overview.updated-at': `Dernière modification`,
  'cc-cellar-object-list.empty.no-filtered-items': `Aucun objet ne correspond au filtre`,
  'cc-cellar-object-list.empty.no-items': `Il n'y a aucun objet`,
  'cc-cellar-object-list.error': `Une erreur est survenue pendant le chargement de la liste des objets`,
  'cc-cellar-object-list.error.bucket-not-found': /** @param {{bucketName: string}} _ */ ({ bucketName }) =>
    `Le bucket ${bucketName} n'existe pas`,
  'cc-cellar-object-list.error.object-deletion-failed': /** @param {{objectKey: string}} _ */ ({ objectKey }) =>
    `La suppression de l'objet ${objectKey} a échoué`,
  'cc-cellar-object-list.error.object-fetch-failed': /** @param {{objectKey: string}} _ */ ({ objectKey }) =>
    `Impossible de récupérer l'objet ${objectKey}`,
  'cc-cellar-object-list.error.object-not-found': /** @param {{objectKey: string}} _ */ ({ objectKey }) =>
    `L'objet ${objectKey} n'existe pas`,
  'cc-cellar-object-list.grid.a11y-name': `Liste des objets`,
  'cc-cellar-object-list.grid.column.last-update': `Dernière modification`,
  'cc-cellar-object-list.grid.column.name': `Nom`,
  'cc-cellar-object-list.grid.column.size': `Taille`,
  'cc-cellar-object-list.grid.show-details.a11y-name': /** @param {{objectName: string}} _ */ ({ objectName }) =>
    `Afficher les détails de l'objet ${objectName}`,
  'cc-cellar-object-list.heading.filter.button': `Filtrer`,
  'cc-cellar-object-list.heading.filter.label': `Filtre`,
  'cc-cellar-object-list.heading.title': `Liste des objets`,
  'cc-cellar-object-list.icon.icon-file': `Fichier`,
  'cc-cellar-object-list.icon.icon-file-archive': `Archive`,
  'cc-cellar-object-list.icon.icon-file-audio': `Fichier audio`,
  'cc-cellar-object-list.icon.icon-file-image': `Fichier image`,
  'cc-cellar-object-list.icon.icon-file-pdf': `Fichier PDF`,
  'cc-cellar-object-list.icon.icon-file-text': `Fichier texte`,
  'cc-cellar-object-list.icon.icon-file-video': `Fichier vidéo`,
  'cc-cellar-object-list.nav-label': `File d'Ariane: Liste des objets`,
  'cc-cellar-object-list.page.next': `Page suivante`,
  'cc-cellar-object-list.page.previous': `Page précédente`,
  'cc-cellar-object-list.size': /** @param {{size: number}} _ */ ({ size }) => formatBytes(size),
  'cc-cellar-object-list.success.object-already-deleted': /** @param {{objectKey: string}} _ */ ({ objectKey }) =>
    `L'objet ${objectKey} était déjà supprimé`,
  'cc-cellar-object-list.success.object-deleted': /** @param {{objectKey: string}} _ */ ({ objectKey }) =>
    `L'objet ${objectKey} a été supprimé avec succès`,
  //#endregion
  //#region cc-clipboard
  'cc-clipboard.copied': `Le texte a été copié`,
  'cc-clipboard.copy': /** @param {{text: string}} _ */ ({ text }) =>
    `Copier dans le presse-papier - ${text.substring(0, 5).trim()}${text.length >= 5 ? '…' : ''}`,
  'cc-clipboard.copy.empty': `Copier dans le presse-papier`,
  //#endregion
  //#region cc-datetime-relative
  'cc-datetime-relative.distance': /** @param {{date: string|number}} _ */ ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': /** @param {{date: string|number}} _ */ ({ date }) => formatDate(date),
  //#endregion
  //#region cc-dialog
  'cc-dialog.close': `Fermer`,
  //#endregion
  //#region cc-dialog-confirm-actions
  'cc-dialog-confirm-actions.cancel': `Annuler`,
  //#endregion
  //#region cc-dialog-confirm-form
  'cc-dialog-confirm-form.error': /** @param {{ name: string }} _ */ ({ name }) =>
    `Valeur invalide. Saisissez "${name}" comme valeur`,
  //#endregion
  //#region cc-doc-card
  'cc-doc-card.link': /** @param {{link: string, product: string}} _ */ ({ link, product }) =>
    sanitize`<cc-link href=${link} a11y-desc="Lire la documentation - ${product}">Lire la documentation</cc-link>`,
  'cc-doc-card.skeleton-link-title': `Lire la documentation`,
  //#endregion
  //#region cc-doc-list
  'cc-doc-list.error': `Une erreur est survenue pendant le chargement de la documentation`,
  //#endregion
  //#region cc-domain-management
  'cc-domain-management.certif.automated': () =>
    sanitize`Que vous utilisiez <code>cleverapps.io</code> ou vos propres noms de domaine avec les applications hébergées par Clever Cloud, un certificat Let's Encrypt est automatiquement généré et renouvelé pour l'accès HTTPS/TLS. Vous n'avez rien à faire. Pour les cas spécifiques, reportez-vous à notre <cc-link href="${getDocUrl('/administrate/ssl')}" lang="en">documentation</cc-link>.`,
  'cc-domain-management.certif.custom': () =>
    sanitize`Vous pouvez fournir votre propre certificat grâce au <cc-link href="https://api.clever-cloud.com/v2/certificates/new">gestionnaire de certificats Clever Cloud</cc-link>.`,
  'cc-domain-management.certif.heading': `Sécurisez votre application`,
  'cc-domain-management.create-dialog.confirm-button': `Ajouter le domaine`,
  'cc-domain-management.create-dialog.desc': /** @param {{ domainWithPathPrefix: string }} _ */ ({
    domainWithPathPrefix,
  }) => sanitize`Le nom de domaine <code>${domainWithPathPrefix}</code> sera disponible en HTTP uniquement.`,
  'cc-domain-management.create-dialog.heading': `Sous-domaine disponible en HTTP uniquement`,
  'cc-domain-management.create-dialog.warning': () =>
    sanitize`Seuls les domaines directs de <code>cleverapps.io</code> bénéficient d'un certificat SSL, pas ceux de type <code>xx.yy.cleverapps.io</code>.`,
  'cc-domain-management.delete-dialog.confirm-button': `Supprimer`,
  'cc-domain-management.delete-dialog.desc': `Supprimer ce nom de domain rendra immédiatement votre application inaccessible depuis ce dernier.`,
  'cc-domain-management.delete-dialog.heading': `Supprimer le nom de domaine`,
  'cc-domain-management.delete-dialog.input-label': `Saisissez le nom de domaine pour confirmer la suppression`,
  'cc-domain-management.dns.a.desc': () =>
    sanitize`<p>Si vous choisissez d'utiliser des enregistrements de type <code>A</code>, par exemple pour un domaine racine (APEX), vous devrez vous-même assurer leur mise à jour. Pensez à suivre notre <cc-link href="${getDevHubUrl('/changelog')}" lang="en">changelog</cc-link> ou à lire la documentation de notre <cc-link href="${getDevHubUrl('/api/v4/#load-balancers')}" lang="en">API v4</cc-link> pour cela.</p>`,
  'cc-domain-management.dns.a.heading': `Enregistrements A`,
  'cc-domain-management.dns.a.label': `Valeurs d'enregistrement A`,
  'cc-domain-management.dns.cli.content.diag-conf-command': `Commande pour diagnostiquer l'installation actuelle\u00A0:`,
  'cc-domain-management.dns.cli.content.instruction': getCliInstructions,
  'cc-domain-management.dns.cname.desc': () =>
    sanitize`<p>Utiliser un enregistrement <code>CNAME</code> est fortement recommandé. Ainsi, votre configuration est automatiquement maintenue à jour.`,
  'cc-domain-management.dns.cname.heading': `Enregistrement CNAME`,
  'cc-domain-management.dns.cname.label': `Valeur d'enregistrement CNAME`,
  'cc-domain-management.dns.desc': () =>
    sanitize`<p>Afin de lier un domaine géré par un fournisseur tiers à votre application Clever Cloud, vous devez configurer votre zone DNS. Pour cela, vous pouvez utiliser un enregistrement <code>CNAME</code> ou <code>A</code>. L'enregistrement <code>CNAME</code> est à privilégier puisque vous n'aurez pas à le reconfigurer si nous modifions nos IP d'accès.</p>`,
  'cc-domain-management.dns.documentation.text': `Enregistrements DNS - Documentation`,
  'cc-domain-management.dns.heading': `Configurez vos DNS`,
  'cc-domain-management.dns.info.desc': () =>
    sanitize`Si vous bénéficiez d'un <span lang="en">load balancer</span> dédié, référez-vous à sa configuration ou <cc-link href="/ticket-center-choice">contactez le support</cc-link>. Notre équipe pourra également vous aider pour commander un tel service. Pour un domaine sans sous-domaine (APEX) ou un sous-domaine avec sa propre zone DNS, référez-vous à notre <cc-link href="${getDocUrl('/administrate/domain-names')}">documentation</cc-link>.`,
  'cc-domain-management.dns.info.heading': `Load balancers dédiés et cas spécifiques`,
  'cc-domain-management.dns.loading-error': `Une erreur est survenue pendant le chargement des informations DNS`,
  'cc-domain-management.form.domain.error.contains-path': /** @param {{path: string}} _ */ ({ path }) =>
    `Saisissez la partie "${path}" dans le champ "Route"`,
  'cc-domain-management.form.domain.error.empty': `Saisissez un nom de domaine`,
  'cc-domain-management.form.domain.error.format': `Saisissez un domaine valide, par exemple "example.com"`,
  'cc-domain-management.form.domain.error.wildcard': () =>
    sanitize`Saisissez un domaine valide.<br>Les <span lang="en">wildcard</span> "*" ne peuvent être utilisés qu'en sous-domaine, par exemple\u00A0: "*.example.com"`,
  'cc-domain-management.form.domain.help': () =>
    sanitize`Par exemple\u00A0: <code>example.com</code>, <code>*.example.com</code> ou <code>example.cleverapps.io</code>`,
  'cc-domain-management.form.domain.label': `Nom de domaine`,
  'cc-domain-management.form.info.cleverapps': () =>
    sanitize`Par défaut, une application se voit attribuer un nom de domaine de type <code>app_id.cleverapps.io</code>. Vous pouvez le supprimer ou changer le sous-domaine librement, mais <code>xxx.cleverapps.io</code> doit uniquement être utilisé à des fins de test (voir notre <cc-link href="${getDocUrl('/administrate/domain-names/#testing-with-cleverappsio-domain')}">documentation</cc-link>).`,
  'cc-domain-management.form.info.docs': `Vous pouvez associer un ou plusieurs noms de domaines à votre application. Le domaine principal sera utilisé dans les liens de la Console et dans les e-mails qui vous seront envoyés. Plusieurs applications peuvent partager un même domaine, chacune avec un sous-domaine et/ou une route spécifique.`,
  'cc-domain-management.form.path.help': () => sanitize`Par exemple\u00A0: <code>/api</code> ou <code>/blog</code>`,
  'cc-domain-management.form.path.label': `Route`,
  'cc-domain-management.form.submit': `Ajouter le domaine`,
  'cc-domain-management.form.submit.error': /** @param {{domain: string}} _ */ ({ domain }) =>
    `Une erreur est survenue lors de l'ajout du nom de domaine "${domain}"`,
  'cc-domain-management.form.submit.error-duplicate.heading': `Nom de domaine indisponible`,
  'cc-domain-management.form.submit.error-duplicate.text': /** @param {{domain: string}} _ */ ({ domain }) =>
    sanitize`<p>"${domain}" est déjà associé à une application au sein de Clever Cloud.</p><p>Contactez notre équipe support pour plus d'informations.</p>`,
  'cc-domain-management.form.submit.success': /** @param {{domain: string}} _ */ ({ domain }) =>
    `"${domain}" a bien été associé à votre application`,
  'cc-domain-management.form.submit.success-config': /** @param {{domain: string}} _ */ ({ domain }) =>
    sanitize`<p>"${domain}" a bien été associé à votre application.</p><p>Une configuration manuelle est nécessaire pour faire pointer votre domaine vers Clever Cloud. Consultez la section <strong>Configurez vos DNS</strong> pour plus d'informations.</p>`,
  'cc-domain-management.list.badge.http-only.alt': `Avertissement`,
  'cc-domain-management.list.badge.http-only.text': `HTTP uniquement`,
  'cc-domain-management.list.badge.primary': `Principal`,
  'cc-domain-management.list.badge.testing-only': `Tests uniquement`,
  'cc-domain-management.list.btn.delete.a11y-name': /** @param {{domain: string}} _ */ ({ domain }) =>
    `Supprimer le nom de domaine - ${domain}`,
  'cc-domain-management.list.btn.delete.text': `Supprimer`,
  'cc-domain-management.list.btn.primary.a11y-name': /** @param {{domain: string}} _ */ ({ domain }) =>
    `Définir comme nom de domaine principal - ${domain}`,
  'cc-domain-management.list.btn.primary.text': `Définir comme principal`,
  'cc-domain-management.list.delete.error': /** @param {{domain: string}} _ */ ({ domain }) =>
    `Une erreur est survenue lors de la suppression du nom de domaine "${domain}"`,
  'cc-domain-management.list.delete.success': /** @param {{domain: string}} _ */ ({ domain }) =>
    `"${domain}" a bien été supprimé`,
  'cc-domain-management.list.empty': `Aucun domaine associé à cette application`,
  'cc-domain-management.list.error-not-found.heading': `Nom de domaine introuvable`,
  'cc-domain-management.list.error-not-found.text': /** @param {{domain: string}} _ */ ({ domain }) =>
    sanitize`<p>"${domain}" a peut-être été supprimé après le chargement de la liste des domaines.</p><p><strong>Rechargez votre page</strong> pour récupérer la liste des domaines à jour.</p>`,
  'cc-domain-management.list.heading': `Noms de domaines liés à cette application`,
  'cc-domain-management.list.http-only.notice': () =>
    sanitize`Seuls les domaines directs de <code>cleverapps.io</code> bénéficient d’un certificat SSL, pas ceux de type <code>xx.yy.cleverapps.io</code>`,
  'cc-domain-management.list.link.title': /** @param {{domainUrl: string}} _ */ ({ domainUrl }) =>
    `Ouvrir - ${domainUrl} - nouvelle fenêtre`,
  'cc-domain-management.list.loading-error': `Une erreur est survenue pendant le chargement des domaines associés à cette application`,
  'cc-domain-management.list.primary.error': /** @param {{domain: string}} _ */ ({ domain }) =>
    `Une erreur est survenue lors du passage du nom de domaine "${domain}" en domaine principal`,
  'cc-domain-management.list.primary.success': /** @param {{domain: string}} _ */ ({ domain }) =>
    `"${domain}" a bien été défini comme nom de domaine principal`,
  'cc-domain-management.main-heading': `Gérez vos noms de domaine`,
  'cc-domain-management.names.cli.content.add-domain-command': `Ajouter un domaine\u00A0:`,
  'cc-domain-management.names.cli.content.diag-dns-records-command': `Diagnostiquer les enregistrements DNS\u00A0:`,
  'cc-domain-management.names.cli.content.instruction': getCliInstructions,
  'cc-domain-management.names.cli.content.intro': `
      Vous pouvez gérer les domaines directement depuis votre terminal grâce aux commandes ci-dessous.
    `,
  'cc-domain-management.names.cli.content.list-command': `Lister les domaines\u00A0:`,
  'cc-domain-management.names.documentation.text': `Noms de domaine - Documentation`,
  'cc-domain-management.new-window': `Nouvelle fenêtre`,
  'cc-domain-management.tls.certificates.documentation.text': `Certificats TLS - Documentation`,
  //#endregion
  //#region cc-drawer
  'cc-drawer.close': `Fermer`,
  //#endregion
  //#region cc-elasticsearch-info
  'cc-elasticsearch-info.documentation.text': `Elasticsearch - Documentation`,
  'cc-elasticsearch-info.error': `Une erreur est survenue pendant le chargement des liens des add-on liés à cette application.`,
  'cc-elasticsearch-info.info': `Info`,
  'cc-elasticsearch-info.link.apm': `Ouvrir APM`,
  'cc-elasticsearch-info.link.elasticsearch': `Voir l'add-on Elasticsearch`,
  'cc-elasticsearch-info.link.kibana': `Ouvrir Kibana`,
  'cc-elasticsearch-info.text': `Cet add-on fait partie de l'offre Suite Elastic. Vous pouvez retrouver la documentation ainsi que les différents services liés ci-dessous.`,
  //#endregion
  //#region cc-email-list
  'cc-email-list.loading.error': `Une erreur est survenue pendant le chargement des adresses e-mail.`,
  'cc-email-list.primary.action.resend-confirmation-email': `Envoyer un nouvel e-mail de confirmation`,
  'cc-email-list.primary.action.resend-confirmation-email.error': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`Une erreur est survenue pendant l'envoi de l'e-mail de confirmation à l'adresse <strong>${address}</strong>.`,
  'cc-email-list.primary.action.resend-confirmation-email.success.message': /** @param {{address: string}} _ */ ({
    address,
  }) =>
    sanitize`Pour terminer le processus vous devez confirmer votre inscription en cliquant sur le lien qui vous a été envoyé par e-mail à l'adresse <strong>${address}</strong>.`,
  'cc-email-list.primary.action.resend-confirmation-email.success.title': `Un e-mail de confirmation a été envoyé.`,
  'cc-email-list.primary.description': `Cette adresse est celle utilisée pour la création de votre compte. Toutes les notifications sont envoyées à cette adresse.`,
  'cc-email-list.primary.email.unverified': `Non vérifiée`,
  'cc-email-list.primary.email.verified': `Vérifiée`,
  'cc-email-list.primary.title': `Adresse e-mail principale`,
  'cc-email-list.secondary.action.add': `Ajouter l'adresse`,
  'cc-email-list.secondary.action.add.error': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`Une erreur est survenue lors de l'ajout de l'adresse e-mail secondaire <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.add.success.message': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`Pour terminer le processus vous devez confirmer votre inscription en cliquant sur le lien qui vous a été envoyé par e-mail à l'adresse <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.add.success.title': `L'ajout d'adresse e-mail secondaire a été pris en compte`,
  'cc-email-list.secondary.action.delete.accessible-name': /** @param {{address: string}} _ */ ({ address }) =>
    `Supprimer - ${address}`,
  'cc-email-list.secondary.action.delete.error': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`Une erreur est survenue lors de la suppression de l'adresse e-mail secondaire <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.delete.name': `Supprimer`,
  'cc-email-list.secondary.action.delete.success': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`L'adresse e-mail secondaire <strong>${address}</strong> a été supprimée avec succès.`,
  'cc-email-list.secondary.action.mark-as-primary.accessible-name': /** @param {{address: string}} _ */ ({ address }) =>
    `Définir comme primaire - ${address}`,
  'cc-email-list.secondary.action.mark-as-primary.error': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`Une erreur est survenue pendant le marquage en tant qu'adresse e-mail primaire <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.mark-as-primary.name': `Définir comme primaire`,
  'cc-email-list.secondary.action.mark-as-primary.success': /** @param {{address: string}} _ */ ({ address }) =>
    sanitize`L'adresse e-mail <strong>${address}</strong> a bien été définie comme primaire.`,
  'cc-email-list.secondary.address-input.error.already-defined': `Cette adresse e-mail vous appartient déjà`,
  'cc-email-list.secondary.address-input.error.used': `Cette adresse e-mail ne vous appartient pas`,
  'cc-email-list.secondary.address-input.format': `nom@example.com`,
  'cc-email-list.secondary.address-input.label': `Adresse e-mail`,
  'cc-email-list.secondary.description': `Contrairement à l'adresse principale, ces adresses e-mail ne reçoivent aucune notification. Vous pouvez également être invité dans une organisation avec l'une de vos adresses e-mail secondaires.`,
  'cc-email-list.secondary.title': `Adresses e-mail secondaires`,
  'cc-email-list.title': `Adresses e-mail`,
  //#endregion
  //#region cc-env-var-create
  'cc-env-var-create.create-button': `Ajouter`,
  'cc-env-var-create.errors.already-defined-name': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Le nom <code>${name}</code> est déjà défini`,
  'cc-env-var-create.errors.invalid-name': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'cc-env-var-create.info.java-prop': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`La variable <code>${name}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <cc-link href="${getDocUrl('/develop/env-variables/#environment-variables-rules-and-formats')}">plus de détails</cc-link>`,
  'cc-env-var-create.name.label': `Nom de la variable`,
  'cc-env-var-create.value.label': `Valeur de la variable`,
  //#endregion
  //#region cc-env-var-editor-expert
  'cc-env-var-editor-expert.errors.duplicated-name': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`attention, le nom <code>${name}</code> est déjà défini`,
  'cc-env-var-editor-expert.errors.invalid-line': () =>
    sanitize`cette ligne est invalide, le format correct est\u00A0: <code>NOM="VALEUR"</code>`,
  'cc-env-var-editor-expert.errors.invalid-name': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'cc-env-var-editor-expert.errors.invalid-name-strict': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Le nom <code>${name}</code> n'est pas valide en mode strict`,
  'cc-env-var-editor-expert.errors.invalid-value': () =>
    sanitize`la valeur est invalide, si vous utilisez des guillements, vous devez les échapper comme ceci\u00A0: <code>\\"</code> ou alors mettre toute la valeur entre guillemets.`,
  'cc-env-var-editor-expert.errors.line': `ligne`,
  'cc-env-var-editor-expert.errors.unknown': `Erreur inconnue`,
  'cc-env-var-editor-expert.example': () =>
    sanitize`Format\u00A0: <code>NOM_DE_LA_VARIABLE="valeur de la variable"</code> <br> Chaque variable doit être séparée par des sauts de ligne, <cc-link href="${getDocUrl('/develop/env-variables/#format')}">en savoir plus</cc-link>.`,
  'cc-env-var-editor-expert.info.java-prop': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`La variable <code>${name}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <cc-link href="${getDocUrl('/develop/env-variables/#environment-variables-rules-and-formats')}">plus de détails</cc-link>`,
  'cc-env-var-editor-expert.label': `Edition des variables. Format\u00A0: NOM_DE_LA_VARIABLE="valeur de la variable". Chaque variable doit être séparée par des sauts de ligne.`,
  //#endregion
  //#region cc-env-var-editor-json
  'cc-env-var-editor-json.errors.duplicated-name': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`attention, le nom <code>${name}</code> est déjà défini`,
  'cc-env-var-editor-json.errors.invalid-json': `Le JSON entré est invalide.`,
  'cc-env-var-editor-json.errors.invalid-json-entry': `Le JSON entré est un tableau d'objets JSON valide mais toutes les valeurs des propriétés doivent être de type string. Ex\u00A0: '[{ "name": "THE_NAME", "value": "the value" }]'`,
  'cc-env-var-editor-json.errors.invalid-json-format': `Le JSON entré est valide mais n'est pas au bon format. Le JSON doit être un tableau d'objets`,
  'cc-env-var-editor-json.errors.invalid-name': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'cc-env-var-editor-json.errors.invalid-name-strict': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Le nom <code>${name}</code> n'est pas valide en mode strict`,
  'cc-env-var-editor-json.errors.unknown': `Erreur inconnue`,
  'cc-env-var-editor-json.example': () =>
    sanitize`Format\u00A0: <code>{ "name": "NOM_DE_LA_VARIABLE", "value": "valeur de la variable" }</code> <br> Tableau d'objets respectant le format ci-dessus, <cc-link href="${getDocUrl('/develop/env-variables/#format')}">en savoir plus</cc-link>.`,
  'cc-env-var-editor-json.info.java-prop': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`La variable <code>${name}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <cc-link href="${getDocUrl('/develop/env-variables/#environment-variables-rules-and-formats')}">plus de détails</cc-link>`,
  'cc-env-var-editor-json.label': `Edition des variables. Tableau d'objets respectant le format\u00A0: { "name": "NOM_DE_LA_VARIABLE", "value": "valeur de la variable" }.`,
  //#endregion
  //#region cc-env-var-editor-simple
  'cc-env-var-editor-simple.empty-data': `Il n'y a pas de variable.`,
  //#endregion
  //#region cc-env-var-form
  'cc-env-var-form.cli.content.add-var-command': `Ajouter ou modifier une variable d'environnement\u00A0:`,
  'cc-env-var-form.cli.content.get-file-var-command': `Récupérer un fichier de variables d'environnement exécutable\u00A0:`,
  'cc-env-var-form.cli.content.instruction': getCliInstructions,
  'cc-env-var-form.cli.content.intro': `
        Vous pouvez gérer les variables d'environnement directement depuis votre terminal en utilisant les commandes ci-dessous.
    `,
  'cc-env-var-form.cli.content.list-var-command': `Lister les variables d'environnement\u00A0:`,
  'cc-env-var-form.description.config-provider': /** @param {{addonName: string}} _ */ ({ addonName }) =>
    sanitize`Ces valeurs seront injectées en tant que variables d'environnement dans les applications qui ont l'add-on <strong>${addonName}</strong> dans leurs services liés.<br>À chaque fois que vous mettez à jour les changements, toutes les applications dépendantes seront redémarrées automatiquement.`,
  'cc-env-var-form.description.env-var': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${appName}</strong>.`,
  'cc-env-var-form.description.exposed-config': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Configuration publiée pour les applications dépendantes. <cc-link href="${getDocUrl('/administrate/service-dependencies/#exposed-configuration')}">En savoir plus</cc-link><br>Ces variables ne seront pas injectées dans l'application <strong>${appName}</strong>, elles seront injectées en tant que variables d'environnement dans les applications qui ont <strong>${appName}</strong> dans leurs services liés.`,
  'cc-env-var-form.documentation.text': `Variables d’environnement - Référence`,
  'cc-env-var-form.error.loading': `Une erreur est survenue pendant le chargement des variables.`,
  'cc-env-var-form.heading.config-provider': `Variables`,
  'cc-env-var-form.heading.env-var': `Variables d'environnement`,
  'cc-env-var-form.heading.exposed-config': `Configuration publiée`,
  'cc-env-var-form.mode.expert': `Expert`,
  'cc-env-var-form.mode.simple': `Simple`,
  'cc-env-var-form.redeploy.error': `Une erreur est survenue lors du redémarrage de votre application`,
  'cc-env-var-form.redeploy.error.app-stopped': `L'application n'a jamais été déployée donc elle ne peut pas être redéployée. Poussez un commit pour lancer un déploiement.`,
  'cc-env-var-form.redeploy.success.heading': `Redémarrage en cours`,
  'cc-env-var-form.redeploy.success.text': /** @param {{ logsUrl: string }} _ */ ({ logsUrl }) =>
    sanitize`Le processus de redémarrage de votre application est en cours. Consultez les <cc-link href="${logsUrl}">logs</cc-link>`,
  'cc-env-var-form.reset': `Annuler les changements`,
  'cc-env-var-form.restart-app': `Redémarrer l'app pour appliquer les changements`,
  'cc-env-var-form.update': `Mettre à jour les changements`,
  'cc-env-var-form.update.error': `Une erreur est survenue pendant la mise à jour des variables.`,
  'cc-env-var-form.update.success': `Les variables ont été mises à jour avec succès.`,
  //#endregion
  //#region cc-env-var-input
  'cc-env-var-input.delete-button': `Enlever`,
  'cc-env-var-input.keep-button': `Garder`,
  'cc-env-var-input.value-label': /** @param {{variableName: string}} _ */ ({ variableName }) =>
    `valeur de la variable ${variableName}`,
  'cc-env-var-input.value-placeholder': `valeur de la variable`,
  //#endregion
  //#region cc-env-var-linked-services
  'cc-env-var-linked-services.description.addon': /** @param {{serviceName: string, appName: string}} _ */ ({
    serviceName,
    appName,
  }) => {
    return sanitize`Liste des variables exposées par l'add-on <strong>${serviceName}</strong>.<br>Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${appName}</strong>.`;
  },
  'cc-env-var-linked-services.description.app': /** @param {{serviceName: string, appName: string}} _ */ ({
    serviceName,
    appName,
  }) => {
    return sanitize`Configuration publiée par l'application <strong>${serviceName}</strong>.<br>Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${appName}</strong>.`;
  },
  'cc-env-var-linked-services.empty.addon': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Aucun add-on lié à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.empty.app': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Aucune application liée à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.addon': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Une erreur est survenue pendant le chargement des add-ons liés à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.addon.without-app-name': `Une erreur est survenue pendant le chargement des add-ons liés à l'application.`,
  'cc-env-var-linked-services.error.app': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Une erreur est survenue pendant le chargement des applications liées à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.app.without-app-name': `Une erreur est survenue pendant le chargement des applications liées à l'application.`,
  'cc-env-var-linked-services.heading.addon': /** @param {{name: string}} _ */ ({ name }) => `Add-on\u00A0: ${name}`,
  'cc-env-var-linked-services.heading.app': /** @param {{name: string}} _ */ ({ name }) => `Application\u00A0: ${name}`,
  'cc-env-var-linked-services.loading.addon': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Chargement des variables exposées par les add-ons liés à <strong>${appName}</strong>…`,
  'cc-env-var-linked-services.loading.app': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Chargement de la configuration publiée par les applications liées à <strong>${appName}</strong>…`,
  //#endregion
  //#region cc-feature-list
  'cc-feature-list.documentation-link': `Voir la documentation`,
  'cc-feature-list.error': `Une erreur s'est produite lors du chargement des fonctionnalités expérimentales disponibles`,
  'cc-feature-list.feedback-link': `Donnez votre avis`,
  'cc-feature-list.no-data': `Aucune fonctionnalité expérimentale n'est disponible pour le moment`,
  'cc-feature-list.notice': `La modificiation de fonctionnalités expérimentales nécessite un rechargement de la page`,
  'cc-feature-list.status.alpha': `Alpha`,
  'cc-feature-list.status.beta': `Beta`,
  'cc-feature-list.status.preview': `Aperçu`,
  'cc-feature-list.title': `Fonctionnalités expérimentales`,
  //#endregion
  //#region cc-grafana-info
  'cc-grafana-info.disable-description': `Désactiver Grafana supprimera et mettra fin aux accès à l'organisation du Grafana. Vous pourrez toujours recréer une nouvelle organisation Grafana.`,
  'cc-grafana-info.disable-title': `Désactiver Grafana`,
  'cc-grafana-info.disable.error': `Une erreur s'est produite lors de la désactivation des tableaux de bord du Grafana.`,
  'cc-grafana-info.disable.success': `Les tableaux de bords du Grafana ont été désactivés avec succès.`,
  'cc-grafana-info.documentation-description': `Ce service est utilisé pour visualiser nos métriques. Vous pouvez trouver la documentation et les détails de ces métriques ici.`,
  'cc-grafana-info.documentation-title': `Documentation`,
  'cc-grafana-info.documentation.text': `Métriques avec Grafana - Documentation`,
  'cc-grafana-info.enable-description': `L'activation de Grafana créera et fournira les accès à une organisation Grafana.`,
  'cc-grafana-info.enable-title': `Activer Grafana`,
  'cc-grafana-info.enable.error': `Une erreur s'est produite lors de l'activation des tableaux de bord du Grafana.`,
  'cc-grafana-info.enable.success': `Les tableaux de bords du Grafana ont été activés avec succès.`,
  'cc-grafana-info.error-link-grafana': `Une erreur s'est produite lors du chargement du lien du Grafana.`,
  'cc-grafana-info.error-loading': `Une erreur s'est produite lors du chargement de l'état du Grafana.`,
  'cc-grafana-info.grafana-link-description': `Lien vers le Grafana qui contient les tableaux de bord des métriques Clever Cloud.`,
  'cc-grafana-info.grafana-link-title': `Grafana`,
  'cc-grafana-info.link.doc': `Lire la documentation`,
  'cc-grafana-info.link.grafana': `Ouvrir Grafana`,
  'cc-grafana-info.loading-title': `Grafana`,
  'cc-grafana-info.main-title': `Métriques avec Grafana`,
  'cc-grafana-info.reset-description': `Réinitialisez tous les tableaux de bord Clever Cloud à leur état initial.`,
  'cc-grafana-info.reset-title': `Réinitialiser tous les tableaux de bord`,
  'cc-grafana-info.reset.error': `Une erreur s'est produite lors de la réinitialisation des tableaux de bord du Grafana.`,
  'cc-grafana-info.reset.success': `Les tableaux de bords du grafana ont été réinitialisés avec succès.`,
  'cc-grafana-info.screenshot.addon.alt': `Capture d'écran d'un tableau de bord d'add-on dans Grafana`,
  'cc-grafana-info.screenshot.addon.description': () =>
    sanitize`Ce tableau de bord comprend plusieurs graphiques à propos d'un add-on. <br> Il fournit d'abord un panneau de présentation contenant les métriques système telles que <strong> le processeur, la mémoire, les disques et le réseau</strong>. <br> Pour les add-ons <strong>MySQL, PostgreSQL, MongoDB et Redis</strong>, un second panneau présente la base de données et des informations comme <strong>le nombre de connexions, de requêtes ou de transactions, d'erreurs ou de blocages ou encore d'opérations "tuples"<strong>.`,
  'cc-grafana-info.screenshot.addon.title': `Aperçu du tableau de bord d'add-on`,
  'cc-grafana-info.screenshot.organisation.alt': `Capture d'écran d'un tableau de bord d'organisation dans Grafana`,
  'cc-grafana-info.screenshot.organisation.description': () =>
    sanitize`Ce tableau de bord comprend plusieurs graphiques pour une organisation Clever Cloud. <br> Il fournit un graphique résumant le nombre d'<strong>applications (runtimes) et d'add-ons déployés</strong>. Il contient également le nombre de services <strong>par type</strong> ou <strong>par plan (flavor)</strong>. <br> Le <strong>graphique d'état</strong> affiche un état pour tous les déploiements effectués durant la plage de temps de Grafana. <br> Et enfin, il est possible de récupérer des <strong>liens globaux et spécifiques</strong> (triés par nombre de requêtes) pour accéder au tableau de bord d'une application (runtime) ou d'un add-on.`,
  'cc-grafana-info.screenshot.organisation.title': `Aperçu du tableau de bord d'organisation`,
  'cc-grafana-info.screenshot.runtime.alt': `Capture d'écran d'un tableau de bord d'application (runtime) dans Grafana`,
  'cc-grafana-info.screenshot.runtime.description': () =>
    sanitize`Ce tableau de bord comprend un <strong>panneau de présentation</strong> pour obtenir des informations rapides sur une application, ainsi que plusieurs panneaux présentant leurs métriques système. <br> Il fournit un graphique reprenant l'état <strong>du processeur, de la mémoire, des disques et du réseau</strong>. <br> Pour chaque groupe de métriques, le panneau contient des graphes d'utilisation, des jauges ou encore un indicateur de remplissage (basé sur le résultat d'une prédiction linéaire effectuée sur les données de l'intervalle de temps fixé dans Grafana). Cet indicateur donne la durée attendue avant que les métriques ne dépassent 90%.`,
  'cc-grafana-info.screenshot.runtime.title': `Aperçu du tableau de bord d'application (runtime)`,
  //#endregion
  //#region cc-header-addon
  'cc-header-addon.creation-date': `Date de création`,
  'cc-header-addon.creation-date.full': /** @param {{date: string|number}} _ */ ({ date }) => formatDate(date),
  'cc-header-addon.creation-date.short': /** @param {{date: string|number}} _ */ ({ date }) => formatDateOnly(date),
  'cc-header-addon.error': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  'cc-header-addon.id-label': `Identifiant de l'add-on`,
  'cc-header-addon.id-label-alternative': () =>
    sanitize`Identifiant alternatif de l'add-on (<span lang="en">real id</span>)`,
  'cc-header-addon.plan': `Plan`,
  'cc-header-addon.version': `Version`,
  //#endregion
  //#region cc-header-app
  'cc-header-app.action.cancel-deployment': `Annuler le déploiement`,
  'cc-header-app.action.restart': `Redémarrer`,
  'cc-header-app.action.restart-last-commit': `Redémarrer le dernier commit poussé`,
  'cc-header-app.action.restart-rebuild': `Re-build et redémarrer`,
  'cc-header-app.action.start': `Démarrer`,
  'cc-header-app.action.start-last-commit': `Démarrer le dernier commit poussé`,
  'cc-header-app.action.start-rebuild': `Re-build et démarrer`,
  'cc-header-app.action.stop': `Arrêter l'application`,
  'cc-header-app.commits.git': /** @param {{commit: string}} _ */ ({ commit }) =>
    `version du dépôt git (HEAD)\u00A0: ${commit}`,
  'cc-header-app.commits.no-commits': `pas encore de commit`,
  'cc-header-app.commits.running': /** @param {{commit: string}} _ */ ({ commit }) =>
    `version en ligne\u00A0: ${commit}`,
  'cc-header-app.commits.starting': /** @param {{commit: string}} _ */ ({ commit }) =>
    `version en cours de déploiement\u00A0: ${commit}`,
  'cc-header-app.disable-buttons': `Vous n'êtes pas autorisé à réaliser ces actions`,
  'cc-header-app.error': `Une erreur est survenue pendant le chargement des informations de l'application.`,
  'cc-header-app.read-logs': `voir les logs`,
  'cc-header-app.state-msg.app-is-restarting': `L'application redémarre…`,
  'cc-header-app.state-msg.app-is-running': `Votre application est disponible\u202f!`,
  'cc-header-app.state-msg.app-is-starting': `L'application démarre…`,
  'cc-header-app.state-msg.app-is-stopped': `L'application est arrêtée.`,
  'cc-header-app.state-msg.last-deploy-failed': `Le dernier déploiement a échoué,`,
  'cc-header-app.state-msg.unknown-state': `État inconnu, essayez de redémarrer l'application ou de contacter notre support si vous avez des questions.`,
  'cc-header-app.user-action-msg.app-will-start': `L'application va bientôt démarrer…`,
  'cc-header-app.user-action-msg.app-will-stop': `L'application va s'arrêter…`,
  'cc-header-app.user-action-msg.deploy-cancelled': `Ce déploiement a été annulé.`,
  'cc-header-app.user-action-msg.deploy-will-begin': `Un déploiement va bientôt commencer…`,
  //#endregion
  //#region cc-header-orga
  'cc-header-orga.error': `Une erreur est survenue pendant le chargement des informations de l'organisation.`,
  'cc-header-orga.hotline': `Numéro d'urgence\u00A0:`,
  //#endregion
  //#region cc-heptapod-info
  'cc-heptapod-info.description': () =>
    sanitize`Cette instance Heptapod héberge des dépôts Mercurial. Plus d'informations sur <cc-link href="https://about.heptapod.host">https://about.heptapod.host</cc-link>.`,
  'cc-heptapod-info.documentation.text': `Heptapod - Documentation`,
  'cc-heptapod-info.error-loading': `Une erreur est survenue pendant le chargement des informations d'utilisation.`,
  'cc-heptapod-info.not-in-use': `Vous n'utilisez pas ce service Heptapod.`,
  'cc-heptapod-info.price-description': `Prix estimé`,
  'cc-heptapod-info.price-value': /** @param {{price: number}} _ */ ({ price }) =>
    `${formatCurrency(lang, price)} / mois`,
  'cc-heptapod-info.private-active-users-description': `Utilisateurs privés`,
  'cc-heptapod-info.public-active-users-description': `Utilisateurs publics`,
  'cc-heptapod-info.storage-bytes': /** @param {{storage: number}} _ */ ({ storage }) => formatBytes(storage, 1),
  'cc-heptapod-info.storage-description': `Stockage utilisé`,
  //#endregion
  //#region cc-homepage-onboarding
  'cc-homepage-onboarding.card.cli.button': `Installer le CLI`,
  'cc-homepage-onboarding.card.cli.description': `Gérez les applications, évoluez les ressources et rationalisez les flux de travail directement depuis votre terminal.`,
  'cc-homepage-onboarding.card.cli.title': `Utilisez Clever Tools CLI`,
  'cc-homepage-onboarding.card.config-payment.button': `Ajouter un paiement`,
  'cc-homepage-onboarding.card.config-payment.description': `Ajoutez un moyen de paiement valide, pour éviter toute suspension de vos services et la suppression de vos données.`,
  'cc-homepage-onboarding.card.config-payment.title': `Configurez le paiement`,
  'cc-homepage-onboarding.card.new-organisation.button': `Créer une organisation`,
  'cc-homepage-onboarding.card.new-organisation.description': `Créez une nouvelle organisation pour regrouper et lancer des applications, des  add-ons, des bases de données, du stockage...`,
  'cc-homepage-onboarding.card.new-organisation.title': `Créez une nouvelle organisation`,
  'cc-homepage-onboarding.card.new-project.button': `Créer une organisation`,
  'cc-homepage-onboarding.card.new-project.description': `Créez une nouvelle organisation pour regrouper et lancer des applications, des add-ons, des bases de données, du stockage...`,
  'cc-homepage-onboarding.card.new-project.title': `Démarrez un nouveau projet`,
  'cc-homepage-onboarding.card.new-resource.button': `Ajouter une ressource`,
  'cc-homepage-onboarding.card.new-resource.description': `Ajoutez des applications, add-ons, bases de données, stockage...`,
  'cc-homepage-onboarding.card.new-resource.select.placeholder': `-- Sélectionner --`,
  'cc-homepage-onboarding.card.new-resource.select.title': `Choisir une organisation`,
  'cc-homepage-onboarding.card.new-resource.title': `Lancez une nouvelle ressource`,
  'cc-homepage-onboarding.card.secure.button': `Activer le 2FA`,
  'cc-homepage-onboarding.card.secure.description': `Améliorez la sécurité de votre compte avec la 2FA, fortement recommandé pour protéger votre accès.`,
  'cc-homepage-onboarding.card.secure.title': `Sécurisez votre compte`,
  'cc-homepage-onboarding.card.ssh-keys.button': `Ajouter une clé SSH`,
  'cc-homepage-onboarding.card.ssh-keys.description': `Sécurisez vos connexions et simplifiez l'accès aux serveurs avec l'authentification par clé SSH.`,
  'cc-homepage-onboarding.card.ssh-keys.title': `Configurez les clés SSH`,
  'cc-homepage-onboarding.card.support.button': `Contacter le support`,
  'cc-homepage-onboarding.card.support.description': `Obtenez une assistance personnalisée de notre équipe de support dédiée chaque fois que vous en avez besoin.`,
  'cc-homepage-onboarding.card.support.title': `Contactez un expert`,
  'cc-homepage-onboarding.close': `Fermer ce bloc d'accueil`,
  'cc-homepage-onboarding.description.already-user': `Choisissez votre prochaine action et continuez à construire des choses incroyables`,
  'cc-homepage-onboarding.description.new-user': `Commencez par créer votre première organisation et projet. Rejoignez l'écosystème de Clever Cloud et découvrez un déploiement sans faille. Nouveau sur la plateforme ? Essayez nos projets préconçus ou contactez-nous pour une assistance personnalisée.`,
  'cc-homepage-onboarding.error': `Une erreur est survenue lors du chargement des données d'accueil.`,
  'cc-homepage-onboarding.title.already-user': `Continuez à créer`,
  'cc-homepage-onboarding.title.new-user': `Prêt à commencer et à déployer ?`,
  //#endregion
  //#region cc-homepage-video
  'cc-homepage-video.iframe-title': `Vidéo YouTube`,
  'cc-homepage-video.link': `Voir notre chaîne YouTube`,
  'cc-homepage-video.play': `Miniature de la vidéo YouTube Lancer la vidéo`,
  'cc-homepage-video.title': `Voir nos vidéos`,
  //#endregion
  //#region cc-input-date
  'cc-input-date.error.bad-input': /** @param {{ date: string }} _ */ ({ date }) =>
    sanitize`Saisissez une date. <br> Par exemple\u00A0: ${date}.`,
  'cc-input-date.error.empty': `Saisissez une valeur`,
  'cc-input-date.error.range-overflow': /** @param {{max: string}} _ */ ({ max }) =>
    `Saisissez une date inférieure à ${max}`,
  'cc-input-date.error.range-underflow': /** @param {{min: string}} _ */ ({ min }) =>
    `Saisissez une date supérieure à ${min}`,
  'cc-input-date.help': `Format\u00A0: AAAA-MM-JJ HH:MM:SS`,
  'cc-input-date.keyboard-hint': `Vous pouvez utiliser les touches flèche haut et flèche bas pour modifier des parties de la date.`,
  'cc-input-date.required': `obligatoire`,
  //#endregion
  //#region cc-input-number
  'cc-input-number.decrease': `décrémenter`,
  'cc-input-number.error.bad-type': `Saisissez un nombre`,
  'cc-input-number.error.empty': `Saisissez une valeur`,
  'cc-input-number.error.range-overflow': /** @param {{max: string}} _ */ ({ max }) =>
    `Saisissez un nombre inférieur ou égal à ${max}`,
  'cc-input-number.error.range-underflow': /** @param {{min: string}} _ */ ({ min }) =>
    `Saisissez un nombre supérieur ou égal à ${min}`,
  'cc-input-number.increase': `incrémenter`,
  'cc-input-number.required': `obligatoire`,
  //#endregion
  //#region cc-input-text
  'cc-input-text.error.bad-email': () => sanitize`Format d'adresse e-mail invalide.<br>Exemple: john.doe@example.com.`,
  'cc-input-text.error.empty': `Saisissez une valeur`,
  'cc-input-text.error.empty.email': `Saisissez une adresse e-mail`,
  'cc-input-text.required': `obligatoire`,
  'cc-input-text.secret.hide': `Cacher le secret`,
  'cc-input-text.secret.show': `Afficher le secret`,
  //#endregion
  //#region cc-invoice
  'cc-invoice.download-pdf': `Télécharger le PDF`,
  'cc-invoice.error': `Une erreur est survenue pendant le chargement de la facture.`,
  'cc-invoice.info': /** @param {{date: string|number, amount: number, currency: string }} _ */ ({
    date,
    amount,
    currency,
  }) => {
    return sanitize`Cette facture a été émise le <strong>${formatDateOnly(date)}</strong> pour un total de <strong>${formatCurrency(lang, amount, { currency })}</strong>.`;
  },
  'cc-invoice.title': `Facture`,
  //#endregion
  //#region cc-invoice-list
  'cc-invoice-list.documentation.text': `Facturation chez Clever Cloud - Documentation`,
  'cc-invoice-list.error': `Une erreur est survenue pendant le chargement des factures.`,
  'cc-invoice-list.pending': `Factures en attente de paiement`,
  'cc-invoice-list.pending.no-invoices': `Il n'y a aucune facture en attente de paiement pour le moment.`,
  'cc-invoice-list.processed': `Factures réglées`,
  'cc-invoice-list.processed.no-invoices': `Il n'y a aucune facture réglée pour le moment.`,
  'cc-invoice-list.processing': `Factures dont le paiement est en cours de validation`,
  'cc-invoice-list.title': `Factures`,
  'cc-invoice-list.year': `Année\u00A0:`,
  //#endregion
  //#region cc-invoice-table
  'cc-invoice-table.date.emission': `Date d'émission`,
  'cc-invoice-table.date.value': /** @param {{date: string|number}} _ */ ({ date }) => `${formatDateOnly(date)}`,
  'cc-invoice-table.number': `Numéro`,
  'cc-invoice-table.open-pdf': `Télécharger le PDF`,
  'cc-invoice-table.pay': `Régler`,
  'cc-invoice-table.text': /** @param {{number: number, date: string|number, amount: number, currency: string}} _ */ ({
    number,
    date,
    amount,
    currency,
  }) =>
    sanitize`Facture <strong>${number}</strong> émise le <strong>${formatDateOnly(date)}</strong> pour un total de <code>${formatCurrency(lang, amount, { currency })}</code>`,
  'cc-invoice-table.total.label': `Total`,
  'cc-invoice-table.total.value': /** @param {{amount: number, currency: string}} _ */ ({ amount, currency }) =>
    `${formatCurrency(lang, amount, { currency })}`,
  //#endregion
  //#region cc-jenkins-info
  'cc-jenkins-info.documentation.text': `Jenkins - Documentation`,
  'cc-jenkins-info.error': `Une erreur est survenue pendant le chargement des informations liées à cet add-on.`,
  'cc-jenkins-info.info': `Info`,
  'cc-jenkins-info.open-jenkins.link': `Accéder à Jenkins`,
  'cc-jenkins-info.open-jenkins.text': `Accédez à Jenkins de manière authentifiée via le SSO (Single Sign-On) Clever Cloud. Les différents membres de l'organisation peuvent accéder au service Jenkins.`,
  'cc-jenkins-info.open-jenkins.title': `Accéder à Jenkins`,
  'cc-jenkins-info.text': `Cet add-on fait partie de l'offre Jenkins. Vous pouvez retrouver la documentation ainsi que différentes informations ci-dessous.`,
  'cc-jenkins-info.update.new-version': /** @param {{version: string}} _ */ ({ version }) =>
    `La version ${version} de Jenkins est disponible\u202f!`,
  'cc-jenkins-info.update.text': `Jenkins et ses plugins reçoivent régulièrement des mises à jour. Vous pouvez mettre à jour automatiquement votre instance ainsi que ses plugins à travers l'interface Jenkins.`,
  'cc-jenkins-info.update.title': `Mises à jour`,
  'cc-jenkins-info.update.up-to-date': `Votre version de Jenkins est à jour`,
  //#endregion
  //#region cc-kv-explorer
  'cc-kv-explorer.details.empty': `Sélectionnez une clé pour en récupérer le contenu`,
  'cc-kv-explorer.details.unsupported': `Le type de la clé sélectionnée n'est pas supporté`,
  'cc-kv-explorer.error.add-key': `Une erreur est survenue lors de l'ajout de la clé`,
  'cc-kv-explorer.error.delete-key': `Une erreur est survenue lors de la suppression de la clé`,
  'cc-kv-explorer.error.fetch-keys.filtering': `Une erreur est survenue lors du filtrage des clés.`,
  'cc-kv-explorer.error.fetch-keys.loading': `Une erreur est survenue lors de la récupération des clés.`,
  'cc-kv-explorer.error.fetch-keys.loading-more': `Une erreur est survenue lors de la récupération des clés.`,
  'cc-kv-explorer.error.fetch-keys.refreshing': `Une erreur est survenue lors du rafraîchissement des clés.`,
  'cc-kv-explorer.error.fetch-keys.retry': `Réessayer`,
  'cc-kv-explorer.error.get-key': `Une erreur est survenue lors de la récupération de la clé`,
  'cc-kv-explorer.error.key-doesnt-exist': `La clé n'existe plus`,
  'cc-kv-explorer.filter.all': `Tous`,
  'cc-kv-explorer.filter.apply': `Appliquer le filtre`,
  'cc-kv-explorer.filter.by-pattern': `Filtrer les clés par pattern`,
  'cc-kv-explorer.filter.by-type': `Filtrer par type`,
  'cc-kv-explorer.form.add': `Ajouter`,
  'cc-kv-explorer.form.error.already-used': `Ce nom de clé est déjà utilisé`,
  'cc-kv-explorer.form.key': `Nom de la clé`,
  'cc-kv-explorer.form.reset': `Annuler`,
  'cc-kv-explorer.form.string.value': `Valeur`,
  'cc-kv-explorer.form.type': `Type de clé`,
  'cc-kv-explorer.key.delete': /** @param {{index: number}} _ */ ({ index }) => `Supprimer la clé à l'index ${index}`,
  'cc-kv-explorer.key.header.copy': `Copier le nom de la clé dans le presse-papier`,
  'cc-kv-explorer.key.header.delete': `Supprimer`,
  'cc-kv-explorer.key.type.hash': `Hash`,
  'cc-kv-explorer.key.type.list': `List`,
  'cc-kv-explorer.key.type.set': `Set`,
  'cc-kv-explorer.key.type.string': `String`,
  'cc-kv-explorer.keys.empty': `La base de données est vide\u202f!`,
  'cc-kv-explorer.keys.empty.create-key': `Créez une clé`,
  'cc-kv-explorer.keys.header.add-key': `clé`,
  'cc-kv-explorer.keys.header.add-key.a11y': `Ajouter une clé`,
  'cc-kv-explorer.keys.header.refresh': `Rafraichir`,
  'cc-kv-explorer.keys.header.total': /** @param {{total: number}} _ */ ({ total }) =>
    `${formatNumber(lang, total)} ${plural(total, 'clé')}`,
  'cc-kv-explorer.keys.no-results': `Aucun résultat ne correspond au filtre`,
  'cc-kv-explorer.loading.error': `Une erreur est survenue lors de la connection à la base`,
  'cc-kv-explorer.success.add-key': `La clé a été ajoutée`,
  'cc-kv-explorer.success.delete-key': `La clé a été supprimée`,
  //#endregion
  //#region cc-kv-hash-explorer
  'cc-kv-hash-explorer.add-form.element-field': `Champ`,
  'cc-kv-hash-explorer.add-form.element-value': `Valeur`,
  'cc-kv-hash-explorer.add-form.submit': `Ajouter`,
  'cc-kv-hash-explorer.add-form.submit.a11y': `Ajouter le champ`,
  'cc-kv-hash-explorer.element.copy': /** @param {{index: number}} _ */ ({ index }) =>
    `Copier la valeur du champ à l'index ${index} dans le presse-papier`,
  'cc-kv-hash-explorer.element.delete': /** @param {{index: number}} _ */ ({ index }) =>
    `Supprimer le champ à l'index ${index}`,
  'cc-kv-hash-explorer.element.edit.cancel': `Annuler l'édition de la valeur`,
  'cc-kv-hash-explorer.element.edit.save': `Modifier la valeur`,
  'cc-kv-hash-explorer.element.edit.start': /** @param {{index: number}} _ */ ({ index }) =>
    `Éditer la valeur du champ à l'index ${index}`,
  'cc-kv-hash-explorer.element.edit.value-input': `Valeur`,
  'cc-kv-hash-explorer.error.apply-filter': `Une erreur est survenue lors de l'application du filtre`,
  'cc-kv-hash-explorer.error.element-add': `Une erreur est survenue lors de l'ajout du champ`,
  'cc-kv-hash-explorer.error.element-delete': `Une erreur est survenue lors de la suppression du champ`,
  'cc-kv-hash-explorer.error.element-update': `Une erreur est survenue lors de modification de la valeur`,
  'cc-kv-hash-explorer.error.fetch-elements': `Une erreur est survenue lors de la récupération des champs`,
  'cc-kv-hash-explorer.filter': `Filtrer par champ`,
  'cc-kv-hash-explorer.filter.apply': `Appliquer le filtre`,
  'cc-kv-hash-explorer.header.field': `Champ`,
  'cc-kv-hash-explorer.header.value': `Valeur`,
  'cc-kv-hash-explorer.no-results': `Aucun résultat ne correspond au filtre`,
  'cc-kv-hash-explorer.success.element-add': `Le champ a été ajouté`,
  'cc-kv-hash-explorer.success.element-delete': `Le champ a été supprimé`,
  'cc-kv-hash-explorer.success.element-update': `La valeur a été modifiée`,
  //#endregion
  //#region cc-kv-hash-input
  'cc-kv-hash-input.element.add': `Ajouter un nouveau champ`,
  'cc-kv-hash-input.element.delete': /** @param {{index: number}} _ */ ({ index }) =>
    `Enlever le champ à l'index ${index}`,
  'cc-kv-hash-input.element.field-input': `Champ`,
  'cc-kv-hash-input.element.value-input': `Valeur`,
  'cc-kv-hash-input.header.field': `Champ`,
  'cc-kv-hash-input.header.value': `Valeur`,
  //#endregion
  //#region cc-kv-list-explorer
  'cc-kv-list-explorer.add-form.element-position': `Ajouter`,
  'cc-kv-list-explorer.add-form.element-position.head': `Au début`,
  'cc-kv-list-explorer.add-form.element-position.tail': `À la fin`,
  'cc-kv-list-explorer.add-form.element-value': `Élément`,
  'cc-kv-list-explorer.add-form.submit': `Ajouter`,
  'cc-kv-list-explorer.add-form.submit.a11y': `Ajouter l'élément`,
  'cc-kv-list-explorer.element.copy': /** @param {{index: number}} _ */ ({ index }) =>
    `Copier la valeur à l'index ${index} dans le presse-papier`,
  'cc-kv-list-explorer.element.edit.cancel': `Annuler l'édition de l'élément`,
  'cc-kv-list-explorer.element.edit.save': `Modifier l'élément`,
  'cc-kv-list-explorer.element.edit.start': /** @param {{index: number}} _ */ ({ index }) =>
    `Éditer l'élément à l'index ${index}`,
  'cc-kv-list-explorer.element.edit.value-input': `Valeur de l'élément`,
  'cc-kv-list-explorer.error.apply-filter': `Une erreur est survenue lors de l'application du filtre`,
  'cc-kv-list-explorer.error.element-add': `Une erreur est survenue lors de l'ajout de l'élément`,
  'cc-kv-list-explorer.error.element-update': `Une erreur est survenue lors de la modification de l'élément`,
  'cc-kv-list-explorer.error.fetch-elements': `Une erreur est survenue lors de la récupération des éléments`,
  'cc-kv-list-explorer.filter': `Filtrer par index`,
  'cc-kv-list-explorer.filter.apply': `Appliquer le filtre`,
  'cc-kv-list-explorer.header.index': `Index`,
  'cc-kv-list-explorer.header.value': `Élément`,
  'cc-kv-list-explorer.no-results': `Aucun résultat ne correspond au filtre`,
  'cc-kv-list-explorer.success.element-add': /** @param {{index: number}} _ */ ({ index }) =>
    `L'élément à été ajouté à l'index ${index}`,
  'cc-kv-list-explorer.success.element-update': `L'élément à été modifié`,
  //#endregion
  //#region cc-kv-list-input
  'cc-kv-list-input.element.add': `Ajouter un nouvel élément`,
  'cc-kv-list-input.element.delete': /** @param {{index: number}} _ */ ({ index }) =>
    `Enlever l'élément à l'index ${index}`,
  'cc-kv-list-input.element.value-input': `Élément`,
  'cc-kv-list-input.header.elements': `Éléments`,
  //#endregion
  //#region cc-kv-set-explorer
  'cc-kv-set-explorer.add-form.element-value': `Membre`,
  'cc-kv-set-explorer.add-form.submit': `Ajouter`,
  'cc-kv-set-explorer.add-form.submit.a11y': `Ajouter le membre`,
  'cc-kv-set-explorer.element.copy': /** @param {{index: number}} _ */ ({ index }) =>
    `Copier la valeur à l'index ${index} dans le presse-papier`,
  'cc-kv-set-explorer.element.delete': /** @param {{index: number}} _ */ ({ index }) =>
    `Supprimer le membre à l'index ${index}`,
  'cc-kv-set-explorer.error.apply-filter': `Une erreur est survenue lors de l'application du filtre`,
  'cc-kv-set-explorer.error.element-add': `Une erreur est survenue lors de l'ajout du membre`,
  'cc-kv-set-explorer.error.element-delete': `Une erreur est survenue lors de la suppression du membre`,
  'cc-kv-set-explorer.error.fetch-elements': `Une erreur est survenue lors de la récupération des membres`,
  'cc-kv-set-explorer.filter': `Filtre`,
  'cc-kv-set-explorer.filter.apply': `Appliquer le filtre`,
  'cc-kv-set-explorer.no-results': `Aucun résultat ne correspond au filtre`,
  'cc-kv-set-explorer.success.element-add': `Le membre a été ajouté`,
  'cc-kv-set-explorer.success.element-already-exist': `Le membre existe déjà`,
  'cc-kv-set-explorer.success.element-delete': `Le membre a été supprimé`,
  //#endregion
  //#region cc-kv-string-editor
  'cc-kv-string-editor.error.update-value': `Une erreur est survenue lors de la modification de la valeur`,
  'cc-kv-string-editor.form.reset': `Annuler`,
  'cc-kv-string-editor.form.save': `Sauvegarder`,
  'cc-kv-string-editor.form.value': `Valeur`,
  'cc-kv-string-editor.success.update-value': `La valeur a été modifiée`,
  //#endregion
  //#region cc-kv-terminal
  'cc-kv-terminal.header': `KV Explorer Terminal`,
  'cc-kv-terminal.shell.prompt': `Ligne de commande`,
  'cc-kv-terminal.warning': `Les commandes exécutées dans ce terminal sont directement envoyées à la base de données`,
  //#endregion
  //#region cc-link
  'cc-link.download.icon-a11y-name': `Télécharger`,
  'cc-link.new-window.name': `nouvelle fenêtre`,
  'cc-link.new-window.title': /** @param {{linkText: string}} _ */ ({ linkText }) => `${linkText} - nouvelle fenêtre`,
  //#endregion
  //#region cc-loader
  'cc-loader.a11y-name': `Chargement en cours`,
  //#endregion
  //#region cc-logs
  'cc-logs.copied': /** @param {{count: number}} _ */ ({ count }) =>
    `${plural(count, 'Copiée')} (${count} ${plural(count, 'ligne')})`,
  'cc-logs.copy': `Copier`,
  'cc-logs.inspect': `Inspecter`,
  'cc-logs.select-button.label': /** @param {{index: number}} _ */ ({ index }) => `Sélectionner la ligne ${index}`,
  'cc-logs.unselect-button.label': /** @param {{index: number}} _ */ ({ index }) => `Désélectionner la ligne ${index}`,
  //#endregion
  //#region cc-logs-addon-runtime
  'cc-logs-addon-runtime.fullscreen': `Mode plein écran`,
  'cc-logs-addon-runtime.fullscreen.exit': `Sortir du mode plein écran`,
  'cc-logs-addon-runtime.logs.error': `Une erreur est survenue pendant le chargement des logs`,
  'cc-logs-addon-runtime.logs.loading': `Recherche de logs…`,
  'cc-logs-addon-runtime.logs.warning.no-logs.message': `Il n'y a aucun log qui correspond aux critères sélectionnés`,
  'cc-logs-addon-runtime.logs.warning.no-logs.title': `Aucun log`,
  'cc-logs-addon-runtime.logs.warning.waiting.message': `Les logs émis par l'add-on apparaîtront ici`,
  'cc-logs-addon-runtime.logs.warning.waiting.title': `Aucun log pour le moment`,
  //#endregion
  //#region cc-logs-app-access
  'cc-logs-app-access.error': `Une erreur est survenue pendant le chargement des logs`,
  'cc-logs-app-access.fullscreen': `Mode plein écran`,
  'cc-logs-app-access.fullscreen.exit': `Sortir du mode plein écran`,
  'cc-logs-app-access.loading': `Recherche de logs…`,
  'cc-logs-app-access.no-logs.message': `Aucun log ne correspond aux critères sélectionnés`,
  'cc-logs-app-access.no-logs.title': `Aucun log`,
  'cc-logs-app-access.options.city': `Afficher la ville`,
  'cc-logs-app-access.options.country': `Afficher le pays`,
  'cc-logs-app-access.options.ip': `Afficher l'adresse IP`,
  'cc-logs-app-access.waiting.message': `Les logs émis par l'application apparaîtront ici`,
  'cc-logs-app-access.waiting.title': `Aucun log pour le moment`,
  //#endregion
  //#region cc-logs-app-runtime
  'cc-logs-app-runtime.fullscreen': `Mode plein écran`,
  'cc-logs-app-runtime.fullscreen.exit': `Sortir du mode plein écran`,
  'cc-logs-app-runtime.logs.error': `Une erreur est survenue pendant le chargement des logs`,
  'cc-logs-app-runtime.logs.loading': `Recherche de logs…`,
  'cc-logs-app-runtime.logs.warning.no-logs.message': `Il n'y a aucun log qui correspond aux critères sélectionnés`,
  'cc-logs-app-runtime.logs.warning.no-logs.title': `Aucun log`,
  'cc-logs-app-runtime.logs.warning.waiting.message': `Les logs émis par l'application apparaîtront ici`,
  'cc-logs-app-runtime.logs.warning.waiting.title': `Aucun log pour le moment`,
  'cc-logs-app-runtime.options.display-instance': `Afficher le nom de l'instance`,
  //#endregion
  //#region cc-logs-control
  'cc-logs-control.date-display': `Format de date`,
  'cc-logs-control.date-display.datetime-iso': `Date et heure ISO`,
  'cc-logs-control.date-display.datetime-short': `Date et heure`,
  'cc-logs-control.date-display.none': `Ne pas afficher`,
  'cc-logs-control.date-display.time-iso': `Heure ISO`,
  'cc-logs-control.date-display.time-short': `Heure`,
  'cc-logs-control.option-header.date': `Date`,
  'cc-logs-control.option-header.display': `Affichage`,
  'cc-logs-control.option-header.metadata': `Métadonnées`,
  'cc-logs-control.palette': `Thème`,
  'cc-logs-control.palette.default': `Thème par défaut`,
  'cc-logs-control.scroll-to-bottom': `Défiler vers le bas`,
  'cc-logs-control.show-logs-options': `Options`,
  'cc-logs-control.strip-ansi': `Désactiver les séquences ANSI`,
  'cc-logs-control.timezone': `Zone`,
  'cc-logs-control.timezone.local': `Heure locale`,
  'cc-logs-control.timezone.utc': `UTC`,
  'cc-logs-control.wrap-lines': `Forcer le retour à la ligne`,
  //#endregion
  //#region cc-logs-date-range-selector
  'cc-logs-date-range-selector.custom-date-range.apply': `Appliquer`,
  'cc-logs-date-range-selector.custom-date-range.next': `Décaler à l'intervalle suivant`,
  'cc-logs-date-range-selector.custom-date-range.previous': `Décaler à l'intervalle précédent`,
  'cc-logs-date-range-selector.custom-date-range.since.local': `Début (heure locale)`,
  'cc-logs-date-range-selector.custom-date-range.since.utc': `Début (UTC)`,
  'cc-logs-date-range-selector.custom-date-range.until.local': `Fin (heure locale)`,
  'cc-logs-date-range-selector.custom-date-range.until.utc': `Fin (UTC)`,
  'cc-logs-date-range-selector.option.custom': `Personnalisé`,
  'cc-logs-date-range-selector.option.last-4-hours': `4 dernières heures`,
  'cc-logs-date-range-selector.option.last-7-days': `7 derniers jours`,
  'cc-logs-date-range-selector.option.last-hour': `Dernière heure`,
  'cc-logs-date-range-selector.option.live': `Vue en temps réel`,
  'cc-logs-date-range-selector.option.today': `Aujourd'hui`,
  'cc-logs-date-range-selector.option.yesterday': `Hier`,
  //#endregion
  //#region cc-logs-instances
  'cc-logs-instances.cold.empty': `Aucune instance`,
  'cc-logs-instances.cold.header': `Instances`,
  'cc-logs-instances.commit.title': /** @param {{commit: string}} _ */ ({ commit }) => `Commit déployé: ${commit}`,
  'cc-logs-instances.deleted.header': `Instances supprimées`,
  'cc-logs-instances.deploying.header': `Déploiement en cours`,
  'cc-logs-instances.deployment.deployed': `Déployée`,
  'cc-logs-instances.deployment.state.cancelled': `Déploiement annulé`,
  'cc-logs-instances.deployment.state.failed': `Déploiement en échec`,
  'cc-logs-instances.deployment.state.succeeded': `Déploiement réussi`,
  'cc-logs-instances.deployment.state.wip': `Déploiement en cours`,
  'cc-logs-instances.ghost.header': `Instances fantômes`,
  'cc-logs-instances.ghost.notice': `Des instances indésirables sont toujours en cours d'exécution, mais seront bientôt détruites par notre orchestrateur. Pour en savoir plus, vous pouvez contacter le support.`,
  'cc-logs-instances.instance.build': `Instance de build`,
  'cc-logs-instances.instance.index': /** @param {{index: number}} _ */ ({ index }) => `Instance #${index}`,
  'cc-logs-instances.instance.state.deleted': `Instance supprimée`,
  'cc-logs-instances.instance.state.deploying': `Instance en cours de déploiement`,
  'cc-logs-instances.instance.state.running': `Instance démarrée`,
  'cc-logs-instances.instance.state.stopping': `Instance en cours d'arrêt`,
  'cc-logs-instances.loading.error': `Une erreur est survenue pendant le chargement des instances.`,
  'cc-logs-instances.loading.loader': `Instances en cours de chargement`,
  'cc-logs-instances.running.empty': `Aucune instance démarrée`,
  'cc-logs-instances.running.header': `Instances démarrées`,
  'cc-logs-instances.stopping.header': `Instances arrêtées`,
  //#endregion
  //#region cc-logs-loading-progress
  'cc-logs-loading-progress.control.pause': `Mettre en pause`,
  'cc-logs-loading-progress.control.resume': `Reprendre`,
  'cc-logs-loading-progress.overflow.accept': `Continuer`,
  'cc-logs-loading-progress.overflow.discard': `Arrêter`,
  'cc-logs-loading-progress.overflow.info': /** @param {{limit: number}} _ */ ({ limit }) =>
    `Seuls les ${formatNumber(lang, limit)} derniers logs sont affichés.`,
  'cc-logs-loading-progress.overflow.warning': /** @param {{limit: number}} _ */ ({ limit }) =>
    `Vous allez atteindre ${formatNumber(lang, limit)} logs chargés. Que voulez-vous faire\u202f?`,
  'cc-logs-loading-progress.progress.indeterminate': /** @param {{count: number}} _ */ ({ count }) =>
    `${formatNumber(lang, count)} logs chargés`,
  'cc-logs-loading-progress.progress.none': `Aucun log chargé`,
  'cc-logs-loading-progress.progress.percentage': /** @param {{count: number, percent: number}} _ */ ({
    count,
    percent,
  }) => `${formatNumber(lang, count)} logs chargés (${formatPercent(lang, percent)})`,
  //#endregion
  //#region cc-logs-message-filter
  'cc-logs-message-filter.bad-format': `Regex invalide`,
  'cc-logs-message-filter.label': `Filtrer`,
  'cc-logs-message-filter.mode.regex': `Filtrer avec une expression régulière`,
  'cc-logs-message-filter.mode.strict': `Filtrer avec une chaîne exacte`,
  //#endregion
  //#region cc-logsmap
  'cc-logsmap.legend.heatmap': /** @param {{orgaName: string}} _ */ ({ orgaName }) =>
    sanitize`Carte de chaleur des requêtes HTTP reçues par les applications de <strong>${orgaName}</strong> durant les dernières 24 heures.`,
  'cc-logsmap.legend.heatmap.app': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Carte de chaleur des requêtes HTTP reçues par l'application <strong>${appName}</strong> durant les dernières 24 heures.`,
  'cc-logsmap.legend.points': /** @param {{orgaName: string}} _ */ ({ orgaName }) =>
    sanitize`Carte temps réel des requêtes HTTP reçues par toutes les applications de <strong>${orgaName}</strong>.`,
  'cc-logsmap.legend.points.app': /** @param {{appName: string}} _ */ ({ appName }) =>
    sanitize`Carte temps réel des requêtes HTTP reçues par l'application <strong>${appName}</strong>.`,
  'cc-logsmap.mode.heatmap': `Dernières 24h`,
  'cc-logsmap.mode.points': `En direct`,
  //#endregion
  //#region cc-map
  'cc-map.error': `Une erreur est survenue pendant le chargement des données de la carte.`,
  'cc-map.error.icon-a11y-name': `Avertissement`,
  'cc-map.no-points': `Pas de données à afficher sur la carte en ce moment.`,
  //#endregion
  //#region cc-matomo-info
  'cc-matomo-info.about.text': () => sanitize`
    <p>L'add-on Matomo inclut des dépendances indispensables à son bon fonctionnement. Il est accompagné d'une application <strong>PHP</strong>, d'un add-on <strong>MySQL</strong> et d'un add-on <strong>Redis</strong>.</p>
    <p>Ces dépendances sont affichées dans votre organisation comme n'importe quelle autre application ou add-on. Vous pouvez les configurer comme bon vous semble. Vous pouvez modifier le domaine de l'application PHP ou encore migrer le MySQL vers un plus gros plan.</p>
    <p>Cet add-on est gratuit, mais ses dépendances sont facturées en fonction de leur consommation.</p>
  `,
  'cc-matomo-info.about.title': `À propos`,
  'cc-matomo-info.documentation.text': `Matomo - Documentation`,
  'cc-matomo-info.error': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  'cc-matomo-info.heading': `Cet add-on Matomo inclut toutes les dépendances nécessaires à son bon fonctionnement.`,
  'cc-matomo-info.info': `Info`,
  'cc-matomo-info.link.mysql': `Accéder à l'add-on MySQL`,
  'cc-matomo-info.link.php': `Accéder à l'application PHP`,
  'cc-matomo-info.link.redis': `Accéder à l'add-on Redis`,
  'cc-matomo-info.open-matomo.link': `Accéder à Matomo`,
  'cc-matomo-info.open-matomo.text': `Vous pouvez accéder à votre Matomo en utilisant votre compte Clever Cloud. Tous les membres de l'organisation peuvent également accéder au service grâce à leur propre compte.`,
  'cc-matomo-info.open-matomo.title': `Accéder à Matomo`,
  //#endregion
  //#region cc-network-group-dashboard
  'cc-network-group-dashboard.danger-zone.btn': `Supprimer le Network Group`,
  'cc-network-group-dashboard.danger-zone.desc': `La suppression de ce Network Group est une action permanente. Tous les membres seront dissociés.`,
  'cc-network-group-dashboard.danger-zone.dialog.confirm-input-label': `Saissez le nom du Network Group`,
  'cc-network-group-dashboard.danger-zone.dialog.desc': `La suppression de ce Network group est une action permanente. Tous les membres et pairs associés seront dissociés. Cette action ne peut pas être annulée. Assurez-vous d'avoir migré ou reconfiguré toutes les dépendances avant de continuer.`,
  'cc-network-group-dashboard.danger-zone.dialog.heading': `Confirmer la suppression`,
  'cc-network-group-dashboard.danger-zone.error': `Une erreur est survenue pendant le chargement des informations du Network Group`,
  'cc-network-group-dashboard.danger-zone.heading': `Zone de danger`,
  'cc-network-group-dashboard.delete.error': `Une erreur est survenue lors de la suppression du Network Group`,
  'cc-network-group-dashboard.delete.success': `Le Network Group a été supprimé avec succès`,
  'cc-network-group-dashboard.doc-link.text': `Network Groups - Documentation`,
  //#endregion
  //#region cc-notice
  'cc-notice.close': `Fermer cette notice`,
  'cc-notice.icon-alt.danger': `Erreur`,
  'cc-notice.icon-alt.info': `Information`,
  'cc-notice.icon-alt.success': `Succès`,
  'cc-notice.icon-alt.warning': `Avertissement`,
  //#endregion
  //#region cc-oauth-consumer-form
  'cc-oauth-consumer-form.auth.title': `Droits`,
  'cc-oauth-consumer-form.create-button': `Créer`,
  'cc-oauth-consumer-form.create-title': `Nouveau consumer OAuth`,
  'cc-oauth-consumer-form.create.error': `Une erreur est survenue pendant la création du consumer OAuth`,
  'cc-oauth-consumer-form.create.success': /** @param {{oauthConsumerName: string}} _ */ ({ oauthConsumerName }) =>
    sanitize`Le consumer OAuth <strong>${oauthConsumerName}</strong> a été créé avec succès`,
  'cc-oauth-consumer-form.danger-zone.description': `Cette action est définitive et ne peut pas être annulée. Une fois le consumer OAuth supprimé, les utilisateurs ne pourront plus se connecter à l'application via OAuth, et tous les droits accordés seront révoqués.`,
  'cc-oauth-consumer-form.danger-zone.title': `Supprimer le consumer OAuth`,
  'cc-oauth-consumer-form.delete-button': `Supprimer`,
  'cc-oauth-consumer-form.delete.error': `Une erreur est survenue pendant la suppression du consumer OAuth`,
  'cc-oauth-consumer-form.delete.success': `Le consumer OAuth a été supprimé avec succès`,
  'cc-oauth-consumer-form.documentation.text': `Consumer OAuth - Documentation`,
  'cc-oauth-consumer-form.info.base-url': `URL de base`,
  'cc-oauth-consumer-form.info.base-url.help': `L'URL  qui sera utilisée pour les redirections OAuth. Par exemple\u00A0: "https://example.com"`,
  'cc-oauth-consumer-form.info.description-input': `Description`,
  'cc-oauth-consumer-form.info.description.help': `Elle sera affichée à tous les utilisateurs de votre application`,
  'cc-oauth-consumer-form.info.homepage-url': `Page d'accueil`,
  'cc-oauth-consumer-form.info.homepage-url.help': `L'URL complète de la page d'accueil de votre application. Par exemple\u00A0: "https://www.example.com/home"`,
  'cc-oauth-consumer-form.info.image': `URL du logo`,
  'cc-oauth-consumer-form.info.image.help': `Cette image sera affichée aux utilisateurs lors des demandes d'autorisation, facilitant la reconnaissance de votre service. Par exemple\u00A0: "https://example.com"`,
  'cc-oauth-consumer-form.info.name': `Nom`,
  'cc-oauth-consumer-form.info.name.help': `Un nom que les utilisateurs reconnaîtront et auquel ils feront confiance`,
  'cc-oauth-consumer-form.info.placeholder': `Aucune valeur pour l'instant…`,
  'cc-oauth-consumer-form.info.title': `Détails de l'application`,
  'cc-oauth-consumer-form.info.url.error': `Saisissez une URL valide. Exemple: "https://example.com"`,
  'cc-oauth-consumer-form.load.error': `Une erreur est survenue pendant le chargement des informations du consumer OAuth`,
  'cc-oauth-consumer-form.reset-button': `Réinitialiser`,
  'cc-oauth-consumer-form.rights.access-all': `Accéder à tout`,
  'cc-oauth-consumer-form.rights.access-organisations': `Organisations`,
  'cc-oauth-consumer-form.rights.access-organisations-bills': `Factures des organisations`,
  'cc-oauth-consumer-form.rights.access-organisations-consumption-statistics': `Statistiques de consommation des organisations`,
  'cc-oauth-consumer-form.rights.access-organisations-credit-count': `Nombre de crédits des organisations`,
  'cc-oauth-consumer-form.rights.access-personal-information': `Informations personnelles`,
  'cc-oauth-consumer-form.rights.description': `Le consumer OAuth demandera les droits suivants\u00A0:`,
  'cc-oauth-consumer-form.rights.error': `Veuillez sélectionner au moins une option`,
  'cc-oauth-consumer-form.rights.legend-access': `Accès`,
  'cc-oauth-consumer-form.rights.legend-manage': `Gérer`,
  'cc-oauth-consumer-form.rights.manage-all': `Tout gérer`,
  'cc-oauth-consumer-form.rights.manage-organisations': `Organisations`,
  'cc-oauth-consumer-form.rights.manage-organisations-applications': `Applications des organisations`,
  'cc-oauth-consumer-form.rights.manage-organisations-members': `Membres des organisations`,
  'cc-oauth-consumer-form.rights.manage-organisations-services': `Add-ons des organisations`,
  'cc-oauth-consumer-form.rights.manage-personal-information': `Informations personnelles`,
  'cc-oauth-consumer-form.rights.manage-ssh-keys': `Clés SSH`,
  'cc-oauth-consumer-form.update-button': `Sauvegarder`,
  'cc-oauth-consumer-form.update-title': `Mettre à jour votre consumer OAuth`,
  'cc-oauth-consumer-form.update.error': /** @param {{oauthConsumerName: string}} _ */ ({ oauthConsumerName }) =>
    sanitize`Une erreur est survenue pendant la mise à jour du consumer OAuth <strong>(${oauthConsumerName})</strong>`,
  'cc-oauth-consumer-form.update.success': /** @param {{oauthConsumerName: string}} _ */ ({ oauthConsumerName }) =>
    sanitize`Le consumer OAuth <strong>(${oauthConsumerName})</strong> a été mis à jour avec succès`,
  //#endregion
  //#region cc-oauth-consumer-info
  'cc-oauth-consumer-info.access.title': `Détails de configuration`,
  'cc-oauth-consumer-info.error': `Une erreur est survenue pendant le chargement des informations du consumer OAuth`,
  'cc-oauth-consumer-info.info.base-url': `URL de base de l'application`,
  'cc-oauth-consumer-info.info.description': `Votre application est configurée pour ces URLs et a besoin des informations d'identification suivantes pour utiliser le consumer\u00A0:`,
  'cc-oauth-consumer-info.info.homepage-url': `Page d'accueil de l'application`,
  'cc-oauth-consumer-info.info.key': `Clé`,
  'cc-oauth-consumer-info.info.secret': `Secret`,
  'cc-oauth-consumer-info.rights-title.access': `Droits d'accès\u00A0:`,
  'cc-oauth-consumer-info.rights-title.manage': `Droits de gestion\u00A0:`,
  'cc-oauth-consumer-info.rights.access-organisations': `Organisations`,
  'cc-oauth-consumer-info.rights.access-organisations-bills': `Factures des organisations`,
  'cc-oauth-consumer-info.rights.access-organisations-consumption-statistics': `Statistiques de consommation des organisations`,
  'cc-oauth-consumer-info.rights.access-organisations-credit-count': `Nombre de crédits des organisations`,
  'cc-oauth-consumer-info.rights.access-personal-information': `Informations personnelles`,
  'cc-oauth-consumer-info.rights.almighty': `Almighty`,
  'cc-oauth-consumer-info.rights.description': `Le consumer OAuth demandera aux utilisateurs de l'application les droits suivants\u00A0:`,
  'cc-oauth-consumer-info.rights.edit': `Éditer les informations`,
  'cc-oauth-consumer-info.rights.manage-organisations': `Organisations`,
  'cc-oauth-consumer-info.rights.manage-organisations-applications': `Applications des organisations`,
  'cc-oauth-consumer-info.rights.manage-organisations-members': `Membres des organisations`,
  'cc-oauth-consumer-info.rights.manage-organisations-services': `Add-ons des organisations`,
  'cc-oauth-consumer-info.rights.manage-personal-information': `Informations personnelles`,
  'cc-oauth-consumer-info.rights.manage-ssh-keys': `Clés SSH`,
  'cc-oauth-consumer-info.rights.title': `Droits`,
  //#endregion
  //#region cc-order-summary
  'cc-order-summary.create': `Créer`,
  'cc-order-summary.title': `Récapitulatif de commande`,
  //#endregion
  //#region cc-orga-member-card
  'cc-orga-member-card.btn.cancel.accessible-name': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    `Annuler la modification du membre - ${memberIdentity}`,
  'cc-orga-member-card.btn.cancel.visible-text': `Annuler`,
  'cc-orga-member-card.btn.delete.accessible-name': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    `Supprimer le membre - ${memberIdentity}`,
  'cc-orga-member-card.btn.delete.visible-text': `Supprimer`,
  'cc-orga-member-card.btn.edit.accessible-name': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    `Modifier le membre - ${memberIdentity}`,
  'cc-orga-member-card.btn.edit.visible-text': `Modifier`,
  'cc-orga-member-card.btn.leave.accessible-name': `Quitter l'organisation`,
  'cc-orga-member-card.btn.leave.visible-text': `Quitter`,
  'cc-orga-member-card.btn.validate.accessible-name': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    `Valider la modification du membre - ${memberIdentity}`,
  'cc-orga-member-card.btn.validate.visible-text': `Valider`,
  'cc-orga-member-card.current-user': `Votre compte`,
  'cc-orga-member-card.error.last-admin.heading': `Vous êtes le dernier admin de l'organisation`,
  'cc-orga-member-card.error.last-admin.text': `Désignez un nouvel admin avant de pouvoir modifier votre rôle ou quitter l'organisation`,
  'cc-orga-member-card.mfa-disabled': `2FA désactivée`,
  'cc-orga-member-card.mfa-enabled': `2FA activée`,
  'cc-orga-member-card.role.accounting': `Comptable`,
  'cc-orga-member-card.role.admin': `Admin`,
  'cc-orga-member-card.role.developer': `Développeur`,
  'cc-orga-member-card.role.label': `Rôle`,
  'cc-orga-member-card.role.manager': `Manager`,
  //#endregion
  //#region cc-orga-member-list
  'cc-orga-member-list.delete.error': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    sanitize`Une erreur est survenue lors la suppression de <strong>${memberIdentity}</strong>.`,
  'cc-orga-member-list.delete.success': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    sanitize`<strong>${memberIdentity}</strong> a été supprimé de l'organisation.`,
  'cc-orga-member-list.documentation.text': `Membres d'organisation - Documentation`,
  'cc-orga-member-list.edit.error': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    sanitize`Une erreur est survenue lors de la modification de <strong>${memberIdentity}</strong>.`,
  'cc-orga-member-list.edit.success': /** @param {{memberIdentity: string}} _ */ ({ memberIdentity }) =>
    sanitize`Le rôle de <strong>${memberIdentity}</strong> a bien été modifié.`,
  'cc-orga-member-list.error': `Une erreur est survenue pendant le chargement de la liste des membres.`,
  'cc-orga-member-list.error-member-not-found.heading': `Membre introuvable`,
  'cc-orga-member-list.error-member-not-found.text': () =>
    sanitize`<p>Le membre a probablement quitté l'organisation ou a été supprimé par quelqu'un d'autre pendant que vous consultiez la liste.<p><p><strong>Rafraîchissez votre page</strong> pour récupérer la liste des membres à jour.</p>`,
  'cc-orga-member-list.error.unauthorised.heading': `Vous n'avez pas les droits nécessaires`,
  'cc-orga-member-list.error.unauthorised.text': `Seul un admin peut inviter, éditer ou supprimer un autre admin.`,
  'cc-orga-member-list.filter.mfa': `Comptes non sécurisés par 2FA`,
  'cc-orga-member-list.filter.name': `Filtrer par nom ou adresse e-mail`,
  'cc-orga-member-list.invite.email.error-duplicate': `Cet utilisateur fait déjà partie des membres de votre organisation.`,
  'cc-orga-member-list.invite.email.format': `nom@example.com`,
  'cc-orga-member-list.invite.email.label': `Adresse e-mail`,
  'cc-orga-member-list.invite.heading': `Inviter un membre`,
  'cc-orga-member-list.invite.info': () =>
    sanitize`Plus d'informations à propos des rôles sur la page <cc-link href="${getDocUrl('/account/organizations/#roles-and-privileges')}">Rôles et organisations (en anglais)</cc-link>`,
  'cc-orga-member-list.invite.role.accounting': `Comptable`,
  'cc-orga-member-list.invite.role.admin': `Admin`,
  'cc-orga-member-list.invite.role.developer': `Développeur`,
  'cc-orga-member-list.invite.role.label': `Rôle`,
  'cc-orga-member-list.invite.role.manager': `Manager`,
  'cc-orga-member-list.invite.submit': `Inviter`,
  'cc-orga-member-list.invite.submit.error': /** @param {{userEmail: string}} _ */ ({ userEmail }) =>
    sanitize`Une erreur est survenue lors de l'invitation de <strong>${userEmail}</strong> dans l'organisation.`,
  'cc-orga-member-list.invite.submit.error-rate-limit.message': `Attendez quelques minutes avant d'essayer à nouveau.`,
  'cc-orga-member-list.invite.submit.error-rate-limit.title': `Vous avez tenté d'inviter des membres trop de fois`,
  'cc-orga-member-list.invite.submit.success': /** @param {{userEmail: string}} _ */ ({ userEmail }) =>
    sanitize`Un e-mail a été envoyé à <strong>${userEmail}</strong> pour l'inviter dans l'organisation.`,
  'cc-orga-member-list.leave.btn': `Quitter l'organisation`,
  'cc-orga-member-list.leave.error': `Une erreur est survenue lorsque vous avez tenté de quitter l'organisation.`,
  'cc-orga-member-list.leave.error-last-admin.heading': `Vous êtes le dernier admin de l'organisation`,
  'cc-orga-member-list.leave.error-last-admin.text': `Désignez un nouvel admin avant de pouvoir quitter l'organisation`,
  'cc-orga-member-list.leave.heading': `Zone de danger`,
  'cc-orga-member-list.leave.success': `Vous avez quitté l'organisation.`,
  'cc-orga-member-list.leave.text': () => sanitize`
    <p>Le départ d'une organisation ne nécessite pas de confirmation.</p>
    <p>Si vous changez d'avis après avoir quitté l'organisation, vous devrez demander à quelqu'un de vous y inviter à nouveau.</p>
  `,
  'cc-orga-member-list.list.heading': `Membres`,
  'cc-orga-member-list.main-heading': `Gestion des membres de l'organisation`,
  'cc-orga-member-list.no-result': `Aucun résultat ne correspond à vos critères de recherche.`,
  //#endregion
  //#region cc-payment-warning
  'cc-payment-warning.billing-page-link': /** @param {{orgaName: string, orgaBillingLink: string}} _ */ ({
    orgaName,
    orgaBillingLink,
  }) =>
    sanitize`<cc-link href="${orgaBillingLink}" a11y-desc="Se rendre sur la page de facturation - ${orgaName}">Se rendre sur la page de facturation</cc-link>`,
  'cc-payment-warning.generic.default-payment-method-is-expired': /** @param {{orgaName: string}} _ */ ({ orgaName }) =>
    sanitize`<strong>${orgaName}</strong> a un moyen de paiement enregistré mais il est expiré.`,
  'cc-payment-warning.generic.no-default-payment-method': /** @param {{orgaName: string}} _ */ ({ orgaName }) =>
    sanitize`<strong>${orgaName}</strong> a des moyens de paiements enregistrés mais aucun d'entre eux n'est défini par défaut.`,
  'cc-payment-warning.generic.no-payment-method': /** @param {{orgaName: string}} _ */ ({ orgaName }) =>
    sanitize`<strong>${orgaName}</strong> n'a aucun moyen de paiement enregistré.`,
  'cc-payment-warning.home': /** @param {{orgaCount: number}} _ */ ({ orgaCount }) => {
    const organisation = plural(orgaCount, "à l'organisation suivante", 'aux organisations suivantes');
    return `Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci de vérifier les informations de facturation liées ${organisation}\u00A0:`;
  },
  'cc-payment-warning.home.title': `Attention\u202f! Quelque chose pose problème avec vos moyens de paiement.`,
  'cc-payment-warning.orga.default-payment-method-is-expired': `Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci d'ajouter un moyen de paiement valide et de le définir par défaut.`,
  'cc-payment-warning.orga.default-payment-method-is-expired.title': `Attention\u202f! Votre moyen de paiement est expiré`,
  'cc-payment-warning.orga.no-default-payment-method': `Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci de définir un de vos moyen de paiement par défaut.`,
  'cc-payment-warning.orga.no-default-payment-method.title': `Attention\u202f! Vous avez des moyens de paiements enregistrés, mais aucun d'entre eux n'est défini par défaut`,
  'cc-payment-warning.orga.no-payment-method': `Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci d'ajouter un moyen de paiement valide et de le définir par défaut.`,
  'cc-payment-warning.orga.no-payment-method.title': `Attention\u202f! Vous n'avez aucun moyen de paiement enregistré`,
  //#endregion
  //#region cc-picker
  'cc-picker.required': `obligatoire`,
  //#endregion
  //#region cc-plan-picker
  'cc-plan-picker.legend': `Sélectionnez votre plan`,
  'cc-plan-picker.legend.customize': `Personnalisez votre plan`,
  //#endregion
  //#region cc-pricing-estimation
  'cc-pricing-estimation.count.label': /** @param {{productCount: number}} _ */ ({ productCount }) =>
    plural(productCount, 'produit'),
  'cc-pricing-estimation.error': `Une erreur est survenue pendant le chargement des prix.`,
  'cc-pricing-estimation.estimated-price-name.1000-minutes': `estimé (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-estimation.estimated-price-name.30-days': `estimé/30\u00A0jours`,
  'cc-pricing-estimation.estimated-price-name.day': `estimé/jour`,
  'cc-pricing-estimation.estimated-price-name.hour': `estimé/heure`,
  'cc-pricing-estimation.estimated-price-name.minute': `estimé/minute`,
  'cc-pricing-estimation.estimated-price-name.second': `estimé/seconde`,
  'cc-pricing-estimation.feature.connection-limit': `Limite de connexions\u00A0: `,
  'cc-pricing-estimation.feature.cpu': `vCPUs\u00A0: `,
  'cc-pricing-estimation.feature.custom': /** @param {{featureName: string}} _ */ ({ featureName }) =>
    `${featureName}\u00A0: `,
  'cc-pricing-estimation.feature.databases': `Bases de données\u00A0: `,
  'cc-pricing-estimation.feature.dedicated': `Dédié`,
  'cc-pricing-estimation.feature.disk-size': `Taille du disque\u00A0: `,
  'cc-pricing-estimation.feature.gpu': `GPUs\u00A0: `,
  'cc-pricing-estimation.feature.has-logs': `Logs\u00A0: `,
  'cc-pricing-estimation.feature.has-metrics': `Métriques\u00A0: `,
  'cc-pricing-estimation.feature.is-migratable': `Outil de migration`,
  'cc-pricing-estimation.feature.max-db-size': `Taille BDD max\u00A0: `,
  'cc-pricing-estimation.feature.memory': `RAM\u00A0: `,
  'cc-pricing-estimation.feature.version': `Version\u00A0: `,
  'cc-pricing-estimation.heading': `Ma sélection`,
  'cc-pricing-estimation.hide': `Masquer`,
  'cc-pricing-estimation.label.currency': `Devise`,
  'cc-pricing-estimation.label.temporality': `Temporalité`,
  'cc-pricing-estimation.plan.delete': /** @param {{productName: string, planName: string}} _ */ ({
    productName,
    planName,
  }) => `Remove ${productName} - ${planName}`,
  'cc-pricing-estimation.plan.qty.btn.decrease': /** @param {{productName: string, planName: string}} _ */ ({
    productName,
    planName,
  }) => `Réduire la quantité - ${productName} (${planName})`,
  'cc-pricing-estimation.plan.qty.btn.increase': /** @param {{productName: string, planName: string}} _ */ ({
    productName,
    planName,
  }) => `Augmenter la quantité - ${productName} (${planName})`,
  'cc-pricing-estimation.plan.qty.label': `Quantité: `,
  'cc-pricing-estimation.plan.total.label': /** @param {{productName: string, planName: string}} _ */ ({
    productName,
    planName,
  }) => `Total pour ${productName} ${planName}`,
  'cc-pricing-estimation.price': /** @param {{price: number, currency: string, digits: number}} _ */ ({
    price,
    currency,
    digits,
  }) =>
    formatCurrency(lang, price, {
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }),
  'cc-pricing-estimation.price-name.1000-minutes': `Prix (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-estimation.price-name.30-days': `Prix/30\u00A0jours`,
  'cc-pricing-estimation.price-name.day': `Prix/jour`,
  'cc-pricing-estimation.price-name.hour': `Prix/heure`,
  'cc-pricing-estimation.price-name.minute': `Prix/minute`,
  'cc-pricing-estimation.price-name.second': `Prix/seconde`,
  'cc-pricing-estimation.price.unit.label': `Prix unitaire\u00A0: `,
  'cc-pricing-estimation.show': `Afficher`,
  'cc-pricing-estimation.tax-excluded': `HT`,
  'cc-pricing-estimation.total.label': `Total\u00A0: `,
  'cc-pricing-estimation.type.boolean': /** @param {{boolean: boolean}} _ */ ({ boolean }) =>
    `${boolean ? 'Oui' : 'Non'}`,
  'cc-pricing-estimation.type.boolean-shared': /** @param {{shared: boolean}} _ */ ({ shared }) =>
    `${shared ? 'Partagé' : 'Dédié'}`,
  'cc-pricing-estimation.type.bytes': /** @param {{bytes: number}} _ */ ({ bytes }) => formatBytes(bytes, 0, 3),
  'cc-pricing-estimation.type.number': /** @param {{number: number}} _ */ ({ number }) => formatNumber(lang, number),
  'cc-pricing-estimation.type.number-cpu-runtime': /** @param {{cpu: number, shared: boolean}} _ */ ({
    cpu,
    shared,
  }) => {
    return shared
      ? sanitize`<em title="Accès au vCPU moins prioritaire">${formatNumber(lang, cpu)}<code>*</code></em>`
      : formatNumber(lang, cpu);
  },
  //#endregion
  //#region cc-pricing-header
  'cc-pricing-header.error': `Une erreur est survenue pendant le chargement des filtres liés à la tarification.`,
  'cc-pricing-header.label.currency': `Devise`,
  'cc-pricing-header.label.temporality': `Temporalité`,
  'cc-pricing-header.label.zone': `Zone`,
  'cc-pricing-header.price-name.1000-minutes': `Prix (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-header.price-name.30-days': `Prix/30\u00A0jours`,
  'cc-pricing-header.price-name.day': `Prix/jour`,
  'cc-pricing-header.price-name.hour': `Prix/heure`,
  'cc-pricing-header.price-name.minute': `Prix/minute`,
  'cc-pricing-header.price-name.second': `Prix/seconde`,
  //#endregion
  //#region cc-pricing-product
  'cc-pricing-product.add-button': /** @param {{productName: string, size: string}} _ */ ({ productName, size }) =>
    `Ajouter ${productName} - ${size} à l'estimation`,
  'cc-pricing-product.error': `Une erreur est survenue pendant le chargement des prix.`,
  'cc-pricing-product.feature.connection-limit': `Limite de connexions`,
  'cc-pricing-product.feature.cpu': `vCPUs`,
  'cc-pricing-product.feature.databases': `Bases de données`,
  'cc-pricing-product.feature.dedicated': `Dédié`,
  'cc-pricing-product.feature.disk-size': `Taille du disque`,
  'cc-pricing-product.feature.gpu': `GPUs`,
  'cc-pricing-product.feature.has-logs': `Logs`,
  'cc-pricing-product.feature.has-metrics': `Métriques`,
  'cc-pricing-product.feature.is-migratable': `Outil de migration`,
  'cc-pricing-product.feature.max-db-size': `Taille BDD max`,
  'cc-pricing-product.feature.memory': `RAM`,
  'cc-pricing-product.feature.version': `Version`,
  'cc-pricing-product.plan': `Plan`,
  'cc-pricing-product.price': /** @param {{price: number, currency: string, digits: number}} _ */ ({
    price,
    currency,
    digits,
  }) =>
    formatCurrency(lang, price, {
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }),
  'cc-pricing-product.price-name.1000-minutes': `Prix (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-product.price-name.30-days': `Prix/30\u00A0jours`,
  'cc-pricing-product.price-name.day': `Prix/jour`,
  'cc-pricing-product.price-name.hour': `Prix/heure`,
  'cc-pricing-product.price-name.minute': `Prix/minute`,
  'cc-pricing-product.price-name.second': `Prix/seconde`,
  'cc-pricing-product.type.boolean': /** @param {{boolean: boolean}} _ */ ({ boolean }) => `${boolean ? 'Oui' : 'Non'}`,
  'cc-pricing-product.type.boolean-shared': /** @param {{shared: boolean}} _ */ ({ shared }) =>
    `${shared ? 'Partagé' : 'Dédié'}`,
  'cc-pricing-product.type.bytes': /** @param {{bytes: number}} _ */ ({ bytes }) => formatBytes(bytes, 0, 3),
  'cc-pricing-product.type.number': /** @param {{number: number}} _ */ ({ number }) => formatNumber(lang, number),
  'cc-pricing-product.type.number-cpu-runtime': /** @param {{cpu: number, shared: boolean}} _ */ ({ cpu, shared }) => {
    return shared
      ? sanitize`<em title="Accès au vCPU moins prioritaire">${formatNumber(lang, cpu)}<code>*</code></em>`
      : formatNumber(lang, cpu);
  },
  //#endregion
  //#region cc-pricing-product-consumption
  'cc-pricing-product-consumption.add': `Ajouter`,
  'cc-pricing-product-consumption.bytes': /** @param {{bytes: number}} _ */ ({ bytes }) => formatBytesSi(bytes),
  'cc-pricing-product-consumption.bytes-unit': /** @param {{bytes: number}} _ */ ({ bytes }) => getUnit(bytes),
  'cc-pricing-product-consumption.cold-storage.label': `stockage`,
  'cc-pricing-product-consumption.cold-storage.title': `Stockage à froid (HDD)\u00A0:`,
  'cc-pricing-product-consumption.error': `Une erreur est survenue pendant le chargement des prix.`,
  'cc-pricing-product-consumption.hot-storage.label': `stockage`,
  'cc-pricing-product-consumption.hot-storage.title': `Stockage à chaud (SSD)\u00A0:`,
  'cc-pricing-product-consumption.inbound-traffic.label': `trafic entrant`,
  'cc-pricing-product-consumption.inbound-traffic.title': `Trafic entrant\u00A0:`,
  'cc-pricing-product-consumption.number': /** @param {{number: number}} _ */ ({ number }) =>
    formatNumber(lang, number),
  'cc-pricing-product-consumption.outbound-traffic.label': `trafic sortant`,
  'cc-pricing-product-consumption.outbound-traffic.title': `Trafic sortant\u00A0:`,
  'cc-pricing-product-consumption.price': /** @param {{price: number, currency: string}} _ */ ({ price, currency }) =>
    `${formatCurrency(lang, price, { currency })}`,
  'cc-pricing-product-consumption.price-interval.bytes': /** @param {{price: number, currency: string}} _ */ ({
    price,
    currency,
  }) => {
    const priceInterval = formatCurrency(lang, price, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
      currency,
    });
    const priceOneGigabyte = getUnit(1e9);
    return `${priceInterval} / ${priceOneGigabyte} (30 jours)`;
  },
  'cc-pricing-product-consumption.price-interval.free': `GRATUIT`,
  'cc-pricing-product-consumption.price-interval.users':
    /** @param {{userCount: number, price: number, currency: string}} _ */ ({ userCount, price, currency }) => {
      const users = plural(userCount, 'utilisateur');
      const priceInterval = formatCurrency(lang, price * userCount, { currency });
      return `${priceInterval} / ${userCount} ${users} (30 jours)`;
    },
  'cc-pricing-product-consumption.private-users.label': `utilisateurs privés`,
  'cc-pricing-product-consumption.private-users.title': `Utilisateurs privés\u00A0:`,
  'cc-pricing-product-consumption.public-users.label': `utilisateurs publics`,
  'cc-pricing-product-consumption.public-users.title': `Utilisateurs publics\u00A0:`,
  'cc-pricing-product-consumption.quantity': `Quantité`,
  'cc-pricing-product-consumption.size': /** @param {{bytes: number}} _ */ ({ bytes }) =>
    `Taille (en ${getUnit(bytes)})`,
  'cc-pricing-product-consumption.storage.label': `stockage`,
  'cc-pricing-product-consumption.storage.title': `Stockage\u00A0:`,
  'cc-pricing-product-consumption.subtotal.title': `Sous-total (30 jours)\u00A0:`,
  'cc-pricing-product-consumption.toggle-btn.label': `Afficher plus de details`,
  'cc-pricing-product-consumption.total.title': `Total estimé (30 jours)\u00A0:`,
  'cc-pricing-product-consumption.unit': `Unité`,
  //#endregion
  //#region cc-product-card
  'cc-product-card.select': /** @param {{name: string}} _ */ ({ name }) => `${name} - sélectionner ce produit`,
  //#endregion
  //#region cc-product-list
  'cc-product-list.all-label': `Tout`,
  'cc-product-list.filter-category-legend': `Filtrer par catégorie`,
  'cc-product-list.search-empty': `Aucun produit ne correspond à vos critères de recherche.`,
  'cc-product-list.search-label': `Chercher un produit`,
  //#endregion
  //#region cc-range-selector
  'cc-range-selector.custom': `Personnaliser`,
  'cc-range-selector.error.empty': `Sélectionnez une valeur`,
  'cc-range-selector.label.end': `Sélectionnez une valeur de fin`,
  'cc-range-selector.label.single': `Sélectionnez une valeur`,
  'cc-range-selector.label.start': `Sélectionnez une valeur de début`,
  'cc-range-selector.required': `obligatoire`,
  'cc-range-selector.summary.disabled': `désactivé`,
  'cc-range-selector.summary.introduction': /** @param {string} legend */ (legend) =>
    `Récapitulatif pour "${legend}"\u00A0:`,
  'cc-range-selector.summary.selected': `sélectionné`,
  'cc-range-selector.summary.unselected': `non sélectionné`,
  //#endregion
  //#region cc-select
  'cc-select.error.empty': `Sélectionnez une valeur`,
  'cc-select.required': `obligatoire`,
  //#endregion
  //#region cc-ssh-key-list
  'cc-ssh-key-list.add.btn': `Ajouter la clé`,
  'cc-ssh-key-list.add.info': () =>
    sanitize`<p>Vous devez associer une clé SSH à votre compte si vous désirez déployer via Git. Utilisez ce formulaire à cet effet.</p><p>Vous pouvez créer une clé SSH avec la commande suivante\u00A0:</p><code>ssh-keygen -t ed25519 -C "my-email@example.com"</code><p>La clé publique générée est sauvegardée dans le fichier "*.pub".</p>`,
  'cc-ssh-key-list.add.name': `Nom`,
  'cc-ssh-key-list.add.public-key': `Clé publique`,
  'cc-ssh-key-list.add.title': `Ajouter une nouvelle clé`,
  'cc-ssh-key-list.documentation.text': `Clés SSH - Documentation`,
  'cc-ssh-key-list.error.add': /** @param {{name: string}} _ */ ({ name }) =>
    `Une erreur est survenue pendant l'ajout de votre nouvelle clé personnelle "${name}".`,
  'cc-ssh-key-list.error.delete': /** @param {{name: string}} _ */ ({ name }) =>
    `Une erreur est survenue pendant la suppression de votre clé personnelle "${name}".`,
  'cc-ssh-key-list.error.import': /** @param {{name: string}} _ */ ({ name }) =>
    `Une erreur est survenue pendant l'import de votre clé personnelle "${name}".`,
  'cc-ssh-key-list.error.loading': `Une erreur est survenue pendant le chargement de vos clés.`,
  'cc-ssh-key-list.error.private-key': `Format incorrect\u00A0: avez-vous saisi votre clé privée au lieu de votre clé publique\u202f?`,
  'cc-ssh-key-list.error.required.name': `Saisissez un nom pour votre clé SSH`,
  'cc-ssh-key-list.error.required.public-key': `Saisissez la valeur de votre clé publique`,
  'cc-ssh-key-list.github.empty': `Il n'y a aucune clé SSH disponible à l'import depuis votre compte GitHub.`,
  'cc-ssh-key-list.github.import': `Importer`,
  'cc-ssh-key-list.github.import.a11y': /** @param {{name: string}} _ */ ({ name }) =>
    `Importer la clé SSH GitHub - ${name}`,
  'cc-ssh-key-list.github.info': () =>
    sanitize`<p>Voici les clés provenant de votre compte GitHub. Vous pouvez les importer pour les associer à votre compte Clever Cloud.</p>`,
  'cc-ssh-key-list.github.title': `Clés GitHub`,
  'cc-ssh-key-list.github.unlinked': () =>
    sanitize`Il n'y a pas de compte GitHub lié à votre compte Clever Cloud. Vous pouvez lier vos comptes depuis votre <cc-link href="./information">profil</cc-link>`,
  'cc-ssh-key-list.personal.delete': `Supprimer`,
  'cc-ssh-key-list.personal.delete.a11y': /** @param {{name: string}} _ */ ({ name }) =>
    `Supprimer votre clé SSH personnelle - ${name}`,
  'cc-ssh-key-list.personal.empty': `Il n'y a aucune clé SSH associée à votre compte.`,
  'cc-ssh-key-list.personal.info': () =>
    sanitize`<p>Voici la liste des clés SSH associées à votre compte.</p><p>Si vous souhaitez vérifier qu'une clé est déjà associée, vous pouvez lister les empreintes de vos clés locales avec la commande suivante\u00A0:</p><code>ssh-add -l -E sha256</code>`,
  'cc-ssh-key-list.personal.title': `Vos clés`,
  'cc-ssh-key-list.success.add': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Votre clé <strong>${name}</strong> a été ajoutée avec succès.`,
  'cc-ssh-key-list.success.delete': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Votre clé <strong>${name}</strong> a été supprimée avec succès.`,
  'cc-ssh-key-list.success.import': /** @param {{name: string}} _ */ ({ name }) =>
    sanitize`Votre clé <strong>${name}</strong> a été importée avec succès.`,
  'cc-ssh-key-list.title': `Clés SSH`,
  //#endregion
  //#region cc-tcp-redirection
  'cc-tcp-redirection.create-button': `Créer`,
  'cc-tcp-redirection.delete-button': `Supprimer`,
  'cc-tcp-redirection.namespace-additionaldescription-cleverapps': () =>
    sanitize`Cet espace de nommage est utilisé par tous les noms de domaine <em>cleverapps.io</em> (p. ex. <em>mon-application.cleverapps.io</em>).`,
  'cc-tcp-redirection.namespace-additionaldescription-default': () =>
    sanitize`Cet espace de nommage est utilisé par tous les noms de domaine personnalisés (p. ex. <em>mon-application.fr</em>).`,
  'cc-tcp-redirection.namespace-private': `Cet espace de nommage vous est dédié.`,
  'cc-tcp-redirection.redirection-defined': /** @param {{namespace: string, sourcePort: number}} _ */ ({
    namespace,
    sourcePort,
  }) => {
    return sanitize`Cette application a une redirection du port <code>${sourcePort}</code> vers le port <code>4040</code> dans l'espace de nommage <strong>${namespace}</strong>.`;
  },
  'cc-tcp-redirection.redirection-not-defined': /** @param {{namespace: string}} _ */ ({ namespace }) =>
    sanitize`Vous pouvez créer une redirection dans l'espace de nommage <strong>${namespace}</strong>.`,
  //#endregion
  //#region cc-tcp-redirection-form
  'cc-tcp-redirection-form.cli.content.add-tcp-redirection-command': `Ajouter une redirection TCP\u00A0:`,
  'cc-tcp-redirection-form.cli.content.add-tcp-redirection-command-default': `Ajouter une redirection TCP\u00A0 (espace de nommage par défaut):`,
  'cc-tcp-redirection-form.cli.content.instruction': getCliInstructions,
  'cc-tcp-redirection-form.cli.content.intro': `
        Vous pouvez gérer les redirections TCP directement depuis votre terminal grâce aux commandes ci-dessous.
    `,
  'cc-tcp-redirection-form.cli.content.list-tcp-redirection-command': `Lister les redirections TCP\u00A0:`,
  'cc-tcp-redirection-form.cli.content.remove-tcp-redirection-command': `Supprimer une redirection TCP\u00A0:`,
  'cc-tcp-redirection-form.create.error': /** @param {{namespace: string}} _ */ ({ namespace }) => {
    return sanitize`Une erreur est survenue pendant la création d'une redirection TCP dans l'espace de nommage <strong>${namespace}</strong>.`;
  },
  'cc-tcp-redirection-form.create.success': /** @param {{namespace: string}} _ */ ({ namespace }) => {
    return sanitize`La redirection TCP dans l'espace de nommage <strong>${namespace}</strong> a été créée avec succès.`;
  },
  'cc-tcp-redirection-form.delete.error': /** @param {{namespace: string}} _ */ ({ namespace }) => {
    return sanitize`Une erreur est survenue pendant la suppression de la redirection TCP dans l'espace de nommage <strong>${namespace}</strong>.`;
  },
  'cc-tcp-redirection-form.delete.success': /** @param {{namespace: string}} _ */ ({ namespace }) => {
    return sanitize`La redirection TCP dans l'espace de nommage <strong>${namespace}</strong> a été supprimée avec succès.`;
  },
  'cc-tcp-redirection-form.description': () => sanitize`
    <p>
      Une redirection TCP permet d'obtenir un accès au port <code>4040</code> de l'application.<br>
      Vous pouvez créer une redirection TCP par application sur chaque espace de nommage auquel vous avez accès.
    </p>
    <p>
      Un espace de nommage correspond à un groupe de frontaux\u00A0: public, cleverapps.io, ou encore dédiés dans le cadre de Clever Cloud Premium.
    </p>
  `,
  'cc-tcp-redirection-form.documentation.text': `Redirections TCP - Documentation`,
  'cc-tcp-redirection-form.empty': `Vous n'avez accès à aucun espace de nommage.`,
  'cc-tcp-redirection-form.error': `Une erreur est survenue pendant le chargement des redirections TCP.`,
  'cc-tcp-redirection-form.title': `Redirections TCP`,
  //#endregion
  //#region cc-tile-deployments
  'cc-tile-deployments.empty': `Pas encore de déploiement.`,
  'cc-tile-deployments.error': `Une erreur est survenue pendant le chargement des déploiements.`,
  'cc-tile-deployments.error.icon-a11y-name': `Avertissement`,
  'cc-tile-deployments.state.cancelled': `Annulé`,
  'cc-tile-deployments.state.failed': `Échoué`,
  'cc-tile-deployments.state.started': `Démarré`,
  'cc-tile-deployments.state.stopped': `Arrêté`,
  'cc-tile-deployments.title': `Derniers déploiements`,
  //#endregion
  //#region cc-tile-instances
  'cc-tile-instances.empty': `Pas d'instance. L'application est arrêtée.`,
  'cc-tile-instances.error': `Une erreur est survenue pendant le chargement des instances.`,
  'cc-tile-instances.error.icon-a11y-name': `Avertissement`,
  'cc-tile-instances.status.deploying': `Déploiement`,
  'cc-tile-instances.status.running': `En ligne`,
  'cc-tile-instances.title': `Instances`,
  //#endregion
  //#region cc-tile-metrics
  'cc-tile-metrics.a11y.table-header.cpu': `Utilisation CPU sur 24h`,
  'cc-tile-metrics.a11y.table-header.mem': `Utilisation RAM sur 24h`,
  'cc-tile-metrics.a11y.table-header.timestamp': `Timestamp`,
  'cc-tile-metrics.about-btn': `Afficher plus d'informations à propos de ce graphique`,
  'cc-tile-metrics.close-btn': `Afficher le graphique`,
  'cc-tile-metrics.docs.more-metrics': `Plus de métriques\u00A0: `,
  'cc-tile-metrics.docs.msg': () => sanitize`<p>Métriques reçues durant les dernières 24 heures.</p>
    <p>Chaque barre représente une fenêtre de temps de <strong>1 heure</strong>.</p>
    <p>Le pourcentage affiché représente une moyenne sur la dernière heure.</p>`,
  'cc-tile-metrics.empty': `Pas de métriques. L'application est arrêtée.`,
  'cc-tile-metrics.error': `Une erreur est survenue pendant le chargement des métriques.`,
  'cc-tile-metrics.error.icon-a11y-name': `Avertissement`,
  'cc-tile-metrics.grafana': `Grafana`,
  'cc-tile-metrics.legend.cpu': `Utilisation CPU sur 24h`,
  'cc-tile-metrics.legend.mem': `Utilisation RAM sur 24h`,
  'cc-tile-metrics.link-to-grafana': `Ouvrir Grafana`,
  'cc-tile-metrics.link-to-metrics': `Ouvrir Métriques`,
  'cc-tile-metrics.metrics-link': `Métriques`,
  'cc-tile-metrics.percent': /** @param {{percent: number}} _ */ ({ percent }) => formatPercent(lang, percent),
  'cc-tile-metrics.timestamp-format': /** @param {{timestamp: string|number}} _ */ ({ timestamp }) =>
    formatDate(timestamp),
  'cc-tile-metrics.title': `Métriques serveur`,
  //#endregion
  //#region cc-tile-requests
  'cc-tile-requests.about-btn': `À propos de ce graphe…`,
  'cc-tile-requests.close-btn': `Afficher le graphe`,
  'cc-tile-requests.date-hours': /** @param {{date: string|number}} _ */ ({ date }) => formatHours(date),
  'cc-tile-requests.date-tooltip': /** @param {{from: string|number, to: string|number}} _ */ ({ from, to }) => {
    const date = formatDateOnly(from);
    const fromH = formatHours(from);
    const toH = formatHours(to);
    return `${date}\u00A0: de ${fromH} à ${toH}`;
  },
  'cc-tile-requests.docs.msg': /** @param {{windowHours: number}} _ */ ({ windowHours }) => {
    const hour = plural(windowHours, 'heure');
    return sanitize`Requêtes HTTP reçues durant les dernières 24 heures. Chaque barre représente une fenêtre de temps de <strong>${windowHours} ${hour}</strong>.`;
  },
  'cc-tile-requests.empty': `Il n'y a pas de données à afficher pour l'instant.`,
  'cc-tile-requests.error': `Une erreur est survenue pendant le chargement des requêtes.`,
  'cc-tile-requests.error.icon-a11y-name': `Avertissement`,
  'cc-tile-requests.requests-count': /** @param {{requestCount: number}} _ */ ({ requestCount }) =>
    formatNumberUnit(requestCount),
  'cc-tile-requests.requests-nb': /** @param {{value: number, windowHours: number}} _ */ ({ value, windowHours }) => {
    const request = plural(value, 'requête');
    const hour = plural(windowHours, 'heure');
    const formattedValue = formatNumber(lang, value);
    return `${formattedValue} ${request} (en ${windowHours} ${hour})`;
  },
  'cc-tile-requests.requests-nb.total': /** @param {{totalRequests: number}} _ */ ({ totalRequests }) => {
    const request = plural(totalRequests, 'requête');
    const formattedValue = formatNumberUnit(totalRequests);
    return `${formattedValue} ${request} sur 24 heures`;
  },
  'cc-tile-requests.title': `Requêtes HTTP`,
  //#endregion
  //#region cc-tile-scalability
  'cc-tile-scalability.error': `Une erreur est survenue pendant le chargement de la configuration de scalabilité.`,
  'cc-tile-scalability.error.icon-a11y-name': `Avertissement`,
  'cc-tile-scalability.flavor-info': /** @param {Flavor} flavor */ (flavor) => formatFlavor(flavor),
  'cc-tile-scalability.number': `Nombre`,
  'cc-tile-scalability.size': `Taille`,
  'cc-tile-scalability.title': `Scalabilité`,
  //#endregion
  //#region cc-tile-status-codes
  'cc-tile-status-codes.about-btn': `À propos de ce graphe…`,
  'cc-tile-status-codes.close-btn': `Afficher le graphe`,
  'cc-tile-status-codes.docs.link': () =>
    sanitize`<cc-link href="https://developer.mozilla.org/fr/docs/Web/HTTP/Status">Codes de réponses HTTP (MDN)</cc-link>`,
  'cc-tile-status-codes.docs.msg': `Répartition des codes de réponses HTTP envoyés durant les dernières 24 heures. Cliquez sur les éléments de légende pour cacher/montrer certaines catégories de codes.`,
  'cc-tile-status-codes.empty': `Il n'y a pas de données à afficher pour l'instant.`,
  'cc-tile-status-codes.error': `Une erreur est survenue pendant le chargement des codes de réponses HTTP.`,
  'cc-tile-status-codes.error.icon-a11y-name': `Avertissement`,
  'cc-tile-status-codes.title': `Codes de réponses HTTP`,
  'cc-tile-status-codes.tooltip': /** @param {{value: number, percent: number}} _ */ ({ value, percent }) => {
    const request = plural(value, 'requête');
    const formattedValue = formatNumber(lang, value);
    return `${formattedValue} ${request} (${formatPercent(lang, percent)})`;
  },
  //#endregion
  //#region cc-toast
  'cc-toast.close': `Fermer cette notification`,
  'cc-toast.icon-alt.danger': `Erreur`,
  'cc-toast.icon-alt.info': `Information`,
  'cc-toast.icon-alt.success': `Succès`,
  'cc-toast.icon-alt.warning': `Avertissement`,
  //#endregion
  //#region cc-token-api-creation-form
  'cc-token-api-creation-form.cli.content.create-token': `Créer un token d'API\u00A0:`,
  'cc-token-api-creation-form.cli.content.instruction': getCliInstructions,
  'cc-token-api-creation-form.cli.content.intro': `
      Gérez vos tokens d'API depuis un terminal à l'aide des commandes ci-dessous.
  `,
  'cc-token-api-creation-form.cli.content.list-token': `Lister les tokens d'API\u00A0:`,
  'cc-token-api-creation-form.cli.content.revoke-token': `Révoquer un token d'API\u00A0:`,
  'cc-token-api-creation-form.cli.content.use-token': `Utiliser votre token d'API\u00A0:`,
  'cc-token-api-creation-form.configuration-step.form.desc.label': `Description`,
  'cc-token-api-creation-form.configuration-step.form.expiration-date.error.invalid':
    /** @param {{ date: string }} _ */ ({ date }) =>
      sanitize`Saisissez une date et une heure valide.<br>Par exemple\u00A0: ${date}`,
  'cc-token-api-creation-form.configuration-step.form.expiration-date.error.range-overflow':
    /** @param {{ date: string }} _ */ ({ date }) =>
      sanitize`La date d'expiration doit être moins d'un an à partir de maintenant<br>Par exemple\u00A0: ${date}`,
  'cc-token-api-creation-form.configuration-step.form.expiration-date.error.range-underflow':
    /** @param {{ date: string }} _ */ ({ date }) =>
      sanitize`La date d'expiration doit être au moins 15 minutes à partir de maintenant<br>Par exemple\u00A0: ${date}`,
  'cc-token-api-creation-form.configuration-step.form.expiration-date.help.min-max': `Au moins 15 minutes et jusqu'à 1 an à partir de maintenant`,
  'cc-token-api-creation-form.configuration-step.form.expiration-date.label': `Date d'expiration`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.help.custom': `Spécifiez la date d'expiration à l'aide du champ ci-contre`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.label': `Durée avant expiration`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.custom': `Personnalisée`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.ninety-days': `90 jours`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.one-year': `1 an`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.seven-days': `7 jours`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.sixty-days': `60 jours`,
  'cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.thirty-days': `30 jours`,
  'cc-token-api-creation-form.configuration-step.form.link.back-to-list': `Retour à la liste des tokens d'API`,
  'cc-token-api-creation-form.configuration-step.form.name.label': `Nom`,
  'cc-token-api-creation-form.configuration-step.form.submit-button.label': `Continuer`,
  'cc-token-api-creation-form.configuration-step.main-heading': `Créer un nouveau token d'API`,
  'cc-token-api-creation-form.configuration-step.nav.label': `Configuration`,
  'cc-token-api-creation-form.copy-step.form.token.label': `Votre token d'API`,
  'cc-token-api-creation-form.copy-step.link.back-to-list': `Retour à la liste des tokens d'API`,
  'cc-token-api-creation-form.copy-step.main-heading': `Votre token d'API est prêt`,
  'cc-token-api-creation-form.copy-step.nav.label': `Récupération du token d'API`,
  'cc-token-api-creation-form.copy-step.notice.message': `Pour des raisons de sécurité, ce token d'API ne sera affiché qu'une fois. Assurez-vous de le copier et de le stocker dans un endroit sécurisé. Si vous perdez ce token, vous devrez le révoquer et en créer un nouveau.`,
  'cc-token-api-creation-form.error': `Une erreur est survenue lors du chargement des informations liées votre compte`,
  'cc-token-api-creation-form.link.doc': `Tokens d'API - Documentation`,
  'cc-token-api-creation-form.nav.aria-label': `Étapes de création de token d'API`,
  'cc-token-api-creation-form.validation-step.error.generic': `Une erreur est survenue lors de la création du token d'API`,
  'cc-token-api-creation-form.validation-step.form.link.back-to-configuration': `Retour à l'étape de configuration`,
  'cc-token-api-creation-form.validation-step.form.mfa-code.error': `Code 2FA invalide`,
  'cc-token-api-creation-form.validation-step.form.mfa-code.label': `Code de double authentification (2FA)`,
  'cc-token-api-creation-form.validation-step.form.password.error': `Mot de passe invalide`,
  'cc-token-api-creation-form.validation-step.form.password.label': `Mot de passe`,
  'cc-token-api-creation-form.validation-step.form.submit-button.label': `Créer`,
  'cc-token-api-creation-form.validation-step.main-heading': `Confirmer votre identité`,
  'cc-token-api-creation-form.validation-step.nav.label': `Authentification`,
  //#endregion
  //#region cc-token-api-list
  'cc-token-api-list.card.expired': `Expiré`,
  'cc-token-api-list.card.expires-soon': `Expire bientôt`,
  'cc-token-api-list.card.human-friendly-date': /** @param {{ date: string|number }} _ */ ({ date }) =>
    formatDatetime(date),
  'cc-token-api-list.card.label.creation': `Création\u00A0: `,
  'cc-token-api-list.card.label.expiration': `Expiration\u00A0: `,
  'cc-token-api-list.card.token-id-icon.a11y-name': `Identifiant du token d'API`,
  'cc-token-api-list.cli.content.create-token': `Créer un token d'API\u00A0:`,
  'cc-token-api-list.cli.content.instruction': getCliInstructions,
  'cc-token-api-list.cli.content.intro': `
        Gérez vos tokens d'API depuis un terminal à l'aide des commandes ci-dessous.
    `,
  'cc-token-api-list.cli.content.list-token': `Lister les tokens d'API\u00A0:`,
  'cc-token-api-list.cli.content.revoke-token': `Révoquer un token d'API\u00A0:`,
  'cc-token-api-list.cli.content.use-token': `Utiliser votre token d'API\u00A0:`,
  'cc-token-api-list.create-token': `Créer un nouveau token`,
  'cc-token-api-list.delete-token': /** @param {{ name: string}} _ */ ({ name }) =>
    `Supprimer le token d'API - ${name}`,
  'cc-token-api-list.empty': `Vous n'avez aucun token d'API, ou aucun d'eux n'est actif. Créez un nouveau token\u00A0:`,
  'cc-token-api-list.error': `Une erreur est survenue pendant le chargement des tokens d'API`,
  'cc-token-api-list.intro': () =>
    sanitize`Ci-dessous la liste des <cc-link href="${getDevHubUrl('/developers/api/howto/#request-the-api')}" a11y-desc="Tokens d'API - Documentation">tokens d'API</cc-link> associés à votre compte et leurs informations. Vous pouvez les révoquer si nécessaire.`,
  'cc-token-api-list.link.doc': `Tokens d'API - Documentation`,
  'cc-token-api-list.main-heading': `Tokens d'API`,
  'cc-token-api-list.no-password.create-password-btn': `Ajouter un mot de passe`,
  'cc-token-api-list.no-password.message': () =>
    sanitize`Votre compte Clever Cloud est lié via GitHub et ne possède pas de mot de passe. <strong>L'ajout d'un mot de passe est nécessaire pour créer des tokens d'API</strong>. Cliquez sur le bouton ci-contre pour <strong>ajouter un mot de passe à votre compte</strong>, nous vous enverrons un e-mail pour confirmer votre identité.`,
  'cc-token-api-list.no-password.reset-password-error': `Une erreur est survenue lors de la demande de création de mot de passe`,
  'cc-token-api-list.no-password.reset-password-successful': /** @param {{ email: string }} _ */ ({ email }) =>
    `L'e-mail a été envoyé à ${email}, rechargez cette page une fois le mot de passe ajouté à votre compte`,
  'cc-token-api-list.revoke-token': /** @param {{ name: string}} _ */ ({ name }) => `Révoquer le token d'API - ${name}`,
  'cc-token-api-list.revoke-token.error': `Une erreur est survenue pendant la révocation du token d'API`,
  'cc-token-api-list.revoke-token.success': `Le token d'API a été révoqué avec succès`,
  'cc-token-api-list.update-token': `Modifier`,
  'cc-token-api-list.update-token-with-name': /** @param {{ name: string}} _ */ ({ name }) =>
    `Modifier le token d'API - ${name}`,
  //#endregion
  //#region cc-token-api-update-form
  'cc-token-api-update-form.back-to-list': `Retour à la liste de tokens d'API`,
  'cc-token-api-update-form.cli.content.create-token': `Créer un token d'API\u00A0:`,
  'cc-token-api-update-form.cli.content.instruction': getCliInstructions,
  'cc-token-api-update-form.cli.content.intro': `
      Gérez vos tokens d'API depuis un terminal à l'aide des commandes ci-dessous.
  `,
  'cc-token-api-update-form.cli.content.list-token': `Lister les tokens d'API\u00A0:`,
  'cc-token-api-update-form.cli.content.revoke-token': `Révoquer un token d'API\u00A0:`,
  'cc-token-api-update-form.cli.content.use-token': `Utiliser votre token d'API\u00A0:`,
  'cc-token-api-update-form.description.label': `Description`,
  'cc-token-api-update-form.error': `Une erreur est survenue lors du chargement du token d'API`,
  'cc-token-api-update-form.link.doc': `Tokens d'API - Documentation`,
  'cc-token-api-update-form.main-heading': `Modifier votre token d'API`,
  'cc-token-api-update-form.name.label': `Nom`,
  'cc-token-api-update-form.submit-button': `Modifier`,
  'cc-token-api-update-form.update-token.error': `Une erreur est survenue lors de la mise à jour du token d'API`,
  'cc-token-api-update-form.update-token.success': `Le token d'API a été mis à jour avec succès`,
  //#endregion
  //#region cc-token-oauth-list
  'cc-token-oauth-list.card.expires-soon': `Expire bientôt`,
  'cc-token-oauth-list.card.human-friendly-date': /** @param {{ date: string|number }} _ */ ({ date }) =>
    formatDatetime(date),
  'cc-token-oauth-list.card.label.creation': `Création\u00A0: `,
  'cc-token-oauth-list.card.label.expiration': `Expiration\u00A0: `,
  'cc-token-oauth-list.card.label.last-used': `Dernière utilisation\u00A0: `,
  'cc-token-oauth-list.empty': `Aucune application tierce n'est liée à votre compte`,
  'cc-token-oauth-list.error': `Une erreur est survenue pendant le chargement des tokens OAuth`,
  'cc-token-oauth-list.intro': () =>
    sanitize`Ci-dessous la liste des applications tierces liées à votre compte et leurs informations. Vous pouvez révoquer leurs <cc-link href="${getDevHubUrl('/developers/api/howto/#oauth1')}" a11y-desc="tokens OAuth - Documentation">tokens OAuth</cc-link> si vous le souhaitez.`,
  'cc-token-oauth-list.link.doc': `Tokens OAuth - Documentation`,
  'cc-token-oauth-list.main-heading': `Tokens OAuth`,
  'cc-token-oauth-list.revoke-all-tokens': `Révoquer tous les tokens OAuth`,
  'cc-token-oauth-list.revoke-all-tokens.error': () =>
    sanitize`Une erreur est survenue pendant la révocation des tokens OAuth.<br>Aucun token OAuth n'a été révoqué`,
  'cc-token-oauth-list.revoke-all-tokens.partial-error': () =>
    sanitize`Une erreur est survenue pendant la révocation des tokens OAuth.<br>Seuls certains tokens OAuth ont été révoqués avec succès`,
  'cc-token-oauth-list.revoke-all-tokens.success': `Tous les tokens OAuth ont été révoqués avec succès`,
  'cc-token-oauth-list.revoke-token': /** @param {{ consumerName: string}} _ */ ({ consumerName }) =>
    `Révoquer le token OAuth pour ${consumerName}`,
  'cc-token-oauth-list.revoke-token.error': `Une erreur est survenue pendant la révocation du token OAuth`,
  'cc-token-oauth-list.revoke-token.success': `Le token OAuth a été révoqué avec succès`,
  //#endregion
  //#region cc-token-session-list
  'cc-token-session-list.card.clever-team': `Équipe Clever Cloud`,
  'cc-token-session-list.card.current-session': `Session actuelle`,
  'cc-token-session-list.card.expires-soon': `Expire bientôt`,
  'cc-token-session-list.card.human-friendly-date': /** @param {{ date: string|number }} _ */ ({ date }) =>
    formatDatetime(date),
  'cc-token-session-list.card.label.creation': `Création\u00A0: `,
  'cc-token-session-list.card.label.expiration': `Expiration\u00A0: `,
  'cc-token-session-list.card.label.last-used': `Dernière utilisation\u00A0: `,
  'cc-token-session-list.error': `Une erreur est survenue pendant le chargement des sessions`,
  'cc-token-session-list.intro': `Ci-dessous la liste des sessions enregistrées pour votre compte, que vous pouvez révoquer (excepté celle en cours)\u00A0:`,
  'cc-token-session-list.main-heading': `Sessions de connexion à la Console`,
  'cc-token-session-list.revoke-all-sessions': `Révoquer toutes les sessions`,
  'cc-token-session-list.revoke-all-sessions.error': () =>
    sanitize`Une erreur est survenue pendant la révocation de toutes les sessions.<br>Aucune session n'a été révoquée`,
  'cc-token-session-list.revoke-all-sessions.partial-error': () =>
    sanitize`Une erreur est survenue pendant la révocation de toutes les sessions.<br>Seules certaines sessions ont été révoquées avec succès`,
  'cc-token-session-list.revoke-all-sessions.success': `Toutes les sessions ont été révoquées avec succès`,
  'cc-token-session-list.revoke-session': /** @param {{ tokenNumber: number}} _ */ ({ tokenNumber }) =>
    `Révoquer la session ${tokenNumber}`,
  'cc-token-session-list.revoke-session.error': `Une erreur est survenue pendant la révocation de la session`,
  'cc-token-session-list.revoke-session.success': `La session a été révoquée avec succès`,
  //#endregion
  //#region cc-zone
  'cc-zone.country': /** @param {{code: string, name: string}} _ */ ({ code, name }) =>
    getCountryName(lang, code, name),
  //#endregion
  //#region cc-zone-input
  'cc-zone-input.error': `Une erreur est survenue pendant le chargement des zones.`,
  'cc-zone-input.private-map-warning': `Les zones privées n'apparaissent pas sur la carte.`,
  //#endregion
  //#region cc-zone-picker
  'cc-zone-picker.alt.country-name': /** @param {{code: string, name: string}} _ */ ({ code, name }) =>
    getCountryName(lang, code, name),
  'cc-zone-picker.legend': `Sélectionnez votre zone`,
  //#endregion
};

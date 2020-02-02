import {
  prepareFormatDate,
  prepareFormatDateOnly,
  prepareFormatDistanceToNow,
  prepareFormatHours,
  prepareFormatDatetime,
} from '../lib/i18n-date.js';
import { prepareNumberUnitFormatter } from '../lib/i18n-number.js';

import { sanitize } from '../lib/i18n-sanitize';

export const lang = 'fr';

// We considered Intl.PluralRules but no support in Safari 12 and polyfill does too much for us
function plural (singular, plural = singular + 's') {
  return (count) => {
    return (count <= 1) ? singular : plural;
  };
}

const UNITS_FR = {
  year: 'année',
  month: 'mois',
  week: 'semaine',
  day: 'jour',
  hour: 'heure',
  minute: 'minute',
  second: 'seconde',
};

const formatDistanceToNow = prepareFormatDistanceToNow(lang, (value, unit) => {
  const frUnit = UNITS_FR[unit];
  const pluralUnit = frUnit.endsWith('s')
    ? plural(frUnit, frUnit)(value)
    : plural(frUnit)(value);
  return `il y a ${value} ${pluralUnit}`;
}, 'à l\'instant');

const formatDate = prepareFormatDate(lang);
const formatDatetime = prepareFormatDatetime(lang);
const formatDateOnly = prepareFormatDateOnly(lang);
const formatHours = prepareFormatHours(lang);

const currencyFormatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' });
const percentFormatter = new Intl.NumberFormat(lang, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat(lang);
const formatNumberUnit = prepareNumberUnitFormatter(lang);

export const translations = {
  LANGUAGE: '🇫🇷 Français',
  // cc-addon-backups
  'cc-addon-backups.automatic-restore': `Restauration automatique`,
  'cc-addon-backups.automatic-restore.es-addon': ({ href }) => sanitize`Une sauvegarde peut être restaurée avec Kibana. Rendez vous vers le <a href="${href}">dépôt de sauvegardes</a> et sélectionnez la sauvegarde que vous voulez restaurer.`,
  'cc-addon-backups.description.es-addon': `Les sauvegardes sont gérées par Elasticsearch lui-même. Vous pouvez restaurer une sauvegarde en utilisant la commande ci-dessous ou depuis l'interface Kibana. Vous pouvez aussi controller la rétention ainsi que la périodicité de prise des sauvegardes à travers l'interface Kibana.`,
  'cc-addon-backups.empty': `Il n'y a aucune sauvegarde pour l'instant.`,
  'cc-addon-backups.link.es-addon': `ouvrir dans Kibana`,
  'cc-addon-backups.loading-error': `Une erreur est survenue pendant le chargement des sauvegardes.`,
  'cc-addon-backups.manual-restore': `Restauration manuelle`,
  'cc-addon-backups.manual-restore.es-addon': `Vous pouvez restorer la sauvegarde grâce à l'outil cURL en exécutant cette commande :`,
  'cc-addon-backups.restore': `Restaurer une sauvegarde`,
  'cc-addon-backups.text': ({ createdAt, expiresAt }) => sanitize`Sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expire le <strong>${formatDateOnly(expiresAt)}</strong>)`,
  'cc-addon-backups.title': `Sauvegardes`,
  // cc-addon-credentials
  'cc-addon-credentials.description.apm': `Utilisez ces identifiants pour connecter une instance d'APM Server à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.elasticsearch': `Utilisez ces identifiants pour vous connecter à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.kibana': `Utilisez ces identifiants pour connecter une instance de Kibana à votre cluster Elasticsearch.`,
  'cc-addon-credentials.field.auth-token': `Token d'authentification`,
  'cc-addon-credentials.field.host': `Nom de domaine`,
  'cc-addon-credentials.field.password': `Mot de passe`,
  'cc-addon-credentials.field.user': `Utilisateur`,
  'cc-addon-credentials.loading-error': `Une erreur est survenue pendant le chargement des informations de connexion.`,
  'cc-addon-credentials.title': ({ name }) => `Identifiants ${name}`,
  // cc-addon-features
  'cc-addon-features.details': `Ci-dessous, les spécifications de votre add-on. Elles peuvent évoluer et une migration de l'add-on peut être nécessaire pour en bénéficier.`,
  'cc-addon-features.loading-error': `Une erreur est survenue pendant le chargement des spécifications de l'add-on`,
  'cc-addon-features.title': `Spécifications de l'add-on`,
  'cc-addon-features.feature-name.disk': `Disque`,
  'cc-addon-features.feature-name.nodes': `Nœuds`,
  'cc-addon-features.feature-name.memory': `Mémoire`,
  'cc-addon-features.feature-value.yes': `Oui`,
  'cc-addon-features.feature-value.no': `Non`,
  // cc-addon-linked-apps
  'cc-addon-linked-apps.details': `Ci-dessous la liste des applications liées à l'add-on. L'add-on expose ses variables d'environnement aux applications qui lui sont liées.`,
  'cc-addon-linked-apps.loading-error': `Une erreur est survenue pendant le chargement des applications liées.`,
  'cc-addon-linked-apps.no-linked-applications': `Aucune application liée pour l'instant.`,
  'cc-addon-linked-apps.title': `Applications liées à cet add-on`,
  'cc-addon-linked-apps.zone': `zone:`,
  // cc-beta
  'cc-beta.label': `bêta`,
  // cc-block
  'cc-block.toggle.open': `Ouvrir`,
  'cc-block.toggle.close': `Fermer`,
  // cc-button
  'cc-button.cancel': `Cliquez pour annuler`,
  // cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(date),
  // cc-elasticsearch-info
  'cc-elasticsearch-info.error': `Une erreur est survenue pendant le chargement des liens des add-on liés à cette application.`,
  'cc-elasticsearch-info.info': `Info`,
  'cc-elasticsearch-info.link.apm': `Ouvrir APM`,
  'cc-elasticsearch-info.link.doc': `Lire la documentation`,
  'cc-elasticsearch-info.link.elasticsearch': `Voir l'add-on Elasticsearch`,
  'cc-elasticsearch-info.link.kibana': `Ouvrir Kibana`,
  'cc-elasticsearch-info.text': `Ce service fait partie d'une offre Elasticsearch Enterprise. Vous pouvez retrouver la documentation ainsi que les différents lié ci-dessous.`,
  // cc-header-addon
  'cc-header-addon.plan': `Plan`,
  'cc-header-addon.version': `Version`,
  'cc-header-addon.creation-date': `Date de création`,
  'cc-header-addon.creation-date.short': ({ date }) => formatDateOnly(date),
  'cc-header-addon.creation-date.full': ({ date }) => formatDate(date),
  'cc-header-addon.error': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  // cc-header-app
  'cc-header-app.action.cancel-deployment': `Annuler le déploiement`,
  'cc-header-app.action.restart': `Redémarrer`,
  'cc-header-app.action.restart-last-commit': `Redémarrer le dernier commit poussé`,
  'cc-header-app.action.restart-rebuild': `Re-build et redémarrer`,
  'cc-header-app.action.start': `Démarrer`,
  'cc-header-app.action.start-last-commit': `Démarrer le dernier commit poussé`,
  'cc-header-app.action.start-rebuild': `Re-build et démarrer`,
  'cc-header-app.action.stop': `Arrêter l'application`,
  'cc-header-app.disable-buttons': `Vous n'êtes pas autorisé à réaliser ces actions`,
  'cc-header-app.read-logs': `voir les logs`,
  'cc-header-app.commits.no-commits': `pas encore de commit`,
  'cc-header-app.commits.git': ({ commit }) => `version du dépôt git (HEAD) : ${commit}`,
  'cc-header-app.commits.running': ({ commit }) => `version en ligne : ${commit}`,
  'cc-header-app.commits.starting': ({ commit }) => `version en cours de déploiement : ${commit}`,
  'cc-header-app.state-msg.app-is-restarting': `L'application redémarre...`,
  'cc-header-app.state-msg.app-is-running': `Votre application est disponible !`,
  'cc-header-app.state-msg.app-is-starting': `L'application démarre...`,
  'cc-header-app.state-msg.app-is-stopped': `L'application est arrêtée.`,
  'cc-header-app.state-msg.last-deploy-failed': `Le dernier déploiement a échoué,`,
  'cc-header-app.state-msg.unknown-state': `État inconnu, essayez de redémarrer l'application ou de contacter notre support si vous avez des questions.`,
  'cc-header-app.user-action-msg.app-will-start': `L'application va bientôt démarrer...`,
  'cc-header-app.user-action-msg.deploy-will-begin': `Un déploiement va bientôt commencer...`,
  'cc-header-app.user-action-msg.deploy-cancelled': `Ce déploiement a été annulé.`,
  'cc-header-app.user-action-msg.app-will-stop': `L'application va s'arrêter...`,
  'cc-header-app.error': `Une erreur est survenue pendant le chargement des informations de l'application.`,
  // cc-header-orga
  'cc-header-orga.hotline': `Numéro d'urgence :`,
  'cc-header-orga.error': `Une erreur est survenue pendant le chargement des informations de l'organisation.`,
  // cc-tile-consumption
  'cc-tile-consumption.title': `Consommation de crédits`,
  'cc-tile-consumption.yesterday': `Hier`,
  'cc-tile-consumption.last-30-days': `30 derniers jours`,
  'cc-tile-consumption.amount': ({ amount }) => currencyFormatter.format(amount),
  'cc-tile-consumption.error': `Une erreur est survenue pendant le chargement de la consommation.`,
  // cc-tile-deployments
  'cc-tile-deployments.title': `Derniers déploiements`,
  'cc-tile-deployments.state.failed': `Échoué`,
  'cc-tile-deployments.state.started': `Démarré`,
  'cc-tile-deployments.state.cancelled': `Annulé`,
  'cc-tile-deployments.state.stopped': `Arrêté`,
  'cc-tile-deployments.empty': `Pas encore de déploiement.`,
  'cc-tile-deployments.error': `Une erreur est survenue pendant le chargement des déploiements.`,
  // cc-tile-instances
  'cc-tile-instances.title': `Instances`,
  'cc-tile-instances.status.deploying': `Déploiement`,
  'cc-tile-instances.status.running': `En ligne`,
  'cc-tile-instances.empty': `Pas d'instance. L'application est arrêtée.`,
  'cc-tile-instances.error': `Une erreur est survenue pendant le chargement des instances.`,
  // cc-tile-requests
  'cc-tile-requests.title': `Requêtes HTTP`,
  'cc-tile-requests.about': `À propos de ce graphe...`,
  'cc-tile-requests.date-hours': ({ date }) => formatHours(date),
  'cc-tile-requests.date-tooltip': ({ from, to }) => {
    const date = formatDateOnly(from);
    const fromH = formatHours(from);
    const toH = formatHours(to);
    return `${date} : de ${fromH} à ${toH}`;
  },
  'cc-tile-requests.requests-nb': ({ value, windowHours }) => {
    const request = plural('requête')(value);
    const hour = plural('heure')(windowHours);
    const formattedValue = numberFormatter.format(value);
    return `${formattedValue} ${request} (en ${windowHours} ${hour})`;
  },
  'cc-tile-requests.requests-nb.total': ({ totalRequests }) => {
    const request = plural('requête')(totalRequests);
    const formattedValue = formatNumberUnit(totalRequests);
    return `${formattedValue} ${request} sur 24 heures`;
  },
  'cc-tile-requests.requests-count': ({ requestCount }) => formatNumberUnit(requestCount),
  'cc-tile-requests.empty': `Il n'y a pas de données à afficher pour l'instant.`,
  'cc-tile-requests.error': `Une erreur est survenue pendant le chargement des requêtes.`,
  'cc-tile-requests.docs.msg': ({ windowHours }) => {
    const hour = plural('heure')(windowHours);
    return sanitize`Requêtes HTTP reçues durant les dernières 24 heures. Chaque barre représente une fenêtre de temps de <strong>${windowHours} ${hour}</strong>.`;
  },
  // cc-tile-scalability
  'cc-tile-scalability.title': `Scalabilité`,
  'cc-tile-scalability.size': `Taille`,
  'cc-tile-scalability.number': `Nombre`,
  'cc-tile-scalability.flavor-info': (f) => {
    const cpu = `CPUs : ${f.cpus}`;
    const shared = f.microservice ? ` (partagé)` : '';
    const gpu = f.gpus > 0 ? `GPUs : ${f.gpus}` : '';
    const mem = `RAM : ${(f.mem < 1024) ? `${f.mem} Mo` : `${f.mem / 1024} Go`}`;
    return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
  },
  'cc-tile-scalability.error': `Une erreur est survenue pendant le chargement de la configuration de scalabilité.`,
  // cc-tile-status-codes
  'cc-tile-status-codes.title': `Codes de réponses HTTP`,
  'cc-tile-status-codes.about': `À propos de ce graphe...`,
  'cc-tile-status-codes.tooltip': ({ value, percent }) => {
    const request = plural('requête')(value);
    const formattedValue = numberFormatter.format(value);
    return `${formattedValue} ${request} (${percentFormatter.format(percent)})`;
  },
  'cc-tile-status-codes.error': `Une erreur est survenue pendant le chargement des codes de réponses HTTP.`,
  'cc-tile-status-codes.empty': `Il n'y a pas de données à afficher pour l'instant.`,
  'cc-tile-status-codes.docs.msg': `Répartition des codes de réponses HTTP envoyés durant les dernières 24 heures. Cliquez sur les éléments de légende pour cacher/montrer certaines catégories de codes.`,
  'cc-tile-status-codes.docs.link': () => sanitize`<a href="https://developer.mozilla.org/fr/docs/Web/HTTP/Status">Codes de réponses HTTP (MDN)</a>`,
  // cc-input-text
  'cc-input-text.clipboard': `Copier dans le presse-papier`,
  'cc-input-text.secret.show': `Afficher le secret`,
  'cc-input-text.secret.hide': `Cacher le secret`,
  // cc-logsmap
  'cc-logsmap.mode.points': `En direct`,
  'cc-logsmap.mode.heatmap': `Dernières 24h`,
  'cc-logsmap.legend.points': ({ orgaName }) => sanitize`Carte temps réel des requêtes HTTP reçues par toutes les applications de <strong>${orgaName}</strong>.`,
  'cc-logsmap.legend.points.app': ({ appName }) => sanitize`Carte temps réel des requêtes HTTP reçues par l'application <strong>${appName}</strong>.`,
  'cc-logsmap.legend.heatmap': ({ orgaName }) => sanitize`Carte de chaleur des requêtes HTTP reçues par les applications de <strong>${orgaName}</strong> durant les dernières 24 heures.`,
  'cc-logsmap.legend.heatmap.app': ({ appName }) => sanitize`Carte de chaleur des requêtes HTTP reçues par l'application <strong>${appName}</strong> durant les dernières 24 heures.`,
  // cc-map
  'cc-map.error': `Une erreur est survenue pendant le chargement des données de la carte.`,
  'cc-map.no-points': `Pas de données à afficher sur la carte en ce moment.`,
  // env-var-create
  'env-var-create.name.placeholder': `NOM_DE_LA_VARIABLE`,
  'env-var-create.value.placeholder': `valeur de la variable`,
  'env-var-create.create-button': `Ajouter`,
  'env-var-create.errors.invalid-name': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'env-var-create.errors.already-defined-name': ({ name }) => sanitize`Le nom <code>${name}</code> est déjà défini`,
  // env-var-editor-simple
  'env-var-editor-simple.empty-data': `Il n'y a pas de variable.`,
  // env-var-editor-expert
  'env-var-editor-expert.placeholder': `NOM_DE_LA_VARIABLE="valeur de la variable"`,
  'env-var-editor-expert.placeholder-readonly': `Il n'y a pas de variable.`,
  'env-var-editor-expert.errors.unknown': `Erreur inconnue`,
  'env-var-editor-expert.errors.line': `ligne`,
  'env-var-editor-expert.errors.invalid-name': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'env-var-editor-expert.errors.duplicated-name': ({ name }) => sanitize`attention, le nom <code>${name}</code> est déjà défini`,
  'env-var-editor-expert.errors.invalid-line': () => sanitize`cette ligne est invalide, le format correct est : <code>NOM="VALEUR"</code>`,
  'env-var-editor-expert.errors.invalid-value': () => sanitize`la valeur est invalide, si vous utilisez des guillements, vous devez les échapper comme ceci : <code>\\"</code> ou alors mettre toute la valeur entre guillemets.`,
  // env-var-form
  'env-var-form.mode.simple': `Simple`,
  'env-var-form.mode.expert': `Expert`,
  'env-var-form.reset': `Annuler les changements`,
  'env-var-form.restart-app': `Redémarrer l'app pour appliquer les changements`,
  'env-var-form.update': `Mettre à jour les changements`,
  'env-var-form.error.loading': `Une erreur est survenue pendant le chargement des variables d'environnement.`,
  'env-var-form.error.saving': `Une erreur est survenue pendant la mise à jour des variables d'environnement.`,
  'env-var-form.error.unknown': `Une erreur est survenue...`,
  // env-var-input
  'env-var-input.delete-button': `Enlever`,
  'env-var-input.keep-button': `Garder`,
  'env-var-input.value-placeholder': `valeur de la variable`,
  // env-var-full
  'env-var-full.heading': `Variables d'environnement`,
  'env-var-full.message': `Les variables d'environnement sont des variables dynamiques que vous pouvez injecter dans votre application.`,
  'env-var-full.link': `En savoir plus`,
};

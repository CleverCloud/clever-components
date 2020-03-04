import {
  prepareFormatDate,
  prepareFormatDateOnly,
  prepareFormatDatetime,
  prepareFormatDistanceToNow,
  prepareFormatHours,
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

// Shared logic between translations, is it a good idea?
function formatFlavor (f) {
  const cpu = `CPUs : ${f.cpus}`;
  const shared = f.microservice ? ` (partagé)` : '';
  const gpu = f.gpus > 0 ? `GPUs : ${f.gpus}` : '';
  const mem = `RAM : ${(f.mem < 1024) ? `${f.mem} Mo` : `${f.mem / 1024} Go`}`;
  return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
}

export const translations = {
  LANGUAGE: '🇫🇷 Français',
  // cc-addon-backups
  'cc-addon-backups.command-password': `Cette commande vous demandera votre mot de passe, le voici :`,
  'cc-addon-backups.delete': ({ createdAt }) => sanitize`Supprimer la sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong>`,
  'cc-addon-backups.delete.btn': 'supprimer...',
  'cc-addon-backups.delete.with-service.title.es-addon': `Suppression avec Kibana`,
  'cc-addon-backups.delete.with-service.description.es-addon': ({ href }) => sanitize`Vous pouvez supprimer cette sauvegarde avec Kibana en vous rendant sur le <a href="${href}">dépôt de sauvegardes</a>.`,
  'cc-addon-backups.delete.manual.title': `Suppression manuelle`,
  'cc-addon-backups.delete.manual.description.es-addon': `Vous pouvez supprimer cette sauvegarde manuellement grâce à l'outil cURL en exécutant cette commande :`,
  'cc-addon-backups.description.es-addon': `Les sauvegardes sont gérées par Elasticsearch lui-même. Vous pouvez définir la rétention ainsi que la périodicité des sauvegardes dans l'interface de Kibana.`,
  'cc-addon-backups.description.es-addon-old': `Les sauvegardes sont gérées par Elasticsearch lui-même. La version de votre Elasticsearch ne permet pas de définir de politique de rétention. La suppression d'une sauvegarde se fait manuellement avec l'API d'Elasticsearch.`,
  'cc-addon-backups.empty': `Il n'y a aucune sauvegarde pour l'instant.`,
  'cc-addon-backups.link.es-addon': `ouvrir dans Kibana`,
  'cc-addon-backups.link.es-addon-old': `ouvrir dans Elasticsearch`,
  'cc-addon-backups.loading-error': `Une erreur est survenue pendant le chargement des sauvegardes.`,
  'cc-addon-backups.restore': ({ createdAt }) => sanitize`Restaurer la sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong>`,
  'cc-addon-backups.restore.btn': 'restaurer...',
  'cc-addon-backups.restore.with-service.title.es-addon': `Restauration avec Kibana`,
  'cc-addon-backups.restore.with-service.description.es-addon': ({ href }) => sanitize`Vous pouvez restaurer cette sauvegarde avec Kibana en vous rendant sur le <a href="${href}">dépôt de sauvegardes</a>.`,
  'cc-addon-backups.restore.manual.title': `Restauration manuelle`,
  'cc-addon-backups.restore.manual.description.es-addon': `Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil cURL en exécutant cette commande :`,
  'cc-addon-backups.text': ({ createdAt, expiresAt }) => sanitize`Sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expire le <strong>${formatDateOnly(expiresAt)}</strong>)`,
  'cc-addon-backups.text.user-defined-retention': ({ createdAt }) => sanitize`Sauvegarde du <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expire après la durée de rétention définie)`,
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
  'cc-addon-features.feature-name.disk': `Disque`,
  'cc-addon-features.feature-name.memory': `Mémoire`,
  'cc-addon-features.feature-name.nodes': `Nœuds`,
  'cc-addon-features.feature-value.dedicated': `Dédié`,
  'cc-addon-features.feature-value.no': `Non`,
  'cc-addon-features.feature-value.yes': `Oui`,
  'cc-addon-features.loading-error': `Une erreur est survenue pendant le chargement des spécifications de l'add-on`,
  'cc-addon-features.title': `Spécifications`,
  // cc-addon-linked-apps
  'cc-addon-linked-apps.details': `Ci-dessous la liste des applications liées à l'add-on. L'add-on expose ses variables d'environnement aux applications qui lui sont liées.`,
  'cc-addon-linked-apps.loading-error': `Une erreur est survenue pendant le chargement des applications liées.`,
  'cc-addon-linked-apps.no-linked-applications': `Aucune application liée pour l'instant.`,
  'cc-addon-linked-apps.title': `Applications liées`,
  'cc-addon-linked-apps.zone': `zone:`,
  // cc-beta
  'cc-beta.label': `bêta`,
  // cc-error
  'cc-error.ok': `OK`,
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
  'cc-elasticsearch-info.text': `Ce service fait partie d'une offre Elasticsearch Enterprise. Vous pouvez retrouver la documentation ainsi que les différents services liés ci-dessous.`,
  // cc-elasticsearch-options
  'cc-elasticsearch-options.enabled': `Activé`,
  'cc-elasticsearch-options.disabled': `Désactivé`,
  'cc-elasticsearch-options.confirm': `Confirmer les options`,
  'cc-elasticsearch-options.title': `Options pour Elasticsearch Enterprise`,
  'cc-elasticsearch-options.description': () => sanitize`Cet add-on fait partie de notre offre Elasticsearch Enterprise qui inclue deux options. Ces options sont déployées comme des applications et seront gérées et mises à jour par Clever Cloud. Elles apparaîtront donc comme des application habituelles que vous pouvez arrêter, supprimer, scaler comme n'importe quelle autre application. <strong>Activer ces options augmentera votre consommation de crédits.</strong>`,
  'cc-elasticsearch-options.description.kibana': () => sanitize`Kibana est l'interface d'administration de la Suite Elastic. Kibana vous permet de visualiser vos données Elasticsearch et de naviguer dans la Suite Elastic. Vous voulez effectuer le suivi de la charge de travail liée à la recherche ou comprendre le flux des requêtes dans vos applications ? Kibana est là pour ça. Retrouvez plus de détails dans <a href="https://www.elastic.co/guide/en/kibana/master/index.html">la documentation officielle de Kibana</a>.`,
  'cc-elasticsearch-options.description.apm': () => sanitize`Elastic APM est un serveur de monitoring de performance applicative pour la Suite Elastic. Déployer cette option permet d'envoyer automatiquement les métriques de toute application liée à cette instance d'add-on Elasticsearch, en supposant que vous utilisez bien l'agent Elastic APM dans les dépendances de vos applications. Retrouvez plus de détails dans <a href="https://www.elastic.co/guide/en/apm/get-started/current/overview.html">la documentation officielle de APM server</a>.`,
  'cc-elasticsearch-options.warning.kibana': `Si vous activez cette option, nous allons déployer et gérer pour vous un Kibana, ce qui entraînera des coûts supplémentaires.`,
  'cc-elasticsearch-options.warning.kibana.details': (flavor) => sanitize`Par défaut, l'app sera démarrée sur une <strong title="${formatFlavor(flavor)}">instance ${flavor.name}</strong> qui coûte environ <strong>${currencyFormatter.format(flavor.monthlyCost)} par mois</strong>.`,
  'cc-elasticsearch-options.warning.apm': `Si vous activez cette option, nous allons déployer et gérer pour vous un APM server, ce qui entraînera des coûts supplémentaires.`,
  'cc-elasticsearch-options.warning.apm.details': (flavor) => sanitize`Par défaut, l'app sera démarrée sur une <strong title="${formatFlavor(flavor)}">instance ${flavor.name}</strong> qui coûte environ <strong>${currencyFormatter.format(flavor.monthlyCost)} par mois</strong>. `,
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
  // cc-addon-admin
  'cc-addon-admin.addon-name': `Nom de l'add-on`,
  'cc-addon-admin.admin': `Administration`,
  'cc-addon-admin.danger-zone': `Zone de danger`,
  'cc-addon-admin.delete': `Supprimer l'add-on`,
  'cc-addon-admin.delete-24h-delay': `La machine virtuelle sera arrêtée dans 24 heures.`,
  'cc-addon-admin.delete-keep-backups': `Les backups seront gardés suivant la politique de rétention.`,
  'cc-addon-admin.delete-unavailable': `Supprimer cet add-on le rendra directement indisponible.`,
  'cc-addon-admin.error-loading': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  'cc-addon-admin.error-saving': `Une erreur est survenue pendant la sauvegarde des modifications`,
  'cc-addon-admin.tags': `Tags`,
  'cc-addon-admin.tags-description': `Les tags vous permettent de classer vos applications et add-ons afin de les catégoriser`,
  'cc-addon-admin.tags-empty': `Pas de tags définis`,
  'cc-addon-admin.tags-update': `Mettre à jour les tags`,
  'cc-addon-admin.update': `Mettre à jour le nom`,
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
  'cc-tile-scalability.flavor-info': (flavor) => formatFlavor(flavor),
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

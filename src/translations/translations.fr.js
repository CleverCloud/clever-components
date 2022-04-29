import {
  formatDate,
  formatDateOnly,
  formatDatetime,
  formatHours,
  prepareFormatDistanceToNow,
} from '../lib/i18n-date.js';
import { getCountryName } from '../lib/i18n-display.js';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  prepareNumberBytesFormatter,
  prepareNumberUnitFormatter,
} from '../lib/i18n-number.js';
import { sanitize } from '../lib/i18n-sanitize.js';
import { preparePlural } from '../lib/i18n-string.js';

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

const formatDistanceToNow = prepareFormatDistanceToNow(lang, (value, unit) => {
  const frUnit = UNITS_FR[unit];
  const pluralUnit = frUnit.endsWith('s')
    ? plural(value, frUnit, frUnit)
    : plural(value, frUnit);
  return `il y a ${value} ${pluralUnit}`;
}, 'à l\'instant');

const formatNumberUnit = prepareNumberUnitFormatter(lang);
const formatBytes = prepareNumberBytesFormatter(lang, 'o', '\u202f');
const BYTES_SI_SEPARATOR = '\u202f';
const formatBytesSi = prepareNumberUnitFormatter(lang, 'o', BYTES_SI_SEPARATOR);

function getUnit (value) {
  return formatBytesSi(value).split(BYTES_SI_SEPARATOR)[1];
}

// Shared logic between translations, is it a good idea?
function formatFlavor (f) {
  const cpu = `CPUs : ${f.cpus}`;
  const shared = f.microservice ? ` (partagé)` : '';
  const gpu = f.gpus > 0 ? `GPUs : ${f.gpus}` : '';
  const mem = `RAM : ${formatBytes(f.mem * 1024 * 1024)}`;
  return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
}

export const translations = {
  LANGUAGE: 'Français',
  //#region cc-action-dispatcher
  'cc-action-dispatcher.context': `Ce bouton permet d'envoyer un ping à toutes les VMs sur Clever Cloud.`,
  'cc-action-dispatcher.error-message': `Une erreur est survenue pendant l'envoi d'actions aux VMs.`,
  'cc-action-dispatcher.number-of-pings': `Nombre de VMs`,
  'cc-action-dispatcher.number-of-pongs': `Nombre de VMs répondantes`,
  'cc-action-dispatcher.ping-button-content': `Envoyer le ping`,
  'cc-action-dispatcher.unresponsive-instances': `VMs muettes`,
  //#endregion
  //#region cc-addon-admin
  'cc-addon-admin.admin': `Administration de l'add-on`,
  'cc-addon-admin.danger-zone': `Zone de danger`,
  'cc-addon-admin.delete': `Supprimer l'add-on`,
  'cc-addon-admin.delete-description': () => sanitize`La machine virtuelle sera arrêtée dans 24 heures.<br>Les backups seront gardés suivant la politique de rétention.<br>Supprimer cet add-on le rendra directement indisponible.`,
  'cc-addon-admin.error-loading': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  'cc-addon-admin.error-saving': `Une erreur est survenue pendant la sauvegarde des modifications`,
  'cc-addon-admin.heading.name': `Nom`,
  'cc-addon-admin.heading.tags': `Tags`,
  'cc-addon-admin.input.name': `Nom de l'add-on`,
  'cc-addon-admin.input.tags': `Tags de l'add-on`,
  'cc-addon-admin.tags-description': `Les tags vous permettent de classer vos applications et add-ons afin de les catégoriser`,
  'cc-addon-admin.tags-empty': `Pas de tags définis`,
  'cc-addon-admin.tags-update': `Mettre à jour les tags`,
  'cc-addon-admin.update': `Mettre à jour le nom`,
  //#endregion
  //#region cc-addon-backups
  'cc-addon-backups.close-btn': `Fermer ce panneau`,
  'cc-addon-backups.command-password': `Cette commande vous demandera votre mot de passe, le voici :`,
  'cc-addon-backups.delete': ({ createdAt }) => sanitize`Supprimer la sauvegarde du <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong>`,
  'cc-addon-backups.delete.btn': `supprimer...`,
  'cc-addon-backups.delete.manual.description.es-addon': ({ href }) => sanitize`Vous pouvez supprimer cette sauvegarde manuellement grâce à l'outil <a href="${href}">cURL</a> en exécutant cette commande :`,
  'cc-addon-backups.delete.manual.title': `Suppression manuelle`,
  'cc-addon-backups.delete.with-service.description.es-addon': ({ href }) => sanitize`Vous pouvez supprimer cette sauvegarde avec Kibana en vous rendant sur le <a href="${href}">dépôt de sauvegardes</a>.`,
  'cc-addon-backups.delete.with-service.title.es-addon': `Suppression avec Kibana`,
  'cc-addon-backups.description.es-addon': `Les sauvegardes sont gérées par Elasticsearch lui-même. Vous pouvez définir la rétention ainsi que la périodicité des sauvegardes dans l'interface de Kibana.`,
  'cc-addon-backups.description.es-addon-old': `Les sauvegardes sont gérées par Elasticsearch lui-même. La version de votre Elasticsearch ne permet pas de définir de politique de rétention. La suppression d'une sauvegarde se fait manuellement avec l'API d'Elasticsearch.`,
  'cc-addon-backups.description.jenkins': `Les sauvegardes sont réalisées en archivant les données contenues dans Jenkins.`,
  'cc-addon-backups.description.mongodb-addon': () => sanitize`Les sauvegardes sont réalisées en utilisant l'outil <a href="https://docs.mongodb.com/v4.0/reference/program/mongodump/">mongodump</a>.`,
  'cc-addon-backups.description.mysql-addon': () => sanitize`Les sauvegardes sont réalisées en utilisant l'outil <a href="https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html">mysqldump</a>.`,
  'cc-addon-backups.description.postgresql-addon': () => sanitize`Les sauvegardes sont réalisées en utilisant l'outil <a href="https://www.postgresql.org/docs/current/app-pgdump.html">pg_dump</a>.`,
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
  'cc-addon-backups.restore': ({ createdAt }) => sanitize`Restaurer la sauvegarde du <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong>`,
  'cc-addon-backups.restore.btn': `restaurer...`,
  'cc-addon-backups.restore.manual.description.es-addon': () => sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <a href="https://curl.se/docs/">cURL</a> en exécutant cette commande :`,
  'cc-addon-backups.restore.manual.description.jenkins': `La restauration de backups Jenkins doit passer par notre support. Veuillez créer un ticket en indiquant l'ID de votre add-on ainsi que la date du backup à restaurer et nous le ferons pour vous.`,
  'cc-addon-backups.restore.manual.description.mongodb-addon': () => sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <a href="https://docs.mongodb.com/v4.0/reference/program/mongorestore/">mongorestore</a> en exécutant cette commande :`,
  'cc-addon-backups.restore.manual.description.mysql-addon': () => sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à la CLI <a href="https://dev.mysql.com/doc/refman/8.0/en/mysql.html">mysql</a> en exécutant cette commande :`,
  'cc-addon-backups.restore.manual.description.postgresql-addon': () => sanitize`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <a href="https://www.postgresql.org/docs/current/app-pgrestore.html">pg_restore</a> en exécutant cette commande :`,
  'cc-addon-backups.restore.manual.description.redis-addon': `La restauration de backups Redis doit passer par notre support. Veuillez créer un ticket en indiquant l'ID de votre add-on ainsi que la date du backup à restaurer et nous le ferons pour vous.`,
  'cc-addon-backups.restore.manual.title': `Restauration manuelle`,
  'cc-addon-backups.restore.with-service.description.es-addon': ({ href }) => sanitize`Vous pouvez restaurer cette sauvegarde avec Kibana en vous rendant sur le <a href="${href}">dépôt de sauvegardes</a>.`,
  'cc-addon-backups.restore.with-service.title.es-addon': `Restauration avec Kibana`,
  'cc-addon-backups.text': ({ createdAt, expiresAt }) => {
    return sanitize`Sauvegarde du <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong> (expire le <strong>${formatDateOnly(lang, expiresAt)}</strong>)`;
  },
  'cc-addon-backups.text.user-defined-retention': ({ createdAt }) => sanitize`Sauvegarde du <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong> (expire après la durée de rétention définie)`,
  'cc-addon-backups.title': `Sauvegardes`,
  //#endregion
  //#region cc-addon-credentials
  'cc-addon-credentials.description.apm': `Utilisez ces identifiants pour connecter une instance d'APM Server à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.elasticsearch': `Utilisez ces identifiants pour vous connecter à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.kibana': `Utilisez ces identifiants pour connecter une instance de Kibana à votre cluster Elasticsearch.`,
  'cc-addon-credentials.description.pulsar': `Utilisez ces informations pour vous connecter à votre add-on Pulsar.`,
  'cc-addon-credentials.field.auth-token': `Token d'authentification`,
  'cc-addon-credentials.field.host': `Nom de domaine`,
  'cc-addon-credentials.field.password': `Mot de passe`,
  'cc-addon-credentials.field.url': `URL`,
  'cc-addon-credentials.field.user': `Utilisateur`,
  'cc-addon-credentials.loading-error': `Une erreur est survenue pendant le chargement des informations de connexion.`,
  'cc-addon-credentials.title': ({ name }) => `Identifiants ${name}`,
  //#endregion
  //#region cc-addon-elasticsearch-options
  'cc-addon-elasticsearch-options.description': () => sanitize`Cet add-on fait partie de l'offre Suite Elastic qui inclue deux options. Ces options sont déployées comme des applications et seront gérées et mises à jour par Clever Cloud. Elles apparaîtront donc comme des applications habituelles que vous pouvez arrêter, supprimer, scaler comme n'importe quelle autre application. <strong>Activer ces options augmentera votre consommation de crédits.</strong>`,
  'cc-addon-elasticsearch-options.description.apm': () => sanitize`Elastic APM est un serveur de monitoring de performance applicative pour la Suite Elastic. Déployer cette option permet d'envoyer automatiquement les métriques de toute application liée à cette instance d'add-on Elasticsearch, en supposant que vous utilisez bien l'agent Elastic APM dans les dépendances de vos applications. Retrouvez plus de détails dans <a href="https://www.elastic.co/guide/en/apm/get-started/current/overview.html">la documentation officielle de APM server</a>.`,
  'cc-addon-elasticsearch-options.description.kibana': () => sanitize`Kibana est l'interface d'administration de la Suite Elastic. Kibana vous permet de visualiser vos données Elasticsearch et de naviguer dans la Suite Elastic. Vous voulez effectuer le suivi de la charge de travail liée à la recherche ou comprendre le flux des requêtes dans vos applications ? Kibana est là pour ça. Retrouvez plus de détails dans <a href="https://www.elastic.co/guide/en/kibana/master/index.html">la documentation officielle de Kibana</a>.`,
  'cc-addon-elasticsearch-options.title': `Options pour la Suite Elastic`,
  'cc-addon-elasticsearch-options.warning.apm': `Si vous activez cette option, nous allons déployer et gérer pour vous un APM server, ce qui entraînera des coûts supplémentaires.`,
  'cc-addon-elasticsearch-options.warning.apm.details': (flavor) => sanitize`Par défaut, l'app sera démarrée sur une <strong title="${formatFlavor(flavor)}">instance ${flavor.name}</strong> qui coûte environ <strong>${formatCurrency(lang, flavor.monthlyCost)} par mois</strong>. `,
  'cc-addon-elasticsearch-options.warning.kibana': `Si vous activez cette option, nous allons déployer et gérer pour vous un Kibana, ce qui entraînera des coûts supplémentaires.`,
  'cc-addon-elasticsearch-options.warning.kibana.details': (flavor) => sanitize`Par défaut, l'app sera démarrée sur une <strong title="${formatFlavor(flavor)}">instance ${flavor.name}</strong> qui coûte environ <strong>${formatCurrency(lang, flavor.monthlyCost)} par mois</strong>.`,
  //#endregion
  //#region cc-addon-encryption-at-rest-option
  'cc-addon-encryption-at-rest-option.description': () => sanitize`Le chiffrement au repos chiffre l'intégralité du disque de données afin de ne pas y stocker d'informations en clair. Grâce à cette sécurité, l'accès physique au disque empêchera toute lecture des données stockées. Plus d'information dans notre <a href="https://www.clever-cloud.com/doc/administrate/encryption-at-rest/">documentation</a>.`,
  'cc-addon-encryption-at-rest-option.title': `Chiffrement au repos`,
  'cc-addon-encryption-at-rest-option.warning': ({ percent, price }) => {
    return sanitize`Cette option est actuellement gratuite. Dans le futur, elle sera facturée ${formatPercent(lang, percent)} du prix du plan, ce qui dans ce cas fait <strong>${formatCurrency(lang, price)} par mois.</strong>`;
  },
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
  //#region cc-article-card
  'cc-article-card.date': ({ date }) => formatDateOnly(lang, date),
  //#endregion
  //#region cc-article-list
  'cc-article-list.error': `Une erreur est survenue pendant le chargement des articles.`,
  //#endregion
  //#region cc-beta
  'cc-beta.label': `bêta`,
  //#endregion
  //#region cc-block
  'cc-block.toggle.close': `Fermer`,
  'cc-block.toggle.open': `Ouvrir`,
  //#endregion
  //#region cc-button
  'cc-button.cancel': `Cliquez pour annuler`,
  //#endregion
  //#region cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(lang, date),
  //#endregion
  //#region cc-doc-card
  'cc-doc-card.link': ({ link, product }) => sanitize(`<a href=${link} aria-label="Lire la documentation - ${product}">Lire la documentation</a>`),
  'cc-doc-card.skeleton-link-title': `Lire la documentation`,
  //#endregion
  //#region cc-doc-list
  'cc-doc-list.error': `Une erreur est survenue pendant le chargement de la documentation`,
  //#endregion
  //#region cc-elasticsearch-info
  'cc-elasticsearch-info.error': `Une erreur est survenue pendant le chargement des liens des add-on liés à cette application.`,
  'cc-elasticsearch-info.info': `Info`,
  'cc-elasticsearch-info.link.apm': `Ouvrir APM`,
  'cc-elasticsearch-info.link.doc': `Lire la documentation`,
  'cc-elasticsearch-info.link.elasticsearch': `Voir l'add-on Elasticsearch`,
  'cc-elasticsearch-info.link.kibana': `Ouvrir Kibana`,
  'cc-elasticsearch-info.text': `Cet add-on fait partie de l'offre Suite Elastic. Vous pouvez retrouver la documentation ainsi que les différents services liés ci-dessous.`,
  //#endregion
  //#region cc-env-var-create
  'cc-env-var-create.create-button': `Ajouter`,
  'cc-env-var-create.errors.already-defined-name': ({ name }) => sanitize`Le nom <code>${name}</code> est déjà défini`,
  'cc-env-var-create.errors.invalid-name': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'cc-env-var-create.info.java-prop': ({ name }) => sanitize`La variable <code>${name}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">plus de détails</a>`,
  'cc-env-var-create.name.label': `Nom de la variable`,
  'cc-env-var-create.value.label': `Valeur de la variable`,
  //#endregion
  //#region cc-env-var-editor-expert
  'cc-env-var-editor-expert.errors.duplicated-name': ({ name }) => sanitize`attention, le nom <code>${name}</code> est déjà défini`,
  'cc-env-var-editor-expert.errors.invalid-line': () => sanitize`cette ligne est invalide, le format correct est : <code>NOM="VALEUR"</code>`,
  'cc-env-var-editor-expert.errors.invalid-name': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'cc-env-var-editor-expert.errors.invalid-name-strict': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide en mode strict`,
  'cc-env-var-editor-expert.errors.invalid-value': () => sanitize`la valeur est invalide, si vous utilisez des guillements, vous devez les échapper comme ceci : <code>\\"</code> ou alors mettre toute la valeur entre guillemets.`,
  'cc-env-var-editor-expert.errors.line': `ligne`,
  'cc-env-var-editor-expert.errors.unknown': `Erreur inconnue`,
  'cc-env-var-editor-expert.example': () => sanitize`Format : <code>NOM_DE_LA_VARIABLE="valeur de la variable"</code> <br> Chaque variable doit être séparée par des sauts de ligne, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#format">en savoir plus</a>.`,
  'cc-env-var-editor-expert.info.java-prop': ({ name }) => sanitize`La variable <code>${name}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">plus de détails</a>`,
  'cc-env-var-editor-expert.label': () => sanitize`Edition des variables. Format : <code>NOM_DE_LA_VARIABLE="valeur de la variable"</code> <br> Chaque variable doit être séparée par des sauts de ligne`,
  //#endregion
  //#region cc-env-var-editor-json
  'cc-env-var-editor-json.errors.duplicated-name': ({ name }) => sanitize`attention, le nom <code>${name}</code> est déjà défini`,
  'cc-env-var-editor-json.errors.invalid-json': `Le JSON entré est invalide.`,
  'cc-env-var-editor-json.errors.invalid-json-entry': `Le JSON entré est un tableau d'objets JSON valide mais toutes les valeurs des propriétés doivent être de type string. Ex : '[{ "name": "THE_NAME", "value": "the value" }]'`,
  'cc-env-var-editor-json.errors.invalid-json-format': `Le JSON entré est valide mais n'est pas au bon format. Le JSON doit être un tableau d'objets`,
  'cc-env-var-editor-json.errors.invalid-name': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide`,
  'cc-env-var-editor-json.errors.invalid-name-strict': ({ name }) => sanitize`Le nom <code>${name}</code> n'est pas valide en mode strict`,
  'cc-env-var-editor-json.errors.unknown': `Erreur inconnue`,
  'cc-env-var-editor-json.example': () => sanitize`Format : <code>{ "name": "NOM_DE_LA_VARIABLE", "value": "valeur de la variable" }</code> <br> Tableau d'objets respectant le format ci-dessus, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#format">en savoir plus</a>.`,
  'cc-env-var-editor-json.info.java-prop': ({ name }) => sanitize`La variable <code>${name}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">plus de détails</a>`,
  'cc-env-var-editor-json.label': () => sanitize`Edition des variables. Format : <code>{ "name": "NOM_DE_LA_VARIABLE", "value": "valeur de la variable" }</code> <br> Tableau d'objets respectant le format ci-dessus,`,
  //#endregion
  //#region cc-env-var-editor-simple
  'cc-env-var-editor-simple.empty-data': `Il n'y a pas de variable.`,
  //#endregion
  //#region cc-env-var-form
  'cc-env-var-form.description.config-provider': ({ addonName }) => sanitize`Configuration publiée pour les applications dépendantes. <a href="https://www.clever-cloud.com/doc/deploy/addon/config-provider/">En savoir plus</a><br>Ces seront injectées en tant que variables d'environnement dans les applications qui ont l'add-on <strong>${addonName}</strong> dans leurs services liés.<br>À chaque fois que vous mettez à jour les changements, toutes les applications dépendantes seront redémarrées automatiquement.`,
  'cc-env-var-form.description.env-var': ({ appName }) => sanitize`Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${appName}</strong>. <a href="https://doc.clever-cloud.com/admin-console/environment-variables/">En savoir plus</a>`,
  'cc-env-var-form.description.exposed-config': ({ appName }) => sanitize`Configuration publiée pour les applications dépendantes. <a href="https://www.clever-cloud.com/doc/admin-console/service-dependencies/">En savoir plus</a><br>Ces variables ne seront pas injectées dans l'application <strong>${appName}</strong>, elles seront injectées en tant que variables d'environnement dans les applications qui ont <strong>${appName}</strong> dans leurs services liés.`,
  'cc-env-var-form.error.loading': `Une erreur est survenue pendant le chargement des variables.`,
  'cc-env-var-form.heading.config-provider': `Variables`,
  'cc-env-var-form.heading.env-var': `Variables d'environnement`,
  'cc-env-var-form.heading.exposed-config': `Configuration publiée`,
  'cc-env-var-form.mode.expert': `Expert`,
  'cc-env-var-form.mode.simple': `Simple`,
  'cc-env-var-form.reset': `Annuler les changements`,
  'cc-env-var-form.restart-app': `Redémarrer l'app pour appliquer les changements`,
  'cc-env-var-form.update': `Mettre à jour les changements`,
  'cc-env-var-form.update.error': `Une erreur est survenue pendant la mise à jour des variables.`,
  'cc-env-var-form.update.success': `Les variables ont été mises à jour avec succès.`,
  //#endregion
  //#region cc-env-var-input
  'cc-env-var-input.delete-button': `Enlever`,
  'cc-env-var-input.keep-button': `Garder`,
  'cc-env-var-input.value-label': ({ variableName }) => `valeur de la variable ${variableName}`,
  'cc-env-var-input.value-placeholder': `valeur de la variable`,
  //#endregion
  //#region cc-env-var-linked-services
  'cc-env-var-linked-services.description.addon': ({ serviceName, appName }) => {
    return sanitize`Liste des variables exposées par l'add-on <strong>${serviceName}</strong>.<br>Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${appName}</strong>.`;
  },
  'cc-env-var-linked-services.description.app': ({ serviceName, appName }) => {
    return sanitize`Configuration publiée par l'application <strong>${serviceName}</strong>.<br>Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${appName}</strong>.`;
  },
  'cc-env-var-linked-services.empty.addon': ({ appName }) => sanitize`Aucun add-on lié à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.empty.app': ({ appName }) => sanitize`Aucune application liée à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.addon': ({ appName }) => sanitize`Une erreur est survenue pendant le chargement des add-ons liés à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.app': ({ appName }) => sanitize`Une erreur est survenue pendant le chargement des applications liées à <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.heading.addon': ({ name }) => `Add-on : ${name}`,
  'cc-env-var-linked-services.heading.app': ({ name }) => `Application : ${name}`,
  'cc-env-var-linked-services.loading.addon': ({ appName }) => sanitize`Chargement des variables exposées par les add-ons liés à <strong>${appName}</strong>...`,
  'cc-env-var-linked-services.loading.app': ({ appName }) => sanitize`Chargement de la configuration publiée par les applications liées à <strong>${appName}</strong>...`,
  //#endregion
  //#region cc-error
  'cc-error.ok': `OK`,
  //#endregion
  //#region cc-grafana-info
  'cc-grafana-info.disable-description': `Désactiver Grafana supprimera et mettra fin aux accès à l'organisation du Grafana. Vous pourrez toujours recréer une nouvelle organisation Grafana.`,
  'cc-grafana-info.disable-title': `Désactiver Grafana`,
  'cc-grafana-info.disable.error': `Une erreur s'est produite lors de la désactivation des tableaux de bord du Grafana.`,
  'cc-grafana-info.disable.success': `Les tableaux de bords du Grafana ont été désactivés avec succès.`,
  'cc-grafana-info.documentation-description': `Ce service est utilisé pour visualiser nos métriques. Vous pouvez trouver la documentation et les détails de ces métriques ici.`,
  'cc-grafana-info.documentation-title': `Documentation`,
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
  'cc-grafana-info.main-title': `Métriques dans Grafana`,
  'cc-grafana-info.reset-description': `Réinitialisez tous les tableaux de bord Clever Cloud à leur état initial.`,
  'cc-grafana-info.reset-title': `Réinitialiser tous les tableaux de bord`,
  'cc-grafana-info.reset.error': `Une erreur s'est produite lors de la réinitialisation des tableaux de bord du Grafana.`,
  'cc-grafana-info.reset.success': `Les tableaux de bords du grafana ont été réinitialisés avec succès.`,
  'cc-grafana-info.screenshot.addon.alt': `Capture d'écran d'un tableau de bord d'add-on dans Grafana`,
  'cc-grafana-info.screenshot.addon.description': () => sanitize`Ce tableau de bord comprend plusieurs graphiques à propos d'un add-on. <br> Il fournit d'abord un panneau de présentation contenant les métriques système telles que <strong> le processeur, la mémoire, les disques et le réseau</strong>. <br> Pour les add-ons <strong>MySQL, PostgreSQL, MongoDB et Redis</strong>, un second panneau présente la base de données et des informations comme <strong>le nombre de connexions, de requêtes ou de transactions, d'erreurs ou de blocages ou encore d'opérations "tuples"<strong>.`,
  'cc-grafana-info.screenshot.addon.title': `Aperçu du tableau de bord d'add-on`,
  'cc-grafana-info.screenshot.organisation.alt': `Capture d'écran d'un tableau de bord d'organisation dans Grafana`,
  'cc-grafana-info.screenshot.organisation.description': () => sanitize`Ce tableau de bord comprend plusieurs graphiques pour une organisation Clever Cloud. <br> Il fournit un graphique résumant le nombre d'<strong>applications (runtimes) et d'add-ons déployés</strong>. Il contient également le nombre de services <strong>par type</strong> ou <strong>par plan (flavor)</strong>. <br> Le <strong>graphique d'état</strong> affiche un état pour tous les déploiements effectués durant la plage de temps de Grafana. <br> Et enfin, il est possible de récupérerer des <strong>liens globaux et spécifiques</strong> (triés par nombre de requêtes) pour accéder au tableau de bord d'une application (runtime) ou d'un add-on.`,
  'cc-grafana-info.screenshot.organisation.title': `Aperçu du tableau de bord d'organisation`,
  'cc-grafana-info.screenshot.runtime.alt': `Capture d'écran d'un tableau de bord d'application (runtime) dans Grafana`,
  'cc-grafana-info.screenshot.runtime.description': () => sanitize`Ce tableau de bord comprend un <strong>panneau de présentation</strong> pour obtenir des informations rapides sur une application, ainsi que plusieurs panneaux présentant leurs métriques système. <br> Il fournit un graphique reprenant l'état <strong>du processeur, de la mémoire, des disques et du réseau</strong>. <br> Pour chaque groupe de métriques, le panneau contient des graphes d'utilisation, des jauges ou encore un indicateur de remplissage (basé sur le résultat d'une prédiction linéaire effectuée sur les données de l'intervalle de temps fixé dans Grafana). Cet indicateur donne la durée attendue avant que les métriques ne dépassent 90%.`,
  'cc-grafana-info.screenshot.runtime.title': `Aperçu du tableau de bord d'application (runtime)`,
  //#endregion
  //#region cc-header-addon
  'cc-header-addon.creation-date': `Date de création`,
  'cc-header-addon.creation-date.full': ({ date }) => formatDate(lang, date),
  'cc-header-addon.creation-date.short': ({ date }) => formatDateOnly(lang, date),
  'cc-header-addon.error': `Une erreur est survenue pendant le chargement des informations de l'add-on.`,
  'cc-header-addon.id-label': `Identifiant de l'add-on`,
  'cc-header-addon.id-label-alternative': () => sanitize`Identifiant alternatif de l'add-on (<span lang="en">real id</span>)`,
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
  'cc-header-app.commits.git': ({ commit }) => `version du dépôt git (HEAD) : ${commit}`,
  'cc-header-app.commits.no-commits': `pas encore de commit`,
  'cc-header-app.commits.running': ({ commit }) => `version en ligne : ${commit}`,
  'cc-header-app.commits.starting': ({ commit }) => `version en cours de déploiement : ${commit}`,
  'cc-header-app.disable-buttons': `Vous n'êtes pas autorisé à réaliser ces actions`,
  'cc-header-app.error': `Une erreur est survenue pendant le chargement des informations de l'application.`,
  'cc-header-app.read-logs': `voir les logs`,
  'cc-header-app.state-msg.app-is-restarting': `L'application redémarre...`,
  'cc-header-app.state-msg.app-is-running': `Votre application est disponible !`,
  'cc-header-app.state-msg.app-is-starting': `L'application démarre...`,
  'cc-header-app.state-msg.app-is-stopped': `L'application est arrêtée.`,
  'cc-header-app.state-msg.last-deploy-failed': `Le dernier déploiement a échoué,`,
  'cc-header-app.state-msg.unknown-state': `État inconnu, essayez de redémarrer l'application ou de contacter notre support si vous avez des questions.`,
  'cc-header-app.user-action-msg.app-will-start': `L'application va bientôt démarrer...`,
  'cc-header-app.user-action-msg.app-will-stop': `L'application va s'arrêter...`,
  'cc-header-app.user-action-msg.deploy-cancelled': `Ce déploiement a été annulé.`,
  'cc-header-app.user-action-msg.deploy-will-begin': `Un déploiement va bientôt commencer...`,
  //#endregion
  //#region cc-header-orga
  'cc-header-orga.error': `Une erreur est survenue pendant le chargement des informations de l'organisation.`,
  'cc-header-orga.hotline': `Numéro d'urgence :`,
  //#endregion
  //#region cc-heptapod-info
  'cc-heptapod-info.description': () => sanitize`Cette instance Heptapod héberge des dépôts Mercurial. Plus d'informations sur <a href="https://about.heptapod.host">https://about.heptapod.host</a>.`,
  'cc-heptapod-info.error-loading': `Une erreur est survenue pendant le chargement des informations d'utilisation.`,
  'cc-heptapod-info.not-in-use': `Vous n'utilisez pas ce service Heptapod.`,
  'cc-heptapod-info.price-description': `Prix estimé`,
  'cc-heptapod-info.price-value': ({ price }) => `${formatCurrency(lang, price)} / mois`,
  'cc-heptapod-info.private-active-users-description': `Utilisateurs privés`,
  'cc-heptapod-info.public-active-users-description': `Utilisateurs publics`,
  'cc-heptapod-info.storage-bytes': ({ storage }) => formatBytes(storage, 1),
  'cc-heptapod-info.storage-description': `Stockage utilisé`,
  //#endregion
  //#region cc-input-number
  'cc-input-number.decrease': `décrémenter`,
  'cc-input-number.increase': `incrémenter`,
  'cc-input-number.required': `obligatoire`,
  //#endregion
  //#region cc-input-text
  'cc-input-text.clipboard': `Copier dans le presse-papier`,
  'cc-input-text.required': `obligatoire`,
  'cc-input-text.secret.hide': `Cacher le secret`,
  'cc-input-text.secret.show': `Afficher le secret`,
  //#endregion
  //#region cc-invoice
  'cc-invoice.download-pdf': `Télécharger le PDF`,
  'cc-invoice.error': `Une erreur est survenue pendant le chargement de la facture.`,
  'cc-invoice.info': ({ date, amount }) => {
    return sanitize`Cette facture a été émise le <strong>${formatDateOnly(lang, date)}</strong> pour un total de <strong>${formatCurrency(lang, amount)}</strong>.`;
  },
  'cc-invoice.title': `Facture`,
  //#endregion
  //#region cc-invoice-list
  'cc-invoice-list.error': `Une erreur est survenue pendant le chargement des factures.`,
  'cc-invoice-list.pending': `Factures en attente de paiement`,
  'cc-invoice-list.pending.no-invoices': `Il n'y a aucune facture en attente de paiement pour le moment.`,
  'cc-invoice-list.processed': `Factures réglées`,
  'cc-invoice-list.processed.no-invoices': `Il n'y a aucune facture réglée pour le moment.`,
  'cc-invoice-list.processing': `Factures dont le paiement est en cours de validation`,
  'cc-invoice-list.title': `Factures`,
  'cc-invoice-list.year': `Année :`,
  //#endregion
  //#region cc-invoice-table
  'cc-invoice-table.date.emission': `Date d'émission`,
  'cc-invoice-table.date.value': ({ date }) => `${formatDateOnly(lang, date)}`,
  'cc-invoice-table.number': `Numéro`,
  'cc-invoice-table.open-pdf': `Télécharger le PDF`,
  'cc-invoice-table.pay': `Régler`,
  'cc-invoice-table.text': ({
    number, date, amount,
  }) => sanitize`Facture <strong>${number}</strong> émise le <strong>${formatDateOnly(lang, date)}</strong> pour un total de <code>${formatCurrency(lang, amount)}</code>`,
  'cc-invoice-table.total.label': `Total`,
  'cc-invoice-table.total.value': ({ amount }) => `${formatCurrency(lang, amount)}`,
  //#endregion
  //#region cc-jenkins-info
  'cc-jenkins-info.documentation.link': `Consulter la documentation`,
  'cc-jenkins-info.documentation.text': `Notre documentation peut vous accompagner pour commencer à utiliser Jenkins ainsi qu'à créer des jobs qui s'exécutent dans des runners Docker sur Clever Cloud.`,
  'cc-jenkins-info.documentation.title': `Documentation`,
  'cc-jenkins-info.error': `Une erreur est survenue pendant le chargement des informations liées à cet add-on.`,
  'cc-jenkins-info.info': `Info`,
  'cc-jenkins-info.open-jenkins.link': `Accéder à Jenkins`,
  'cc-jenkins-info.open-jenkins.text': `Accédez à Jenkins de manière authentifiée via le SSO (Single Sign-On) Clever Cloud. Les différents membres de l'organisation peuvent accéder au service Jenkins.`,
  'cc-jenkins-info.open-jenkins.title': `Accéder à Jenkins`,
  'cc-jenkins-info.text': `Cet add-on fait partie de l'offre Jenkins. Vous pouvez retrouver la documentation ainsi que différentes informations ci-dessous.`,
  'cc-jenkins-info.update.new-version': ({ version }) => `La version ${version} de Jenkins est disponible !`,
  'cc-jenkins-info.update.text': `Jenkins et ses plugins reçoivent régulièrement des mises à jour. Vous pouvez mettre à jour automatiquement votre instance ainsi que ses plugins à travers l'interface Jenkins.`,
  'cc-jenkins-info.update.title': `Mises à jour`,
  'cc-jenkins-info.update.up-to-date': `Votre version de Jenkins est à jour.`,
  //#endregion
  //#region cc-logsmap
  'cc-logsmap.legend.heatmap': ({ orgaName }) => sanitize`Carte de chaleur des requêtes HTTP reçues par les applications de <strong>${orgaName}</strong> durant les dernières 24 heures.`,
  'cc-logsmap.legend.heatmap.app': ({ appName }) => sanitize`Carte de chaleur des requêtes HTTP reçues par l'application <strong>${appName}</strong> durant les dernières 24 heures.`,
  'cc-logsmap.legend.points': ({ orgaName }) => sanitize`Carte temps réel des requêtes HTTP reçues par toutes les applications de <strong>${orgaName}</strong>.`,
  'cc-logsmap.legend.points.app': ({ appName }) => sanitize`Carte temps réel des requêtes HTTP reçues par l'application <strong>${appName}</strong>.`,
  'cc-logsmap.mode.heatmap': `Dernières 24h`,
  'cc-logsmap.mode.points': `En direct`,
  //#endregion
  //#region cc-map
  'cc-map.error': `Une erreur est survenue pendant le chargement des données de la carte.`,
  'cc-map.no-points': `Pas de données à afficher sur la carte en ce moment.`,
  //#endregion
  //#region cc-matomo-info
  'cc-matomo-info.about.text': () => sanitize`
    <p>L'add-on Matomo inclut des dépendances indispensables à son bon fonctionnement. Il est accompagné d'une application <strong>PHP</strong>, d'un add-on <strong>MySQL</strong> et d'un add-on <strong>Redis</strong>.</p>
    <p>Ces dépendances sont affichées dans votre organisation comme n'importe quelle autre application ou add-on. Vous pouvez les configurer comme bon vous semble. Vous pouvez modifier le domaine de l'application PHP ou encore migrer le MySQL vers un plus gros plan.</p>
    <p>Cet add-on est gratuit, mais ses dépendances sont facturées en fonction de leur consommation.</p>
  `,
  'cc-matomo-info.about.title': `À propos`,
  'cc-matomo-info.documentation.link': `Accéder à la documentation`,
  'cc-matomo-info.documentation.text': `Consultez notre documentation pour en apprendre plus sur l'utilisation ou la configuration de votre Matomo et de ses dépendances.`,
  'cc-matomo-info.documentation.title': `Documentation`,
  'cc-matomo-info.error': `An error occured while fetching the information about this add-on.`,
  'cc-matomo-info.heading': `Cet add-on Matomo inclut toutes les dépendances nécessaires à son bon fonctionnement.`,
  'cc-matomo-info.info': `Info`,
  'cc-matomo-info.link.mysql': `Accéder à l'add-on MySQL`,
  'cc-matomo-info.link.php': `Accéder à l'application PHP`,
  'cc-matomo-info.link.redis': `Accéder à l'add-on Redis`,
  'cc-matomo-info.open-matomo.link': `Accéder à Matomo`,
  'cc-matomo-info.open-matomo.text': `Vous pouvez accéder à votre Matomo en utilisant votre compte Clever Cloud. Tous les membres de l'organisation peuvent également accéder au service grâce à leur propre compte.`,
  'cc-matomo-info.open-matomo.title': `Accéder à Matomo`,
  //#endregion
  //#region cc-payment-warning
  'cc-payment-warning.billing-page-link': ({ orgaName, orgaBillingLink }) => sanitize`<a href="${orgaBillingLink}" aria-label="Se rendre sur la page de facturation - ${orgaName}">Se rendre sur la page de facturation</a>`,
  'cc-payment-warning.generic.default-payment-method-is-expired': ({ orgaName }) => sanitize`<strong>${orgaName}</strong> a un moyen de paiement enregistré mais il est expiré.`,
  'cc-payment-warning.generic.no-default-payment-method': ({ orgaName }) => sanitize`<strong>${orgaName}</strong> a des moyens de payments enregistrés mais aucun d'entre eux n'est défini par défaut.`,
  'cc-payment-warning.generic.no-payment-method': ({ orgaName }) => sanitize`<strong>${orgaName}</strong> n'a aucun moyen de paiement enregistré.`,
  'cc-payment-warning.home': ({ orgaCount }) => {
    const organisation = plural(orgaCount, 'à l\'organisation suivante', 'aux organisations suivantes');
    return sanitize`<strong>Attention ! Quelque chose pose problème avec vos moyens de paiement.</strong><br>Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci de vérifier les informations de facturation liées ${organisation} :`;
  },
  'cc-payment-warning.orga.default-payment-method-is-expired': () => sanitize`<strong>Attention ! Votre moyen de paiement est expiré.</strong><br>Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci d'ajouter un moyen de paiement valide et de le définir par défaut.`,
  'cc-payment-warning.orga.no-default-payment-method': () => sanitize`<strong>Attention ! Vous avez des moyens de payments enregistrés, mais aucun d'entre eux n'est défini par défaut.</strong><br>Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci de définir un de vos moyen de paiement par défaut.`,
  'cc-payment-warning.orga.no-payment-method': () => sanitize`<strong>Attention ! Vous n'avez aucun moyen de paiement enregistré.</strong><br>Pour éviter tout risque de suspension de vos services et de suppression de vos données, merci d'ajouter un moyen de paiement valide et de le définir par défaut.`,
  //#endregion
  //#region cc-pricing-estimation
  'cc-pricing-estimation.delete': `Supprimer le produit`,
  'cc-pricing-estimation.empty-list': `Ajoutez des produits et services pour modéliser une estimation.`,
  'cc-pricing-estimation.monthly-est': `Total Estimé (30 jours)`,
  'cc-pricing-estimation.plan': `Plan :`,
  'cc-pricing-estimation.price': ({ price, code }) => `${formatCurrency(lang, price, { currency: code })}`,
  'cc-pricing-estimation.price-name-daily': `Prix (jour)`,
  'cc-pricing-estimation.price-name-monthly': () => sanitize`Prix (30&nbsp;jours)`,
  'cc-pricing-estimation.product': `Produit`,
  'cc-pricing-estimation.quantity': `Quantité`,
  'cc-pricing-estimation.sales': `Nous contacter`,
  'cc-pricing-estimation.sign-up': `S'inscrire`,
  //#endregion
  //#region cc-pricing-header
  'cc-pricing-header.currency-text': `Devise : `,
  'cc-pricing-header.est-cost': `Total Estimé : `,
  'cc-pricing-header.price': ({ price, code }) => `${formatCurrency(lang, price, { currency: code })}`,
  'cc-pricing-header.selected-zone': `Zone : `,
  //#endregion
  //#region cc-pricing-product
  'cc-pricing-product.error': `Une erreur est survenue pendant le chargement des prix.`,
  //#endregion
  //#region cc-pricing-product-consumption
  'cc-pricing-product-consumption.add': `Ajouter`,
  'cc-pricing-product-consumption.bytes': ({ bytes }) => formatBytesSi(bytes),
  'cc-pricing-product-consumption.bytes-unit': ({ bytes }) => getUnit(bytes),
  'cc-pricing-product-consumption.error': `Une erreur est survenue pendant le chargement des prix.`,
  'cc-pricing-product-consumption.inbound-traffic.label': `trafic entrant`,
  'cc-pricing-product-consumption.inbound-traffic.title': `Trafic entrant :`,
  'cc-pricing-product-consumption.number': ({ number }) => formatNumber(lang, number),
  'cc-pricing-product-consumption.outbound-traffic.label': `trafic sortant`,
  'cc-pricing-product-consumption.outbound-traffic.title': `Trafic sortant :`,
  'cc-pricing-product-consumption.price': ({ price, code }) => `${formatCurrency(lang, price, { currency: code })}`,
  'cc-pricing-product-consumption.price-interval.bytes': ({ price, code }) => {
    const priceInterval = formatCurrency(lang, price, {
      minimumFractionDigits: 3, maximumFractionDigits: 3, currency: code,
    });
    const priceOneGigabyte = getUnit(1e9);
    return `${priceInterval} / ${priceOneGigabyte} (30 jours)`;
  },
  'cc-pricing-product-consumption.price-interval.free': `GRATUIT`,
  'cc-pricing-product-consumption.price-interval.users': ({ userCount, price, code }) => {
    const users = plural(userCount, 'utilisateur');
    const priceInterval = formatCurrency(lang, price * userCount, { currency: code });
    return `${priceInterval} / ${userCount} ${users} (30 jours)`;
  },
  'cc-pricing-product-consumption.private-users.label': `utilisateurs privés`,
  'cc-pricing-product-consumption.private-users.title': `Utilisateurs privés :`,
  'cc-pricing-product-consumption.public-users.label': `utilisateurs publics`,
  'cc-pricing-product-consumption.public-users.title': `Utilisateurs publics :`,
  'cc-pricing-product-consumption.quantity': `Quantité`,
  'cc-pricing-product-consumption.size': ({ bytes }) => `Taille en ${getUnit(bytes)}`,
  'cc-pricing-product-consumption.storage.label': `stockage`,
  'cc-pricing-product-consumption.storage.title': `Stockage :`,
  'cc-pricing-product-consumption.subtotal.title': `Sous-total (30 jours) :`,
  'cc-pricing-product-consumption.toggle-btn.label': `Afficher plus de details`,
  'cc-pricing-product-consumption.total.title': `Total estimé (30 jours) :`,
  //#endregion
  //#region cc-pricing-table
  'cc-pricing-table.add-button': `Ajouter le produit à l'estimation`,
  'cc-pricing-table.feature.connection-limit': `Limite de connexions`,
  'cc-pricing-table.feature.cpu': `vCPUs`,
  'cc-pricing-table.feature.databases': `Bases de données`,
  'cc-pricing-table.feature.disk-size': `Taille du disque`,
  'cc-pricing-table.feature.gpu': `GPUs`,
  'cc-pricing-table.feature.has-logs': `Logs`,
  'cc-pricing-table.feature.has-metrics': `Métriques`,
  'cc-pricing-table.feature.max-db-size': `Taille BDD max`,
  'cc-pricing-table.feature.memory': `RAM`,
  'cc-pricing-table.feature.toggle': `Basculer l'affichage`,
  'cc-pricing-table.feature.version': `Version`,
  'cc-pricing-table.plan': `Plan`,
  'cc-pricing-table.price': ({ price, code, digits }) => formatCurrency(lang, price, {
    currency: code,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }),
  'cc-pricing-table.price-name.1000-minutes': `Prix (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-table.price-name.30-days': () => sanitize`Prix (30&nbsp;jours)`,
  'cc-pricing-table.price-name.day': `Prix (jour)`,
  'cc-pricing-table.price-name.hour': `Prix (heure)`,
  'cc-pricing-table.price-name.minute': `Prix (minute)`,
  'cc-pricing-table.price-name.second': `Prix (seconde)`,
  'cc-pricing-table.type.boolean': ({ boolean }) => `${boolean ? 'Oui' : 'Non'}`,
  'cc-pricing-table.type.boolean-shared': ({ shared }) => `${shared ? 'Partagé' : 'Dédié'}`,
  'cc-pricing-table.type.bytes': ({ bytes }) => formatBytes(bytes, 0, 3),
  'cc-pricing-table.type.number': ({ number }) => formatNumber(lang, number),
  'cc-pricing-table.type.number-cpu-runtime': ({ cpu, shared }) => {
    return shared
      ? sanitize`<em title="Accès au vCPU moins prioritaire">${formatNumber(lang, cpu)}<code>*</code></em>`
      : formatNumber(lang, cpu);
  },
  //#endregion
  //#region cc-select
  'cc-select.required': `obligatoire`,
  //#endregion
  //#region cc-ssh-key-list
  'cc-ssh-key-list.add.btn': `Ajouter la clé`,
  'cc-ssh-key-list.add.info': () => sanitize`<p>Vous devez associer une clé SSH à votre compte si vous désirez déployer via Git. Utilisez ce formulaire à cet effet.</p><p>Vous pouvez créer une clé SSH avec la commande suivante&nbsp;:</p><code>ssh-keygen -t ed25519 -C "my-email@example.com"</code><p>La clé publique générée est sauvegardée dans le fichier "*.pub".</p>`,
  'cc-ssh-key-list.add.name': `Nom`,
  'cc-ssh-key-list.add.public-key': `Clé publique`,
  'cc-ssh-key-list.add.title': `Ajouter une nouvelle clé`,
  'cc-ssh-key-list.doc.info': () => sanitize`Pour plus d'aide, vous pouvez consulter notre <a href="https://www.clever-cloud.com/doc/admin-console/ssh-keys/">documentation (en anglais)</a>.`,
  'cc-ssh-key-list.error.add': ({ name }) => `Une erreur est survenue pendant l'ajout de votre nouvelle clé personnelle "${name}".`,
  'cc-ssh-key-list.error.delete': ({ name }) => `Une erreur est survenue pendant la suppression de votre clé personnelle "${name}".`,
  'cc-ssh-key-list.error.import': ({ name }) => `Une erreur est survenue pendant l'import de votre clé personnelle "${name}".`,
  'cc-ssh-key-list.error.loading': `Une erreur est survenue pendant le chargement de vos clés.`,
  'cc-ssh-key-list.error.private-key': () => sanitize`Format incorrect&nbsp;: avez-vous saisi votre clé privée au lieu de votre clé publique&nbsp;?`,
  'cc-ssh-key-list.error.required.name': `Saisissez un nom pour votre clé SSH`,
  'cc-ssh-key-list.error.required.public-key': `Saisissez la valeur de votre clé publique`,
  'cc-ssh-key-list.github.empty': `Il n'y a aucune clé SSH disponible à l'import depuis votre compte GitHub.`,
  'cc-ssh-key-list.github.import': `Importer`,
  'cc-ssh-key-list.github.import.a11y': ({ name }) => `Importer la clé SSH GitHub - ${name}`,
  'cc-ssh-key-list.github.info': () => sanitize`<p>Voici les clés provenant de votre compte GitHub. Vous pouvez les importer pour les associer à votre compte Clever Cloud.</p>`,
  'cc-ssh-key-list.github.title': `Clés GitHub`,
  'cc-ssh-key-list.github.unlinked': () => sanitize`Il n'y a pas de compte GitHub lié à votre compte Clever Cloud. Vous pouvez lier vos comptes depuis votre <a href="./information">profil</a>`,
  'cc-ssh-key-list.personal.delete': `Supprimer`,
  'cc-ssh-key-list.personal.delete.a11y': ({ name }) => `Supprimer votre clé SSH personnelle - ${name}`,
  'cc-ssh-key-list.personal.empty': `Il n'y a aucune clé SSH associée à votre compte.`,
  'cc-ssh-key-list.personal.info': () => sanitize`<p>Voici la liste des clés SSH associées à votre compte.</p><p>Si vous souhaitez vérifier qu'une clé est déjà associée, vous pouvez lister les empreintes de vos clés locales avec la commande suivante&nbsp;:</p><code>ssh-add -l -E sha256</code>`,
  'cc-ssh-key-list.personal.title': `Vos clés`,
  'cc-ssh-key-list.success.add': ({ name }) => sanitize`Votre clé <strong>${name}</strong> a été ajoutée avec succès.`,
  'cc-ssh-key-list.success.delete': ({ name }) => sanitize`Votre clé <strong>${name}</strong> a été supprimée avec succès.`,
  'cc-ssh-key-list.success.import': ({ name }) => sanitize`Votre clé <strong>${name}</strong> a été importée avec succès.`,
  'cc-ssh-key-list.title': `Clés SSH`,
  //#endregion
  //#region cc-tcp-redirection
  'cc-tcp-redirection.create-button': `Créer`,
  'cc-tcp-redirection.delete-button': `Supprimer`,
  'cc-tcp-redirection.namespace-additionaldescription-cleverapps': () => sanitize`Cet espace de nommage est utilisé par tous les noms de domaine <em>cleverapps.io</em> (p. ex. <em>mon-application.cleverapps.io</em>).`,
  'cc-tcp-redirection.namespace-additionaldescription-default': () => sanitize`Cet espace de nommage est utilisé par tous les noms de domaine personnalisés (p. ex. <em>mon-application.fr</em>).`,
  'cc-tcp-redirection.namespace-private': `Cet espace de nommage vous est dédié.`,
  'cc-tcp-redirection.redirection-defined': ({ namespace, sourcePort }) => {
    return sanitize`Cette application a une redirection du port <code>${sourcePort}</code> vers le port <code>4040</code> dans l'espace de nommage <strong>${namespace}</strong>.`;
  },
  'cc-tcp-redirection.redirection-not-defined': ({ namespace }) => sanitize`Vous pouvez créer une redirection dans l'espace de nommage <strong>${namespace}</strong>.`,
  //#endregion
  //#region cc-tcp-redirection-form
  'cc-tcp-redirection-form.create.error': ({ namespace }) => {
    return sanitize`Une erreur est survenue pendant la création d'une redirection TCP dans l'espace de nommage <strong>${namespace}</strong>.`;
  },
  'cc-tcp-redirection-form.create.success': ({ namespace }) => {
    return sanitize`La redirection TCP dans l'espace de nommage <strong>${namespace}</strong> a été créée avec succès.`;
  },
  'cc-tcp-redirection-form.delete.error': ({ namespace }) => {
    return sanitize`Une erreur est survenue pendant la suppression de la redirection TCP dans l'espace de nommage <strong>${namespace}</strong>.`;
  },
  'cc-tcp-redirection-form.delete.success': ({ namespace }) => {
    return sanitize`La redirection TCP dans l'espace de nommage <strong>${namespace}</strong> a été supprimée avec succès.`;
  },
  'cc-tcp-redirection-form.description': () => sanitize`
    <p>
      Une redirection TCP permet d'obtenir un accès au port <code>4040</code> de l'application.<br>
      Vous pouvez créer une redirection TCP par application sur chaque espace de nommage auquel vous avez accès.
    </p>
    <p>
      Un espace de nommage correspond à un groupe de frontaux : public, cleverapps.io, ou encore dédiés dans le cadre de Clever Cloud Premium.<br>
      Retrouvez plus de détails sur la <a href="https://www.clever-cloud.com/doc/administrate/tcp-redirections/">page de documentation des redirections TCP</a>.
    </p>
  `,
  'cc-tcp-redirection-form.empty': `Vous n'avez accès à aucun espace de nommage.`,
  'cc-tcp-redirection-form.error': `Une erreur est survenue pendant le chargement des redirections TCP.`,
  'cc-tcp-redirection-form.title': `Redirections TCP`,
  //#endregion
  //#region cc-tile-consumption
  'cc-tile-consumption.amount': ({ amount }) => formatCurrency(lang, amount),
  'cc-tile-consumption.error': `Une erreur est survenue pendant le chargement de la consommation.`,
  'cc-tile-consumption.last-30-days': `30 derniers jours`,
  'cc-tile-consumption.title': `Consommation de crédits`,
  'cc-tile-consumption.yesterday': `Hier`,
  //#endregion
  //#region cc-tile-deployments
  'cc-tile-deployments.empty': `Pas encore de déploiement.`,
  'cc-tile-deployments.error': `Une erreur est survenue pendant le chargement des déploiements.`,
  'cc-tile-deployments.state.cancelled': `Annulé`,
  'cc-tile-deployments.state.failed': `Échoué`,
  'cc-tile-deployments.state.started': `Démarré`,
  'cc-tile-deployments.state.stopped': `Arrêté`,
  'cc-tile-deployments.title': `Derniers déploiements`,
  //#endregion
  //#region cc-tile-instances
  'cc-tile-instances.empty': `Pas d'instance. L'application est arrêtée.`,
  'cc-tile-instances.error': `Une erreur est survenue pendant le chargement des instances.`,
  'cc-tile-instances.status.deploying': `Déploiement`,
  'cc-tile-instances.status.running': `En ligne`,
  'cc-tile-instances.title': `Instances`,
  //#endregion
  //#region cc-tile-requests
  'cc-tile-requests.about-btn': `À propos de ce graphe...`,
  'cc-tile-requests.close-btn': `Afficher le graphe`,
  'cc-tile-requests.date-hours': ({ date }) => formatHours(lang, date),
  'cc-tile-requests.date-tooltip': ({ from, to }) => {
    const date = formatDateOnly(lang, from);
    const fromH = formatHours(lang, from);
    const toH = formatHours(lang, to);
    return `${date} : de ${fromH} à ${toH}`;
  },
  'cc-tile-requests.docs.msg': ({ windowHours }) => {
    const hour = plural(windowHours, 'heure');
    return sanitize`Requêtes HTTP reçues durant les dernières 24 heures. Chaque barre représente une fenêtre de temps de <strong>${windowHours} ${hour}</strong>.`;
  },
  'cc-tile-requests.empty': `Il n'y a pas de données à afficher pour l'instant.`,
  'cc-tile-requests.error': `Une erreur est survenue pendant le chargement des requêtes.`,
  'cc-tile-requests.requests-count': ({ requestCount }) => formatNumberUnit(requestCount),
  'cc-tile-requests.requests-nb': ({ value, windowHours }) => {
    const request = plural(value, 'requête');
    const hour = plural(windowHours, 'heure');
    const formattedValue = formatNumber(lang, value);
    return `${formattedValue} ${request} (en ${windowHours} ${hour})`;
  },
  'cc-tile-requests.requests-nb.total': ({ totalRequests }) => {
    const request = plural(totalRequests, 'requête');
    const formattedValue = formatNumberUnit(totalRequests);
    return `${formattedValue} ${request} sur 24 heures`;
  },
  'cc-tile-requests.title': `Requêtes HTTP`,
  //#endregion
  //#region cc-tile-scalability
  'cc-tile-scalability.error': `Une erreur est survenue pendant le chargement de la configuration de scalabilité.`,
  'cc-tile-scalability.flavor-info': (flavor) => formatFlavor(flavor),
  'cc-tile-scalability.number': `Nombre`,
  'cc-tile-scalability.size': `Taille`,
  'cc-tile-scalability.title': `Scalabilité`,
  //#endregion
  //#region cc-tile-status-codes
  'cc-tile-status-codes.about-btn': `À propos de ce graphe...`,
  'cc-tile-status-codes.close-btn': `Afficher le graphe`,
  'cc-tile-status-codes.docs.link': () => sanitize`<a href="https://developer.mozilla.org/fr/docs/Web/HTTP/Status">Codes de réponses HTTP (MDN)</a>`,
  'cc-tile-status-codes.docs.msg': `Répartition des codes de réponses HTTP envoyés durant les dernières 24 heures. Cliquez sur les éléments de légende pour cacher/montrer certaines catégories de codes.`,
  'cc-tile-status-codes.empty': `Il n'y a pas de données à afficher pour l'instant.`,
  'cc-tile-status-codes.error': `Une erreur est survenue pendant le chargement des codes de réponses HTTP.`,
  'cc-tile-status-codes.title': `Codes de réponses HTTP`,
  'cc-tile-status-codes.tooltip': ({ value, percent }) => {
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
  //#region cc-zone
  'cc-zone.country': ({ code, name }) => getCountryName(lang, code, name),
  //#endregion
  //#region cc-zone-input
  'cc-zone-input.error': `Une erreur est survenue pendant le chargement des zones.`,
  'cc-zone-input.private-map-warning': `Les zones privées n'apparaissent pas sur la carte.`,
  //#endregion
};

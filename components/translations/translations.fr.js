import { prepareFormatDate, prepareFormatDistanceToNow } from '../lib/i18n-date.js';

export const lang = 'fr';

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
  const plural = (value >= 1 || UNITS_FR[unit].endsWith('s')) ? '' : 's';
  return `il y a ${value} ${UNITS_FR[unit]}${plural}`;
}, 'à l\'instant');

const formatDate = prepareFormatDate(lang);

const currencyFormatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' });

export const translations = {
  LANGUAGE: '🇫🇷 Français',
  // cc-button
  'cc-button.cancel': `Cliquez pour annuler`,
  // cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(date),
  // cc-info-consumption
  'cc-info-consumption.title': `Consommation de crédits`,
  'cc-info-consumption.yesterday': `Hier`,
  'cc-info-consumption.last-30-days': `30 derniers jours`,
  'cc-info-consumption.amount': ({ amount }) => currencyFormatter.format(amount),
  'cc-info-consumption.error': `Une erreur est survenue pendant le chargement de la consommation.`,
  // cc-info-deployments
  'cc-info-deployments.title': `Derniers déploiements`,
  'cc-info-deployments.state.failed': `Échoué`,
  'cc-info-deployments.state.started': `Démarré`,
  'cc-info-deployments.state.cancelled': `Annulé`,
  'cc-info-deployments.state.stopped': `Arrêté`,
  'cc-info-deployments.error': `Something went wrong while loading deployments info.`,
  'cc-info-deployments.no-deployments': `No deployments yet.`,
  // cc-info-instances
  'cc-info-instances.title': `Instances`,
  'cc-info-instances.status.deploying': `En déploiement`,
  'cc-info-instances.status.running': `En ligne`,
  'cc-info-instances.no-instances': `Pas d'instance. L'application est arrêtée.`,
  'cc-info-instances.error': `Une erreur est survenue pendant le chargement des instances.`,
  // cc-info-scalability
  'cc-info-scalability.title': `Scalabilité`,
  'cc-info-scalability.size': `Taille`,
  'cc-info-scalability.number': `Nombre`,
  'cc-info-scalability.flavor-info': (f) => {
    const cpu = `CPUs : ${f.cpus}`;
    const shared = f.microservice ? ` (partagé)` : '';
    const gpu = f.gpus > 0 ? `GPUs : ${f.gpus}` : '';
    const mem = `RAM : ${(f.mem < 1024) ? `${f.mem} Mo` : `${f.mem / 1024} Go`}`;
    return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
  },
  'cc-info-scalability.error': `Une erreur est survenue pendant le chargement de la configuration de scalabilité.`,
  // env-var-create
  'env-var-create.name.placeholder': `NOM_DE_LA_VARIABLE`,
  'env-var-create.value.placeholder': `valeur de la variable`,
  'env-var-create.create-button': `Ajouter`,
  'env-var-create.errors.invalid-name': ({ name }) => `Le nom ${name} n'est pas valide`,
  'env-var-create.errors.already-defined-name': ({ name }) => `Le nom ${name} est déjà défini`,
  // env-var-editor-simple
  'env-var-editor-simple.empty-data': `Il n'y a pas de variable.`,
  // env-var-editor-expert
  'env-var-editor-expert.placeholder': `NOM_DE_LA_VARIABLE="valeur de la variable"`,
  'env-var-editor-expert.placeholder-readonly': `Il n'y a pas de variable.`,
  'env-var-editor-expert.errors.unknown': `Erreur inconnue`,
  'env-var-editor-expert.errors.line': `ligne`,
  'env-var-editor-expert.errors.invalid-name': ({ name }) => `Le nom ${name} n'est pas valide`,
  'env-var-editor-expert.errors.duplicated-name': ({ name }) => `attention, le nom ${name} est déjà défini`,
  'env-var-editor-expert.errors.invalid-line': `cette ligne est invalide, le format correct est : NOM="VALEUR"`,
  'env-var-editor-expert.errors.invalid-value': `la valeur est invalide, si vous utilisez des guillements, vous devez les échapper comme ceci : \\" ou alors mettre toute la valeur entre guillemets.`,
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

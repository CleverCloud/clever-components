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

export const lang = 'en';

const plural = preparePlural(lang);

const formatDistanceToNow = prepareFormatDistanceToNow(lang, (value, unit) => {
  const pluralUnit = plural(value, unit);
  return `${value} ${pluralUnit} ago`;
}, 'just now');

const formatNumberUnit = prepareNumberUnitFormatter(lang);
const formatBytes = prepareNumberBytesFormatter(lang, 'B', ' ');
const BYTES_SI_SEPARATOR = ' ';
const formatBytesSi = prepareNumberUnitFormatter(lang, 'B', BYTES_SI_SEPARATOR);

function getUnit (value) {
  return formatBytesSi(value).split(BYTES_SI_SEPARATOR)[1];
}

// Shared logic between translations, is it a good idea?
function formatFlavor (f) {
  const cpu = `CPUs: ${f.cpus}`;
  const shared = f.microservice ? ` (shared)` : '';
  const gpu = f.gpus > 0 ? `GPUs: ${f.gpus}` : '';
  const mem = `RAM: ${formatBytes(f.mem * 1024 * 1024)}`;
  return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
}

export const translations = {
  LANGUAGE: 'English',
  //#region cc-addon-admin
  'cc-addon-admin.admin': `Add-on administration`,
  'cc-addon-admin.danger-zone': `Danger zone`,
  'cc-addon-admin.delete': `Delete the add-on`,
  'cc-addon-admin.delete-description': () => sanitize`Deleting this add-on will make it immediately unavailable.<br>The virtual machine will be stopped in 24 hours.<br>Backups will be kept according to the retention policy.`,
  'cc-addon-admin.error-loading': `Something went wrong while loading add-on info.`,
  'cc-addon-admin.heading.name': `Name`,
  'cc-addon-admin.heading.tags': `Tags`,
  'cc-addon-admin.input.name': `Add-on name`,
  'cc-addon-admin.input.tags': `Add-on tags`,
  'cc-addon-admin.tags-description': `Tags allow you to classify your applications and add-ons to create categories`,
  'cc-addon-admin.tags-empty': `No defined tags`,
  'cc-addon-admin.tags-update': `Update tags`,
  'cc-addon-admin.update': `Update name`,
  //#endregion
  //#region cc-addon-backups
  'cc-addon-backups.close-btn': `Close this panel`,
  'cc-addon-backups.command-password': `This command will ask for your password, here it is:`,
  'cc-addon-backups.delete': ({ createdAt }) => sanitize`Delete the backup from <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong>`,
  'cc-addon-backups.delete.btn': `delete...`,
  'cc-addon-backups.delete.manual.description.es-addon': () => sanitize`You can delete this backup using <a href="https://curl.se/docs/">cURL</a> by executing this command:`,
  'cc-addon-backups.delete.manual.title': `Delete manually`,
  'cc-addon-backups.delete.with-service.description.es-addon': ({ href }) => sanitize`You can delete this backup using Kibana by going to the <a href="${href}">backup repository</a>.`,
  'cc-addon-backups.delete.with-service.title.es-addon': `Delete with Kibana`,
  'cc-addon-backups.description.es-addon': `Backups are managed by Elasticsearch itself. You can define the retention period and backup frequency through Kibana's UI.`,
  'cc-addon-backups.description.es-addon-old': `Backups are managed by Elasticsearch itself. The version of your Elasticsearch does not allow to define a retention policy. Deleting a backup can be done manually through Elasticsearch's API.`,
  'cc-addon-backups.description.jenkins': `Backups are created by archiving Jenkins's data.`,
  'cc-addon-backups.description.mongodb-addon': () => sanitize`Backups are created using the <a href="https://docs.mongodb.com/v4.0/reference/program/mongodump/">mongodump</a> tool.`,
  'cc-addon-backups.description.mysql-addon': () => sanitize`Backups are created using the <a href="https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html">mysqldump</a> tool.`,
  'cc-addon-backups.description.postgresql-addon': () => sanitize`Backups are created using the <a href="https://www.postgresql.org/docs/current/app-pgdump.html">pg_dump</a> tool.`,
  'cc-addon-backups.description.redis-addon': `Backups are created by archiving Redis's data.`,
  'cc-addon-backups.empty': `There are no backups yet.`,
  'cc-addon-backups.link.es-addon': `open in Kibana`,
  'cc-addon-backups.link.es-addon-old': `open in Elasticsearch`,
  'cc-addon-backups.link.jenkins': `download`,
  'cc-addon-backups.link.mongodb-addon': `download`,
  'cc-addon-backups.link.mysql-addon': `download`,
  'cc-addon-backups.link.postgresql-addon': `download`,
  'cc-addon-backups.link.redis-addon': `download`,
  'cc-addon-backups.loading-error': `Something went wrong while loading the backups.`,
  'cc-addon-backups.restore': ({ createdAt }) => sanitize`Restore the backup from <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong>`,
  'cc-addon-backups.restore.btn': `restore...`,
  'cc-addon-backups.restore.manual.description.es-addon': () => sanitize`You can restore this backup using <a href="https://curl.se/docs/">cURL</a> by executing this command:`,
  'cc-addon-backups.restore.manual.description.jenkins': `Restoring a Jenkins backup must be done by our support team. Please open a support ticket containing the add-on ID and the backup to restore and we will do it for you.`,
  'cc-addon-backups.restore.manual.description.mongodb-addon': () => sanitize`You can restore this backup using the <a href="https://docs.mongodb.com/v4.0/reference/program/mongorestore/">mongorestore</a> tool by executing this command:`,
  'cc-addon-backups.restore.manual.description.mysql-addon': () => sanitize`You can restore this backup using the <a href="https://dev.mysql.com/doc/refman/8.0/en/mysql.html">mysql</a> CLI by executing this command:`,
  'cc-addon-backups.restore.manual.description.postgresql-addon': () => sanitize`You can restore this backup using the <a href="https://www.postgresql.org/docs/current/app-pgrestore.html">pg_restore</a> tool by executing this command:`,
  'cc-addon-backups.restore.manual.description.redis-addon': `Restoring a Redis backup must be done by our support team. Please open a support ticket containing the add-on ID and the backup to restore and we will do it for you.`,
  'cc-addon-backups.restore.manual.title': `Restore manually`,
  'cc-addon-backups.restore.with-service.description.es-addon': ({ href }) => sanitize`You can restore this backup using Kibana by going to the <a href="${href}">backup repository</a>.`,
  'cc-addon-backups.restore.with-service.title.es-addon': `Restore with Kibana`,
  'cc-addon-backups.text': ({ createdAt, expiresAt }) => {
    return sanitize`Backup from <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong> (expires on <strong>${formatDateOnly(lang, expiresAt)}</strong>)`;
  },
  'cc-addon-backups.text.user-defined-retention': ({ createdAt }) => sanitize`Backup from <strong title="${formatDate(lang, createdAt)}">${formatDatetime(lang, createdAt)}</strong> (expires after defined retention)`,
  'cc-addon-backups.title': `Backups`,
  //#endregion
  //#region cc-addon-credentials
  'cc-addon-credentials.description.apm': `Use those credentials to connect an APM Server instance to your Elasticsearch cluster.`,
  'cc-addon-credentials.description.elasticsearch': `Use those credentials to connect to your Elasticsearch cluster.`,
  'cc-addon-credentials.description.kibana': `Use those credentials to connect a Kibana instance to your Elasticsearch cluster.`,
  'cc-addon-credentials.description.pulsar': `Use those information to connect your Pulsar add-on.`,
  'cc-addon-credentials.field.auth-token': `Authentication token`,
  'cc-addon-credentials.field.host': `Domain name`,
  'cc-addon-credentials.field.password': `Password`,
  'cc-addon-credentials.field.url': `URL`,
  'cc-addon-credentials.field.user': `User`,
  'cc-addon-credentials.loading-error': `Something went wrong while loading the credentials.`,
  'cc-addon-credentials.title': ({ name }) => `${name} credentials`,
  //#endregion
  //#region cc-addon-elasticsearch-options
  'cc-addon-elasticsearch-options.description': () => sanitize`This add-on is part of the Elastic Stack offer which includes two options. Both these options will be deployed as applications, managed and updated by Clever Cloud on your behalf. They will appear as regular applications that you can stop, scale up or down automatically like one of your own applications. As such, <strong>enabling these options will result in an increase in credits consumption</strong> as well.`,
  'cc-addon-elasticsearch-options.description.apm': () => sanitize`Elastic APM server is an application performance monitoring system built on the Elastic Stack. Deploying this will allow you to automatically send APM metrics from any applications linked to the Elasticsearch add-on instance, providing you add the Elastic APM agent to the application code. Learn more in the <a href="https://www.elastic.co/guide/en/apm/get-started/current/overview.html">official APM server documentation</a>.`,
  'cc-addon-elasticsearch-options.description.kibana': () => sanitize`Kibana is the admin UI for the Elastic Stack. It lets you visualize your Elasticsearch data and navigate the stack so you can do anything from tracking query load to understanding the way requests flow through your apps. Learn more in the <a href="https://www.elastic.co/guide/en/kibana/master/index.html">official Kibana documentation</a>.`,
  'cc-addon-elasticsearch-options.error.icon-a11y-name': `Warning`,
  'cc-addon-elasticsearch-options.title': `Options for the Elastic Stack`,
  'cc-addon-elasticsearch-options.warning.apm': `If you enable this option, we'll deploy and manage an Elastic APM server application for you, this will lead to additional costs.`,
  'cc-addon-elasticsearch-options.warning.apm.details': (flavor) => sanitize`By default, the app will start on a <strong title="${formatFlavor(flavor)}">${flavor.name} instance</strong> which costs around <strong>${formatCurrency(lang, flavor.monthlyCost)} per month</strong>.`,
  'cc-addon-elasticsearch-options.warning.kibana': `If you enable this option, we'll deploy and manage a Kibana application for you, this will lead to additional costs.`,
  'cc-addon-elasticsearch-options.warning.kibana.details': (flavor) => sanitize`By default, the app will start on a <strong title="${formatFlavor(flavor)}">${flavor.name} instance</strong> which costs around <strong>${formatCurrency(lang, flavor.monthlyCost)} per month</strong>.`,
  //#endregion
  //#region cc-addon-encryption-at-rest-option
  'cc-addon-encryption-at-rest-option.description': () => sanitize`Encryption at rest encrypts the entire data disk of your add-on. It prevents reading the stored data in case of a physical access to the hard drive. More information in our <a href="https://www.clever-cloud.com/doc/administrate/encryption-at-rest/">documentation</a>.`,
  'cc-addon-encryption-at-rest-option.title': `Encryption at rest`,
  //#endregion
  //#region cc-addon-features
  'cc-addon-features.details': `Here's the list of all the features of your add-on. Features may evolve and your add-on would need a migration to match them all.`,
  'cc-addon-features.feature-name.disk': `Disk`,
  'cc-addon-features.feature-name.memory': `Memory`,
  'cc-addon-features.feature-name.nodes': `Nodes`,
  'cc-addon-features.feature-value.dedicated': `Dedicated`,
  'cc-addon-features.feature-value.no': `No`,
  'cc-addon-features.feature-value.yes': `Yes`,
  'cc-addon-features.loading-error': `Something went wrong while loading add-on features.`,
  'cc-addon-features.title': `Features`,
  //#endregion
  //#region cc-addon-jenkins-options
  'cc-addon-jenkins-options.description': `Choose the options you want for your Jenkins add-on.`,
  'cc-addon-jenkins-options.title': `Options for the Jenkins add-on`,
  //#endregion
  //#region cc-addon-linked-apps
  'cc-addon-linked-apps.details': `Here's the list of applications linked to this add-on. The add-on exposes its environment variables to those linked applications.`,
  'cc-addon-linked-apps.loading-error': `Something went wrong while loading linked applications.`,
  'cc-addon-linked-apps.no-linked-applications': `No applications linked yet.`,
  'cc-addon-linked-apps.title': `Linked applications`,
  //#endregion
  //#region cc-addon-mongodb-options
  'cc-addon-mongodb-options.description': `Choose the options you want for your MongoDB add-on.`,
  'cc-addon-mongodb-options.title': `Options for the MongoDB add-on`,
  //#endregion
  //#region cc-addon-mysql-options
  'cc-addon-mysql-options.description': `Choose the options you want for your MySQL add-on.`,
  'cc-addon-mysql-options.title': `Options for the MySQL add-on`,
  //#endregion
  //#region cc-addon-option
  'cc-addon-option.disabled': `Disabled`,
  'cc-addon-option.enabled': `Enabled`,
  //#endregion
  //#region cc-addon-option-form
  'cc-addon-option-form.confirm': `Confirm options`,
  //#endregion
  //#region cc-addon-postgresql-options
  'cc-addon-postgresql-options.description': `Choose the options you want for your PostgreSQL add-on.`,
  'cc-addon-postgresql-options.title': `Options for the PostgreSQL add-on`,
  //#endregion
  //#region cc-addon-redis-options
  'cc-addon-redis-options.description': `Choose the options you want for your Redis add-on.`,
  'cc-addon-redis-options.title': `Options for the Redis add-on`,
  //#endregion
  //#region cc-ansi-palette
  'cc-ansi-palette.fg-bg': ({ foreground, background }) => `Foreground: ${foreground}, Background: ${background}`,
  'cc-ansi-palette.hover': ({ color }) => `Hover background: ${color}`,
  'cc-ansi-palette.ratio': ({ ratio }) => formatNumber(lang, ratio, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(5, '0'),
  'cc-ansi-palette.selected': ({ color }) => `Selected background: ${color}`,
  //#endregion
  //#region cc-article-card
  'cc-article-card.date': ({ date }) => formatDateOnly(lang, date),
  //#endregion
  //#region cc-article-list
  'cc-article-list.error': `An error occurred while loading articles.`,
  //#endregion
  //#region cc-beta
  'cc-beta.label': `beta`,
  //#endregion
  //#region cc-block
  'cc-block.toggle.close': `Close`,
  'cc-block.toggle.open': `Open`,
  //#endregion
  //#region cc-button
  'cc-button.cancel': `Click to cancel`,
  //#endregion
  //#region cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(lang, date),
  //#endregion
  //#region cc-doc-card
  'cc-doc-card.link': ({ link, product }) => sanitize`<a href=${link} aria-label="Read the documentation - ${product}">Read the documentation</a>`,
  'cc-doc-card.skeleton-link-title': `Read the documentation`,
  //#endregion
  //#region cc-doc-list
  'cc-doc-list.error': `An error occurred while loading documentation`,
  //#endregion
  //#region cc-elasticsearch-info
  'cc-elasticsearch-info.error': `Something went wrong while loading add-ons linked to this application.`,
  'cc-elasticsearch-info.info': `Info`,
  'cc-elasticsearch-info.link.apm': `Open APM`,
  'cc-elasticsearch-info.link.doc': `Read the documentation`,
  'cc-elasticsearch-info.link.elasticsearch': `Check out the Elasticsearch add-on`,
  'cc-elasticsearch-info.link.kibana': `Open Kibana`,
  'cc-elasticsearch-info.text': `This add-on is part of the Elastic Stack offer. You can find the documentation and linked services right below.`,
  //#endregion
  //#region cc-email-list
  'cc-email-list.loading.error': `Something went wrong while loading email addresses.`,
  'cc-email-list.primary.action.resend-confirmation-email': `Resend a confirmation email`,
  'cc-email-list.primary.action.resend-confirmation-email.error': ({ address }) => sanitize`Something went wrong while sending the confirmation email to <strong>${address}</strong>.`,
  'cc-email-list.primary.action.resend-confirmation-email.success.message': ({ address }) => sanitize`To complete the process, you must click on the link that has been sent to you by email at <strong>${address}</strong>.`,
  'cc-email-list.primary.action.resend-confirmation-email.success.title': `A confirmation email has been sent`,
  'cc-email-list.primary.description': `This is the address used to create your account. All notifications are sent to this address.`,
  'cc-email-list.primary.email.unverified': `Not verified`,
  'cc-email-list.primary.email.verified': `Verified`,
  'cc-email-list.primary.title': `Primary email address`,
  'cc-email-list.secondary.action.add': `Add email address`,
  'cc-email-list.secondary.action.add.error': ({ address }) => sanitize`Something went wrong while adding the secondary email address <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.add.success.message': ({ address }) => sanitize`To complete the process you must confirm your registration by clicking on the link that was sent to you by email at <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.add.success.title': `Secondary email address addition has been taken into account`,
  'cc-email-list.secondary.action.delete.accessible-name': ({ address }) => `Delete - ${address}`,
  'cc-email-list.secondary.action.delete.error': ({ address }) => sanitize`Something went wrong while deleting secondary email address <strong>${address}</strong>.`,
  'cc-email-list.secondary.action.delete.name': `Delete`,
  'cc-email-list.secondary.action.delete.success': ({ address }) => sanitize`Secondary email address <strong>${address}</strong> deleted successfully.`,
  'cc-email-list.secondary.action.mark-as-primary.accessible-name': ({ address }) => `Mark as primary - ${address}`,
  'cc-email-list.secondary.action.mark-as-primary.error': ({ address }) => sanitize`Something went wrong while marking secondary email address <strong>${address}</strong> as primary.`,
  'cc-email-list.secondary.action.mark-as-primary.name': `Mark as primary`,
  'cc-email-list.secondary.action.mark-as-primary.success': ({ address }) => sanitize`Secondary email address <strong>${address}</strong> has been successfully marked as primary.`,
  'cc-email-list.secondary.address-input.error.already-defined': `This email address already belongs to you`,
  'cc-email-list.secondary.address-input.error.empty': `You must enter an email address`,
  'cc-email-list.secondary.address-input.error.invalid': () => sanitize`Invalid email address format.<br>Example: john.doe@example.com.`,
  'cc-email-list.secondary.address-input.error.used': `This email address does not belong to you`,
  'cc-email-list.secondary.address-input.format': `name@example.com`,
  'cc-email-list.secondary.address-input.label': `Email address`,
  'cc-email-list.secondary.description': `Unlike the primary email address, no notifications are sent to these addresses. You can be invited inside an organisation with any of your secondary email addresses.`,
  'cc-email-list.secondary.title': `Secondary email addresses`,
  'cc-email-list.title': `Email addresses`,
  //#endregion
  //#region cc-env-var-create
  'cc-env-var-create.create-button': `Add`,
  'cc-env-var-create.errors.already-defined-name': ({ name }) => sanitize`Name <code>${name}</code> is already defined`,
  'cc-env-var-create.errors.invalid-name': ({ name }) => sanitize`Name <code>${name}</code> is invalid`,
  'cc-env-var-create.info.java-prop': ({ name }) => sanitize`Variable <code>${name}</code> will only be injected as a Java property and won't be part of the environment, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">more details</a>`,
  'cc-env-var-create.name.label': `Variable name`,
  'cc-env-var-create.value.label': `Variable value`,
  //#endregion
  //#region cc-env-var-editor-expert
  'cc-env-var-editor-expert.errors.duplicated-name': ({ name }) => sanitize`be careful, the name <code>${name}</code> is already defined`,
  'cc-env-var-editor-expert.errors.invalid-line': () => sanitize`this line is not valid, the correct pattern is: <code>NAME="VALUE"</code>`,
  'cc-env-var-editor-expert.errors.invalid-name': ({ name }) => sanitize`<code>${name}</code> is not a valid variable name`,
  'cc-env-var-editor-expert.errors.invalid-name-strict': ({ name }) => sanitize`<code>${name}</code> is not a valid variable name`,
  'cc-env-var-editor-expert.errors.invalid-value': () => sanitize`the value is not valid, if you use quotes, you need to escape them like this: <code>\\"</code> or quote the whole value.`,
  'cc-env-var-editor-expert.errors.line': `line`,
  'cc-env-var-editor-expert.errors.unknown': `Unknown Error`,
  'cc-env-var-editor-expert.example': () => sanitize`Format: <code>VARIABLE_NAME="variable value"</code> <br> Every variable must be separated by a line break, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#format">learn more</a>.`,
  'cc-env-var-editor-expert.info.java-prop': ({ name }) => sanitize`Variable <code>${name}</code> will only be injected as a Java property and won't be part of the environment, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">more details</a>`,
  'cc-env-var-editor-expert.label': `Variable editing. Format: VARIABLE_NAME="variable value". Every variable must be separated by a line break.`,
  //#endregion
  //#region cc-env-var-editor-json
  'cc-env-var-editor-json.errors.duplicated-name': ({ name }) => sanitize`be careful, the name <code>${name}</code> is already defined`,
  'cc-env-var-editor-json.errors.invalid-json': `The JSON entered is invalid`,
  'cc-env-var-editor-json.errors.invalid-json-entry': () => sanitize`The input was a valid JSON array of objects but all entries must have properties <code>name</code> and <code>value</code> of type string. Ex: <code>[{ "name": "THE_NAME", "value": "the value" }]</code>`,
  'cc-env-var-editor-json.errors.invalid-json-format': `The input was valid JSON but it does not follow the correct format. It must be an array of objects`,
  'cc-env-var-editor-json.errors.invalid-name': ({ name }) => sanitize`<code>${name}</code> is not a valid variable name`,
  'cc-env-var-editor-json.errors.invalid-name-strict': ({ name }) => sanitize`<code>${name}</code> is not a valid variable name in strict mode`,
  'cc-env-var-editor-json.errors.unknown': `Unknown Error`,
  'cc-env-var-editor-json.example': () => sanitize`Format: <code>{ "name": "VARIABLE_NAME", "value": "variable value" }</code> <br> Array of objects following the above format, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#format">learn more</a>.`,
  'cc-env-var-editor-json.info.java-prop': ({ name }) => sanitize`Variable <code>${name}</code> will only be injected as a Java property and won't be part of the environment, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">more details</a>`,
  'cc-env-var-editor-json.label': `Variable editing. Array of objects following the format: { "name": "VARIABLE_NAME", "value": "variable value" }.`,
  //#endregion
  //#region cc-env-var-editor-simple
  'cc-env-var-editor-simple.empty-data': `There are no variables.`,
  //#endregion
  //#region cc-env-var-form
  'cc-env-var-form.description.config-provider': ({ addonName }) => sanitize`Configuration exposed to dependent applications. <a href="https://www.clever-cloud.com/doc/deploy/addon/config-provider/">Learn more</a><br>These variables will be injected as environment variables in applications that have the add-on <strong>${addonName}</strong> in their service dependencies.<br>Every time you update your changes, all the dependent applications will be automatically restarted.`,
  'cc-env-var-form.description.env-var': ({ appName }) => sanitize`These variables will be injected as environment variables in the application <strong>${appName}</strong>. <a href="https://doc.clever-cloud.com/admin-console/environment-variables/">Learn more</a>`,
  'cc-env-var-form.description.exposed-config': ({ appName }) => sanitize`Configuration exposed to dependent applications. <a href="https://www.clever-cloud.com/doc/admin-console/service-dependencies/">Learn more</a><br>These variables won't be injected in the application <strong>${appName}</strong>, they will be injected as environment variables in applications that have <strong>${appName}</strong> in their service dependencies.`,
  'cc-env-var-form.error.loading': `Something went wrong while loading variables.`,
  'cc-env-var-form.heading.config-provider': `Variables`,
  'cc-env-var-form.heading.env-var': `Environment variables`,
  'cc-env-var-form.heading.exposed-config': `Exposed configuration`,
  'cc-env-var-form.mode.expert': `Expert`,
  'cc-env-var-form.mode.simple': `Simple`,
  'cc-env-var-form.reset': `Reset changes`,
  'cc-env-var-form.restart-app': `Restart the app to apply changes`,
  'cc-env-var-form.update': `Update changes`,
  'cc-env-var-form.update.error': `Something went wrong while updating variables.`,
  'cc-env-var-form.update.success': `Variables have been updated successfully.`,
  //#endregion
  //#region cc-env-var-input
  'cc-env-var-input.delete-button': `Remove`,
  'cc-env-var-input.keep-button': `Keep`,
  'cc-env-var-input.value-label': ({ variableName }) => `${variableName} value`,
  'cc-env-var-input.value-placeholder': `variable value`,
  //#endregion
  //#region cc-env-var-linked-services
  'cc-env-var-linked-services.description.addon': ({ serviceName, appName }) => {
    return sanitize`List of variables exposed by the add-on <strong>${serviceName}</strong>.<br>Those variables will be injected as environment variables in the application <strong>${appName}</strong>.`;
  },
  'cc-env-var-linked-services.description.app': ({ serviceName, appName }) => {
    return sanitize`Configuration exposed by the application <strong>${serviceName}</strong>.<br>Those variables will be injected as environement variables in the application <strong>${appName}</strong>.`;
  },
  'cc-env-var-linked-services.empty.addon': ({ appName }) => sanitize`No add-ons linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.empty.app': ({ appName }) => sanitize`No applications linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.addon': ({ appName }) => sanitize`Something went wrong while loading add-ons linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.app': ({ appName }) => sanitize`Something went wrong while loading applications linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.heading.addon': ({ name }) => `Add-on: ${name}`,
  'cc-env-var-linked-services.heading.app': ({ name }) => `Application: ${name}`,
  'cc-env-var-linked-services.loading.addon': ({ appName }) => sanitize`Loading variables exposed by add-ons linked to <strong>${appName}</strong>...`,
  'cc-env-var-linked-services.loading.app': ({ appName }) => sanitize`Loading configuration exposed by applications linked to <strong>${appName}</strong>...`,
  //#endregion
  //#region cc-grafana-info
  'cc-grafana-info.disable-description': `Disabling Grafana will delete and end all accesses to this Grafana organisation. You will still be able to create another one.`,
  'cc-grafana-info.disable-title': `Disable Grafana`,
  'cc-grafana-info.disable.error': `Something went wrong while disabling Grafana dashboards.`,
  'cc-grafana-info.disable.success': `Grafana dashboards have been disabled successfully.`,
  'cc-grafana-info.documentation-description': `This service is used to visualize the our metrics data. You can find the documentation and details about those metrics here.`,
  'cc-grafana-info.documentation-title': `Documentation`,
  'cc-grafana-info.enable-description': `Enabling Grafana will create and provide all accesses to a Grafana organisation.`,
  'cc-grafana-info.enable-title': `Enable Grafana`,
  'cc-grafana-info.enable.error': `Something went wrong while enabling Grafana dashboards.`,
  'cc-grafana-info.enable.success': `Grafana dashboards have been enabled successfully.`,
  'cc-grafana-info.error-link-grafana': `Something went wrong while loading Grafana link.`,
  'cc-grafana-info.error-loading': `Something went wrong while loading Grafana state.`,
  'cc-grafana-info.grafana-link-description': `Link to the Grafana which contains Clever Cloud metrics dashboards.`,
  'cc-grafana-info.grafana-link-title': `Grafana`,
  'cc-grafana-info.link.doc': `Read the documentation`,
  'cc-grafana-info.link.grafana': `Open Grafana`,
  'cc-grafana-info.loading-title': `Grafana`,
  'cc-grafana-info.main-title': `Metrics in Grafana`,
  'cc-grafana-info.reset-description': `Reset all Clever Cloud dashboards to their initial state.`,
  'cc-grafana-info.reset-title': `Reset all dashboards`,
  'cc-grafana-info.reset.error': `Something went wrong while resetting Grafana dashboards.`,
  'cc-grafana-info.reset.success': `Grafana dashboards have been reset successfully.`,
  'cc-grafana-info.screenshot.addon.alt': `Screenshot of an add-on dashboard in Grafana`,
  'cc-grafana-info.screenshot.addon.description': () => sanitize`This dashboard includes several graphs about an add-on. <br> First, it displays a panel containing system metrics like <strong>CPU, memory, disks and network</strong>. <br> For <strong>MySQL, PostgreSQL, MongoDB and Redis</strong> add-ons, a second panel will contain databases data and provides information like <strong>connections count, queries or transactions, errors or deadlocks and tuples operations<strong>.`,
  'cc-grafana-info.screenshot.addon.title': `Add-on dashboard preview`,
  'cc-grafana-info.screenshot.organisation.alt': `Screenshot of an organisation dashboard in Grafana`,
  'cc-grafana-info.screenshot.organisation.description': () => sanitize`This dashboard includes several graphs about a Clever Cloud organisation. <br> It provides a graph summarizing the amount of <strong>deployed application runtimes and add-ons</strong>. It also provides the number of services <strong>by type</strong> or <strong>by plan (flavor)</strong>. <br> The <strong>state graph</strong> indicates a state for all deployments performed during the elapsed Grafana time interval. <br> And finally on this dashboard you will retrieve <strong>global and specific links</strong> (sorted by requests count) to access an application runtime or add-on dashboard.`,
  'cc-grafana-info.screenshot.organisation.title': `Organisation dashboard preview`,
  'cc-grafana-info.screenshot.runtime.alt': `Screenshot of an application runtime dashboard in Grafana`,
  'cc-grafana-info.screenshot.runtime.description': () => sanitize`This dashboard features an <strong>overview panel</strong> to get quick information about an application, as well as several panels about its system metrics. <br> It provides several graphs summarizing the state of <strong>CPU, memory, disks and network</strong>. <br> For each of these metric types, you will retrieve usage graphs, gauges, as well as the result of a simple linear prediction done on the elapsed Grafana time interval. This linear prediction yields the expected duration for the metric to reach 90%.`,
  'cc-grafana-info.screenshot.runtime.title': `Application runtime dashboard preview`,
  //#endregion
  //#region cc-header-addon
  'cc-header-addon.creation-date': `Creation date`,
  'cc-header-addon.creation-date.full': ({ date }) => formatDate(lang, date),
  'cc-header-addon.creation-date.short': ({ date }) => formatDateOnly(lang, date),
  'cc-header-addon.error': `Something went wrong while loading add-on info.`,
  'cc-header-addon.id-label': `Add-on identifier`,
  'cc-header-addon.id-label-alternative': `Alternative add-on identifier (real id)`,
  'cc-header-addon.plan': `Plan`,
  'cc-header-addon.version': `Version`,
  //#endregion
  //#region cc-header-app
  'cc-header-app.action.cancel-deployment': `Cancel deployment`,
  'cc-header-app.action.restart': `Restart`,
  'cc-header-app.action.restart-last-commit': `Restart last pushed commit`,
  'cc-header-app.action.restart-rebuild': `Re-build and restart`,
  'cc-header-app.action.start': `Start`,
  'cc-header-app.action.start-last-commit': `Start last pushed commit`,
  'cc-header-app.action.start-rebuild': `Re-build and start`,
  'cc-header-app.action.stop': `Stop app`,
  'cc-header-app.commits.git': ({ commit }) => `git repo version (HEAD): ${commit}`,
  'cc-header-app.commits.no-commits': `no commits yet`,
  'cc-header-app.commits.running': ({ commit }) => `running version: ${commit}`,
  'cc-header-app.commits.starting': ({ commit }) => `deploying version: ${commit}`,
  'cc-header-app.disable-buttons': `You are not authorized to perform those actions`,
  'cc-header-app.error': `Something went wrong while loading app info.`,
  'cc-header-app.read-logs': `read logs here`,
  'cc-header-app.state-msg.app-is-restarting': `Your application is restarting...`,
  'cc-header-app.state-msg.app-is-running': `Your application is running!`,
  'cc-header-app.state-msg.app-is-starting': `Your application is starting...`,
  'cc-header-app.state-msg.app-is-stopped': `Your application is currently stopped.`,
  'cc-header-app.state-msg.last-deploy-failed': `The last deployment failed,`,
  'cc-header-app.state-msg.unknown-state': `Unknown state, try to restart the application or contact our support if you have additional questions.`,
  'cc-header-app.user-action-msg.app-will-start': `Your application is about to start...`,
  'cc-header-app.user-action-msg.app-will-stop': `Your application is about to stop...`,
  'cc-header-app.user-action-msg.deploy-cancelled': `This deployment has been cancelled.`,
  'cc-header-app.user-action-msg.deploy-will-begin': `A new deployment is about to begin...`,
  //#endregion
  //#region cc-header-orga
  'cc-header-orga.error': `Something went wrong while loading organisation info.`,
  'cc-header-orga.hotline': `Hotline:`,
  //#endregion
  //#region cc-heptapod-info
  'cc-heptapod-info.description': () => sanitize`This Heptapod instance hosts mercurial projects. Learn more on <a href="https://about.heptapod.host">https://about.heptapod.host</a>.`,
  'cc-heptapod-info.error-loading': `Something went wrong while loading usage info.`,
  'cc-heptapod-info.not-in-use': `You are not using this Heptapod service.`,
  'cc-heptapod-info.price-description': `Estimated price`,
  'cc-heptapod-info.price-value': ({ price }) => `${formatCurrency(lang, price)} / month`,
  'cc-heptapod-info.private-active-users-description': `Private users`,
  'cc-heptapod-info.public-active-users-description': `Public users`,
  'cc-heptapod-info.storage-bytes': ({ storage }) => formatBytes(storage, 1),
  'cc-heptapod-info.storage-description': `Storage size`,
  //#endregion
  //#region cc-input-number
  'cc-input-number.decrease': `decrease`,
  'cc-input-number.increase': `increase`,
  'cc-input-number.required': `required`,
  //#endregion
  //#region cc-input-text
  'cc-input-text.clipboard': `Copy to clipboard`,
  'cc-input-text.required': `required`,
  'cc-input-text.secret.hide': `Hide secret`,
  'cc-input-text.secret.show': `Show secret`,
  //#endregion
  //#region cc-invoice
  'cc-invoice.download-pdf': `Download PDF`,
  'cc-invoice.error': `Something went wrong while loading the invoice.`,
  'cc-invoice.info': ({ date, amount }) => {
    return sanitize`This invoice was issued on <strong>${formatDateOnly(lang, date)}</strong> for a total amount of <strong>${formatCurrency(lang, amount)}</strong>.`;
  },
  'cc-invoice.title': `Invoice`,
  //#endregion
  //#region cc-invoice-list
  'cc-invoice-list.error': `An error occured while loading invoices.`,
  'cc-invoice-list.pending': `Pending invoices`,
  'cc-invoice-list.pending.no-invoices': `No pending invoices at the moment.`,
  'cc-invoice-list.processed': `Paid invoices`,
  'cc-invoice-list.processed.no-invoices': `No paid invoices at the moment.`,
  'cc-invoice-list.processing': `Invoices awaiting payment validation`,
  'cc-invoice-list.title': `Invoices`,
  'cc-invoice-list.year': `Year:`,
  //#endregion
  //#region cc-invoice-table
  'cc-invoice-table.date.emission': `Emission date`,
  'cc-invoice-table.date.value': ({ date }) => `${formatDateOnly(lang, date)}`,
  'cc-invoice-table.number': `Number`,
  'cc-invoice-table.open-pdf': `Download PDF`,
  'cc-invoice-table.pay': `Pay`,
  'cc-invoice-table.text': ({ number, date, amount }) => {
    return sanitize`Invoice <strong>${number}</strong> issued on <strong>${formatDateOnly(lang, date)}</strong> for a total amount of <code>${formatCurrency(lang, amount)}</code>`;
  },
  'cc-invoice-table.total.label': `Total`,
  'cc-invoice-table.total.value': ({ amount }) => `${formatCurrency(lang, amount)}`,
  //#endregion
  //#region cc-jenkins-info
  'cc-jenkins-info.documentation.link': `Read the documentation`,
  'cc-jenkins-info.documentation.text': `Our documentation can help you start using Jenkins and create jobs that run on Clever Cloud docker applications.`,
  'cc-jenkins-info.documentation.title': `Documentation`,
  'cc-jenkins-info.error': `An error occured while fetching the information about this add-on.`,
  'cc-jenkins-info.info': `Info`,
  'cc-jenkins-info.open-jenkins.link': `Access Jenkins`,
  'cc-jenkins-info.open-jenkins.text': `Access Jenkins using the Clever Cloud SSO (Single Sign-On). Organisation members can also access the Jenkins service.`,
  'cc-jenkins-info.open-jenkins.title': `Access Jenkins`,
  'cc-jenkins-info.text': `This add-on is part of the Jenkins offer. You can find the documentation and various information below.`,
  'cc-jenkins-info.update.new-version': ({ version }) => `Jenkins version ${version} is available!`,
  'cc-jenkins-info.update.text': `Jenkins and its plugins often get updates. You can automatically update Jenkins and its plugins using its dedicated WEB interface.`,
  'cc-jenkins-info.update.title': `Updates`,
  'cc-jenkins-info.update.up-to-date': `Your Jenkins version is up-to-date.`,
  //#endregion
  //#region cc-logs
  'cc-logs.copied.multi': ({ count }) => `Copied (${count} lines)`,
  'cc-logs.copied.single': `Copied`,
  'cc-logs.copy': `Copy`,
  'cc-logs.select-button.label': ({ index }) => `Select the line ${index}`,
  'cc-logs.unselect-button.label': ({ index }) => `Unselect the line ${index}`,
  //#endregion
  //#region cc-logsmap
  'cc-logsmap.legend.heatmap': ({ orgaName }) => sanitize`Heatmap of HTTP requests received by all apps from <strong>${orgaName}</strong> during the last 24 hours.`,
  'cc-logsmap.legend.heatmap.app': ({ appName }) => sanitize`Heatmap of HTTP requests received by <strong>${appName}</strong> during the last 24 hours.`,
  'cc-logsmap.legend.points': ({ orgaName }) => sanitize`Realtime map of HTTP requests received by all apps from <strong>${orgaName}</strong>.`,
  'cc-logsmap.legend.points.app': ({ appName }) => sanitize`Realtime map of HTTP requests received by <strong>${appName}</strong>.`,
  'cc-logsmap.mode.heatmap': `Last 24h`,
  'cc-logsmap.mode.points': `Realtime`,
  //#endregion
  //#region cc-map
  'cc-map.error': `Something went wrong while trying to fetch data for the map.`,
  'cc-map.error.icon-a11y-name': `Warning`,
  'cc-map.no-points': `No data to display on the map right now.`,
  //#endregion
  //#region cc-matomo-info
  'cc-matomo-info.about.text': () => sanitize`
    <p>The Matomo add-on is a meta add-on. It provides you with a <strong>PHP</strong> application, a <strong>MySQL</strong> add-on and a <strong>Redis</strong> add-on.</p>
    <p>They appear in your organisation just like your other applications and add-ons. You can still configure them as you like. For example, you may want to change the PHP application's domain or migrate the MySQL add-on to a bigger plan.</p>
    <p>This add-on is free but its dependencies are billed based on their consumptions, just like other applications and add-ons.</p>
  `,
  'cc-matomo-info.about.title': `About`,
  'cc-matomo-info.documentation.link': `Read the documentation`,
  'cc-matomo-info.documentation.text': `Our documentation can help you start using Matomo and configure its dependencies.`,
  'cc-matomo-info.documentation.title': `Documentation`,
  'cc-matomo-info.error': `An error occured while fetching the information about this add-on.`,
  'cc-matomo-info.heading': `This Matomo add-on provides all required dependencies to get started.`,
  'cc-matomo-info.info': `Info`,
  'cc-matomo-info.link.mysql': `Access the MySQL add-on`,
  'cc-matomo-info.link.php': `Access the PHP application`,
  'cc-matomo-info.link.redis': `Access the Redis add-on`,
  'cc-matomo-info.open-matomo.link': `Access Matomo`,
  'cc-matomo-info.open-matomo.text': `You can access your Matomo using your Clever Cloud account. Organisation members can also access the Matomo service.`,
  'cc-matomo-info.open-matomo.title': `Access Matomo`,
  //#endregion
  //#region cc-notice
  'cc-notice.close': `Close this notice`,
  'cc-notice.icon-alt.danger': `Error`,
  'cc-notice.icon-alt.info': `Information`,
  'cc-notice.icon-alt.success': `Success`,
  'cc-notice.icon-alt.warning': `Warning`,
  //#endregion
  //#region cc-orga-member-card
  'cc-orga-member-card.btn.cancel.accessible-name': ({ memberIdentity }) => `Cancel editing member - ${memberIdentity}`,
  'cc-orga-member-card.btn.cancel.visible-text': `Cancel`,
  'cc-orga-member-card.btn.delete.accessible-name': ({ memberIdentity }) => `Remove the member - ${memberIdentity}`,
  'cc-orga-member-card.btn.delete.visible-text': `Remove`,
  'cc-orga-member-card.btn.edit.accessible-name': ({ memberIdentity }) => `Edit the member - ${memberIdentity}`,
  'cc-orga-member-card.btn.edit.visible-text': `Edit`,
  'cc-orga-member-card.btn.leave.accessible-name': `Leave the organisation`,
  'cc-orga-member-card.btn.leave.visible-text': `Leave`,
  'cc-orga-member-card.btn.validate.accessible-name': ({ memberIdentity }) => `Validate the edit of the member - ${memberIdentity}`,
  'cc-orga-member-card.btn.validate.visible-text': `Validate`,
  'cc-orga-member-card.current-user': `Your account`,
  'cc-orga-member-card.error.last-admin.heading': `You are the last admin of the organisation`,
  'cc-orga-member-card.error.last-admin.text': `Please add a new admin before you can edit your role or leave the organisation.`,
  'cc-orga-member-card.mfa-disabled': `2FA disabled`,
  'cc-orga-member-card.mfa-enabled': `2FA enabled`,
  'cc-orga-member-card.role.accounting': `Accountant`,
  'cc-orga-member-card.role.admin': `Admin`,
  'cc-orga-member-card.role.developer': `Developer`,
  'cc-orga-member-card.role.label': `Role`,
  'cc-orga-member-card.role.manager': `Manager`,
  //#endregion
  //#region cc-orga-member-list
  'cc-orga-member-list.delete.error': ({ memberIdentity }) => sanitize`Something went wrong while trying to remove <strong>${memberIdentity}</strong> from this organisation.`,
  'cc-orga-member-list.delete.success': ({ memberIdentity }) => sanitize`<strong>${memberIdentity}</strong> has been removed from this organisation.`,
  'cc-orga-member-list.edit.error': ({ memberIdentity }) => sanitize`Something went wrong while editing <strong>${memberIdentity}</strong>.`,
  'cc-orga-member-list.edit.success': ({ memberIdentity }) => sanitize`The role of <strong>${memberIdentity}</strong> has been modified.`,
  'cc-orga-member-list.error': `Something went wrong while loading the organisation member list.`,
  'cc-orga-member-list.error-member-not-found.heading': `Member not found`,
  'cc-orga-member-list.error-member-not-found.text': () => sanitize`<p>The member has left the organisation or has been removed by someone else after loading the list of members.<p><p>Please <strong>refresh your page</strong> to get the updated list of members.</p>`,
  'cc-orga-member-list.error.unauthorised.heading': `Unauthorised action`,
  'cc-orga-member-list.error.unauthorised.text': `Only admins may invite, edit or remove other admins.`,
  'cc-orga-member-list.filter.mfa': `Accounts not secured with 2FA`,
  'cc-orga-member-list.filter.name': `Filter by name or email address`,
  'cc-orga-member-list.invite.email.error-duplicate': `This user is already a member of this organisation.`,
  'cc-orga-member-list.invite.email.error-empty': `Please enter an email address.`,
  'cc-orga-member-list.invite.email.error-format': () => sanitize`Invalid email address format.<br>Example: john.doe@example.com.`,
  'cc-orga-member-list.invite.email.format': `name@example.com`,
  'cc-orga-member-list.invite.email.label': `Email address`,
  'cc-orga-member-list.invite.heading': `Invite a member`,
  'cc-orga-member-list.invite.info': () => sanitize`More information about roles in the <a href="https://www.clever-cloud.com/doc/account/organizations/#roles-and-privileges">Roles and Organisations</a> page.`,
  'cc-orga-member-list.invite.role.accounting': `Accountant`,
  'cc-orga-member-list.invite.role.admin': `Admin`,
  'cc-orga-member-list.invite.role.developer': `Developer`,
  'cc-orga-member-list.invite.role.label': `Role`,
  'cc-orga-member-list.invite.role.manager': `Manager`,
  'cc-orga-member-list.invite.submit': `Invite`,
  'cc-orga-member-list.invite.submit.error': ({ userEmail }) => sanitize`Something went wrong when trying to invite <strong>${userEmail}</strong>.`,
  'cc-orga-member-list.invite.submit.error-rate-limit.message': `Wait a few minutes before trying again.`,
  'cc-orga-member-list.invite.submit.error-rate-limit.title': `You have tried to invite members too many times`,
  'cc-orga-member-list.invite.submit.success': ({ userEmail }) => sanitize`An email has been sent to invite <strong>${userEmail}</strong> into this organisation.`,
  'cc-orga-member-list.leave.btn': `Leave the organisation`,
  'cc-orga-member-list.leave.error': `Something went wrong when trying to leave the organisation.`,
  'cc-orga-member-list.leave.error-last-admin.heading': `You are the last admin of your organisation`,
  'cc-orga-member-list.leave.error-last-admin.text': `Please add a new admin before you can edit your role or leave the organisation.`,
  'cc-orga-member-list.leave.heading': `Danger zone`,
  'cc-orga-member-list.leave.success': `You have left the organisation.`,
  'cc-orga-member-list.leave.text': () => sanitize`
    <p>Leaving the organisation is not subject to any confirmation.</p>
    <p>If you change your mind afterwards, you will need to ask someone from this organisation to be invited again.</p>
  `,
  'cc-orga-member-list.list.heading': `Members`,
  'cc-orga-member-list.main-heading': `Manage organisation members`,
  'cc-orga-member-list.no-result': `No results matching your criteria.`,
  //#endregion
  //#region cc-payment-warning
  'cc-payment-warning.billing-page-link': ({ orgaName, orgaBillingLink }) => sanitize`<a href="${orgaBillingLink}" aria-label="Go to the billing page - ${orgaName}">Go to the billing page</a>`,
  'cc-payment-warning.generic.default-payment-method-is-expired': ({ orgaName }) => sanitize`<strong>${orgaName}</strong> has a default payment method but it has expired.`,
  'cc-payment-warning.generic.no-default-payment-method': ({ orgaName }) => sanitize`<strong>${orgaName}</strong> has registered payment methods but none of them are set as default.`,
  'cc-payment-warning.generic.no-payment-method': ({ orgaName }) => sanitize`<strong>${orgaName}</strong> doesn't have any registered payment method.`,
  'cc-payment-warning.home': ({ orgaCount }) => {
    const organisation = plural(orgaCount, 'organisation');
    return `To avoid any suspension of your services and deletion of your data, please check the billing info related to the following ${organisation}:`;
  },
  'cc-payment-warning.home.title': `Beware! Something is wrong with your payment methods.`,
  'cc-payment-warning.orga.default-payment-method-is-expired': `To avoid any suspension of your services and deletion of your data, please add a valid payment method and set it as default.`,
  'cc-payment-warning.orga.default-payment-method-is-expired.title': `Beware! Your default payment method has expired`,
  'cc-payment-warning.orga.no-default-payment-method': `To avoid any suspension of your services and deletion of your data, please set one of them as default.`,
  'cc-payment-warning.orga.no-default-payment-method.title': `Beware! You have registered payment methods but none of them are set as default`,
  'cc-payment-warning.orga.no-payment-method': `To avoid any suspension of your services and deletion of your data, please add a valid payment method and set it as default.`,
  'cc-payment-warning.orga.no-payment-method.title': `Beware! You don't have any registered payment method`,
  //#endregion
  //#region cc-pricing-estimation
  'cc-pricing-estimation.count.label': ({ productCount }) => plural(productCount, 'product'),
  'cc-pricing-estimation.estimated-price-name.1000-minutes': `Price (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-estimation.estimated-price-name.30-days': () => sanitize`estimated/30&nbsp;days`,
  'cc-pricing-estimation.estimated-price-name.day': `estimated/Day`,
  'cc-pricing-estimation.estimated-price-name.hour': `estimated/Hour`,
  'cc-pricing-estimation.estimated-price-name.minute': `estimated/Minute`,
  'cc-pricing-estimation.estimated-price-name.second': `estimated/Second`,
  'cc-pricing-estimation.feature.connection-limit': `Connection limit: `,
  'cc-pricing-estimation.feature.cpu': `vCPUs: `,
  'cc-pricing-estimation.feature.custom': ({ featureName }) => `${featureName}: `,
  'cc-pricing-estimation.feature.databases': `Databases: `,
  'cc-pricing-estimation.feature.disk-size': `Disk size: `,
  'cc-pricing-estimation.feature.gpu': `GPUs: `,
  'cc-pricing-estimation.feature.has-logs': `Logs: `,
  'cc-pricing-estimation.feature.has-metrics': `Metrics: `,
  'cc-pricing-estimation.feature.max-db-size': `Max DB size: `,
  'cc-pricing-estimation.feature.memory': `RAM: `,
  'cc-pricing-estimation.feature.version': `Version: `,
  'cc-pricing-estimation.heading': `My selection`,
  'cc-pricing-estimation.hide': `Hide`,
  'cc-pricing-estimation.label.currency': `Currency: `,
  'cc-pricing-estimation.label.temporality': `Unit of time: `,
  'cc-pricing-estimation.plan.delete': ({ productName, planName }) => `Remove ${productName} - ${planName}`,
  'cc-pricing-estimation.plan.qty.btn.decrease': ({ productName, planName }) => `Decrease quantity - ${productName} (${planName})`,
  'cc-pricing-estimation.plan.qty.btn.increase': ({ productName, planName }) => `Increase quantity - ${productName} (${planName})`,
  'cc-pricing-estimation.plan.qty.label': `Quantity: `,
  'cc-pricing-estimation.plan.total.label': ({ productName, planName }) => `Total for ${productName} ${planName}`,
  'cc-pricing-estimation.price': ({ price, code, digits }) => formatCurrency(lang, price, {
    currency: code,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }),
  'cc-pricing-estimation.price-name.1000-minutes': `Price (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-estimation.price-name.30-days': () => sanitize`Price/30&nbsp;days`,
  'cc-pricing-estimation.price-name.day': `Price/Day`,
  'cc-pricing-estimation.price-name.hour': `Price/Hour`,
  'cc-pricing-estimation.price-name.minute': `Price/Minute`,
  'cc-pricing-estimation.price-name.second': `Price/Second`,
  'cc-pricing-estimation.price.unit.label': `Unit price: `,
  'cc-pricing-estimation.show': `Show`,
  'cc-pricing-estimation.tax-excluded': `tax excl.`,
  'cc-pricing-estimation.total.label': `Total: `,
  'cc-pricing-estimation.type.boolean': ({ boolean }) => `${boolean ? 'Yes' : 'No'}`,
  'cc-pricing-estimation.type.boolean-shared': ({ shared }) => `${shared ? 'Shared' : 'Dedicated'}`,
  'cc-pricing-estimation.type.bytes': ({ bytes }) => formatBytes(bytes, 0, 3),
  'cc-pricing-estimation.type.number': ({ number }) => formatNumber(lang, number),
  'cc-pricing-estimation.type.number-cpu-runtime': ({ cpu, shared }) => {
    return shared
      ? sanitize`<em title="Lower priority access to vCPU">${formatNumber(lang, cpu)}<code>*</code></em>`
      : formatNumber(lang, cpu);
  },
  //#endregion
  //#region cc-pricing-header
  'cc-pricing-header.error': `Something went wrong while loading pricing filters.`,
  'cc-pricing-header.label.currency': `Currency`,
  'cc-pricing-header.label.temporality': `Unit of time`,
  'cc-pricing-header.label.zone': `Zone`,
  'cc-pricing-header.price-name.1000-minutes': `Price (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-header.price-name.30-days': () => sanitize`Price/30&nbsp;days`,
  'cc-pricing-header.price-name.day': `Price/Day`,
  'cc-pricing-header.price-name.hour': `Price/Hour`,
  'cc-pricing-header.price-name.minute': `Price/Minute`,
  'cc-pricing-header.price-name.second': `Price/Second`,
  //#endregion
  //#region cc-pricing-product
  'cc-pricing-product.add-button': ({ productName, size }) => `Add ${productName} - ${size} to the cost estimate`,
  'cc-pricing-product.error': `An error occured while loading pricing details.`,
  'cc-pricing-product.feature.connection-limit': `Connection limit`,
  'cc-pricing-product.feature.cpu': `vCPUs`,
  'cc-pricing-product.feature.databases': `Databases`,
  'cc-pricing-product.feature.disk-size': `Disk size`,
  'cc-pricing-product.feature.gpu': `GPUs`,
  'cc-pricing-product.feature.has-logs': `Logs`,
  'cc-pricing-product.feature.has-metrics': `Metrics`,
  'cc-pricing-product.feature.max-db-size': `Max DB size`,
  'cc-pricing-product.feature.memory': `RAM`,
  'cc-pricing-product.feature.version': `Version`,
  'cc-pricing-product.plan': `Plan`,
  'cc-pricing-product.price': ({ price, code, digits }) => formatCurrency(lang, price, {
    currency: code,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }),
  'cc-pricing-product.price-name.1000-minutes': `Price (${formatNumber(lang, 1000)} minutes)`,
  'cc-pricing-product.price-name.30-days': () => sanitize`Price/30&nbsp;days`,
  'cc-pricing-product.price-name.day': `Price/Day`,
  'cc-pricing-product.price-name.hour': `Price/Hour`,
  'cc-pricing-product.price-name.minute': `Price/Minute`,
  'cc-pricing-product.price-name.second': `Price/Second`,
  'cc-pricing-product.type.boolean': ({ boolean }) => `${boolean ? 'Yes' : 'No'}`,
  'cc-pricing-product.type.boolean-shared': ({ shared }) => `${shared ? 'Shared' : 'Dedicated'}`,
  'cc-pricing-product.type.bytes': ({ bytes }) => formatBytes(bytes, 0, 3),
  'cc-pricing-product.type.number': ({ number }) => formatNumber(lang, number),
  'cc-pricing-product.type.number-cpu-runtime': ({ cpu, shared }) => {
    return shared
      ? sanitize`<em title="Lower priority access to vCPU">${formatNumber(lang, cpu)}<code>*</code></em>`
      : formatNumber(lang, cpu);
  },
  //#endregion
  //#region cc-pricing-product-consumption
  'cc-pricing-product-consumption.add': `Add`,
  'cc-pricing-product-consumption.bytes': ({ bytes }) => formatBytesSi(bytes),
  'cc-pricing-product-consumption.bytes-unit': ({ bytes }) => getUnit(bytes),
  'cc-pricing-product-consumption.error': `An error occured while retrieving pricing details.`,
  'cc-pricing-product-consumption.inbound-traffic.label': `traffic in`,
  'cc-pricing-product-consumption.inbound-traffic.title': `Inbound traffic:`,
  'cc-pricing-product-consumption.number': ({ number }) => formatNumber(lang, number),
  'cc-pricing-product-consumption.outbound-traffic.label': `traffic out`,
  'cc-pricing-product-consumption.outbound-traffic.title': `Outbound traffic:`,
  'cc-pricing-product-consumption.price': ({ price, code }) => `${formatCurrency(lang, price, { currency: code })}`,
  'cc-pricing-product-consumption.price-interval.bytes': ({ price, code }) => {
    const priceInterval = formatCurrency(lang, price, {
      minimumFractionDigits: 3, maximumFractionDigits: 3, currency: code,
    });
    const priceOneGigabyte = getUnit(1e9);
    return `${priceInterval} / ${priceOneGigabyte} (30 days)`;
  },
  'cc-pricing-product-consumption.price-interval.free': `FREE`,
  'cc-pricing-product-consumption.price-interval.users': ({ userCount, price, code }) => {
    const users = plural(userCount, 'user');
    const priceInterval = formatCurrency(lang, price * userCount, { currency: code });
    return `${priceInterval} / ${userCount} ${users} (30 days)`;
  },
  'cc-pricing-product-consumption.private-users.label': `private users`,
  'cc-pricing-product-consumption.private-users.title': `Private users:`,
  'cc-pricing-product-consumption.public-users.label': `public users`,
  'cc-pricing-product-consumption.public-users.title': `Public users:`,
  'cc-pricing-product-consumption.quantity': `Quantity`,
  'cc-pricing-product-consumption.size': ({ bytes }) => `Size (in ${getUnit(bytes)})`,
  'cc-pricing-product-consumption.storage.label': `storage`,
  'cc-pricing-product-consumption.storage.title': `Storage:`,
  'cc-pricing-product-consumption.subtotal.title': `Subtotal (30 days):`,
  'cc-pricing-product-consumption.toggle-btn.label': `Show more details`,
  'cc-pricing-product-consumption.total.title': `Estimated total (30 days):`,
  'cc-pricing-product-consumption.unit': `Unit`,
  //#endregion
  //#region cc-select
  'cc-select.required': `required`,
  //#endregion
  //#region cc-ssh-key-list
  'cc-ssh-key-list.add.btn': `Add key`,
  'cc-ssh-key-list.add.info': () => sanitize`<p>You need to associate an SSH key to your account to deploy via Git. Use this form to do so.</p><p>You can create an SSH key with the following command:</p><code>ssh-keygen -t ed25519 -C "my-email@example.com"</code><p>The generated public key is written in the "*.pub" file.</p>`,
  'cc-ssh-key-list.add.name': `Name`,
  'cc-ssh-key-list.add.public-key': `Public key`,
  'cc-ssh-key-list.add.title': `Add a new key`,
  'cc-ssh-key-list.doc.info': () => sanitize`If you need any help, head up to our <a href="https://www.clever-cloud.com/doc/admin-console/ssh-keys/">documentation</a>.`,
  'cc-ssh-key-list.error.add': ({ name }) => `An error occurred while adding your new personal key "${name}".`,
  'cc-ssh-key-list.error.delete': ({ name }) => `An error occurred while deleting your personal key "${name}".`,
  'cc-ssh-key-list.error.import': ({ name }) => `An error occurred while importing your GitHub key "${name}".`,
  'cc-ssh-key-list.error.loading': `An error occurred while loading your keys.`,
  'cc-ssh-key-list.error.private-key': `Invalid format: did you enter your private key instead of your public key?`,
  'cc-ssh-key-list.error.required.name': `Please enter a name for your SSH key`,
  'cc-ssh-key-list.error.required.public-key': `Please enter the public key value`,
  'cc-ssh-key-list.github.empty': `There are no SSH keys available for import from your GitHub account.`,
  'cc-ssh-key-list.github.import': `Import`,
  'cc-ssh-key-list.github.import.a11y': ({ name }) => `Import the GitHub SSH key - ${name}`,
  'cc-ssh-key-list.github.info': () => sanitize`<p>These are the SSH keys from your GitHub account. You can import them to associate them to your Clever Cloud account.</p>`,
  'cc-ssh-key-list.github.title': `GitHub keys`,
  'cc-ssh-key-list.github.unlinked': () => sanitize`There is no GitHub account linked to your Clever Cloud account. You may link your accounts from your <a href="./information">profile</a> page.`,
  'cc-ssh-key-list.personal.delete': `Delete`,
  'cc-ssh-key-list.personal.delete.a11y': ({ name }) => `Delete your personal SSH key - ${name}`,
  'cc-ssh-key-list.personal.empty': `There are no SSH keys associated with your account.`,
  'cc-ssh-key-list.personal.info': () => sanitize`<p>These are the SSH keys associated with your account.</p><p>If you want to check whether a key is already associated or not, you can list the fingerprints of your local keys with the following command:</p><code>ssh-add -l -E sha256</code>`,
  'cc-ssh-key-list.personal.title': `Your keys`,
  'cc-ssh-key-list.success.add': ({ name }) => sanitize`Your key <strong>${name}</strong> has been added successfully.`,
  'cc-ssh-key-list.success.delete': ({ name }) => sanitize`Your key <strong>${name}</strong> has been deleted successfully.`,
  'cc-ssh-key-list.success.import': ({ name }) => sanitize`Your key <strong>${name}</strong> has been imported successfully.`,
  'cc-ssh-key-list.title': `SSH Keys`,
  //#endregion
  //#region cc-tcp-redirection
  'cc-tcp-redirection.create-button': `Create`,
  'cc-tcp-redirection.delete-button': `Delete`,
  'cc-tcp-redirection.namespace-additionaldescription-cleverapps': () => sanitize`This namespace is used by all <em>cleverapps.io</em> domains (e.g. <em>my-app.cleverapps.io</em>).`,
  'cc-tcp-redirection.namespace-additionaldescription-default': () => sanitize`This namespace is used by all custom domains (e.g. <em>my-app.com</em>).`,
  'cc-tcp-redirection.namespace-private': `This is your private namespace.`,
  'cc-tcp-redirection.redirection-defined': ({ namespace, sourcePort }) => {
    return sanitize`This application has a redirection from port <code>${sourcePort}</code> to port <code>4040</code> in the <strong>${namespace}</strong> namespace.`;
  },
  'cc-tcp-redirection.redirection-not-defined': ({ namespace }) => sanitize`You can create a redirection in the <strong>${namespace}</strong> namespace.`,
  //#endregion
  //#region cc-tcp-redirection-form
  'cc-tcp-redirection-form.create.error': ({ namespace }) => {
    return sanitize`Something went wrong while creating a TCP redirection in the <strong>${namespace}</strong> namespace.`;
  },
  'cc-tcp-redirection-form.create.success': ({ namespace }) => {
    return sanitize`The TCP redirection in the <strong>${namespace}</strong> namespace has been created successfully.`;
  },
  'cc-tcp-redirection-form.delete.error': ({ namespace }) => {
    return sanitize`Something went wrong while deleting the TCP redirection in the <strong>${namespace}</strong> namespace.`;
  },
  'cc-tcp-redirection-form.delete.success': ({ namespace }) => {
    return sanitize`The TCP redirection in the <strong>${namespace}</strong> namespace has been deleted successfully.`;
  },
  'cc-tcp-redirection-form.description': () => sanitize`
    <p>
      A TCP redirection allows you to route external traffic to the <code>4040</code> port of the application.<br>
      You can create one TCP redirection per application for each namespace you have access to.
    </p>
    <p>
      A namespace is a group of load balancers: either the default public ones, cleverapps.io, or dedicated ones if you are a Clever Cloud Premium customer.<br>
      Find out more details on the <a href="https://www.clever-cloud.com/doc/administrate/tcp-redirections/">documentation page for TCP redirections</a>.
    </p>
  `,
  'cc-tcp-redirection-form.empty': `You do not have access to any namespaces.`,
  'cc-tcp-redirection-form.error': `Something went wrong while loading TCP redirections.`,
  'cc-tcp-redirection-form.title': `TCP Redirections`,
  //#endregion
  //#region cc-tile-deployments
  'cc-tile-deployments.empty': `No deployments yet.`,
  'cc-tile-deployments.error': `Something went wrong while loading deployments info.`,
  'cc-tile-deployments.error.icon-a11y-name': `Warning`,
  'cc-tile-deployments.state.cancelled': `Cancelled`,
  'cc-tile-deployments.state.failed': `Failed`,
  'cc-tile-deployments.state.started': `Started`,
  'cc-tile-deployments.state.stopped': `Stopped`,
  'cc-tile-deployments.title': `Last deployments`,
  //#endregion
  //#region cc-tile-instances
  'cc-tile-instances.empty': `No instances. Your app is stopped.`,
  'cc-tile-instances.error': `Something went wrong while loading instances.`,
  'cc-tile-instances.error.icon-a11y-name': `Warning`,
  'cc-tile-instances.status.deploying': `Deploying`,
  'cc-tile-instances.status.running': `Running`,
  'cc-tile-instances.title': `Instances`,
  //#endregion
  //#region cc-tile-metrics
  'cc-tile-metrics.a11y.table-header.cpu': `CPU usage over 24h`,
  'cc-tile-metrics.a11y.table-header.mem': `RAM usage over 24h`,
  'cc-tile-metrics.a11y.table-header.timestamp': `Timestamp`,
  'cc-tile-metrics.about-btn': `Show details about this chart`,
  'cc-tile-metrics.close-btn': `Display chart`,
  'cc-tile-metrics.docs.more-metrics': `More metrics: `,
  'cc-tile-metrics.docs.msg': () => sanitize`<p>Server metrics received in the last 24 hours.</p> 
    <p>Each bar represents a time window of <strong>1 hour</strong>.</p>
    <p>The percentage shown is the average over the last hour.</p>`,
  'cc-tile-metrics.empty': `No metrics. Application is stopped.`,
  'cc-tile-metrics.error': `Something went wrong while loading metrics.`,
  'cc-tile-metrics.error.icon-a11y-name': `Warning`,
  'cc-tile-metrics.grafana': `Grafana`,
  'cc-tile-metrics.legend.cpu': `CPU usage over 24h`,
  'cc-tile-metrics.legend.mem': `RAM usage over 24h`,
  'cc-tile-metrics.link-to-grafana': `Open Grafana`,
  'cc-tile-metrics.link-to-metrics': `Open Metrics`,
  'cc-tile-metrics.metrics-link': `Metrics`,
  'cc-tile-metrics.percent': ({ percent }) => formatPercent(lang, percent),
  'cc-tile-metrics.timestamp-format': ({ timestamp }) => formatDate(lang, timestamp),
  'cc-tile-metrics.title': `Server metrics`,
  //#endregion
  //#region cc-tile-requests
  'cc-tile-requests.about-btn': `About this chart...`,
  'cc-tile-requests.close-btn': `Display chart`,
  'cc-tile-requests.date-hours': ({ date }) => formatHours(lang, date),
  'cc-tile-requests.date-tooltip': ({ from, to }) => {
    const date = formatDateOnly(lang, from);
    const fromH = formatHours(lang, from);
    const toH = formatHours(lang, to);
    return `${date}: from ${fromH} to ${toH}`;
  },
  'cc-tile-requests.docs.msg': ({ windowHours }) => {
    const hour = plural(windowHours, 'hour');
    return sanitize`HTTP requests received in the last 24 hours. Each bar represents a time window of <strong>${windowHours} ${hour}</strong>.`;
  },
  'cc-tile-requests.empty': `No data to display for now.`,
  'cc-tile-requests.error': `Something went wrong while loading HTTP requests.`,
  'cc-tile-requests.error.icon-a11y-name': `Warning`,
  'cc-tile-requests.requests-count': ({ requestCount }) => formatNumberUnit(requestCount),
  'cc-tile-requests.requests-nb': ({ value, windowHours }) => {
    const request = plural(value, 'request');
    const hour = plural(windowHours, 'hour');
    const formattedValue = formatNumber(lang, value);
    return `${formattedValue} ${request} (in ${windowHours} ${hour})`;
  },
  'cc-tile-requests.requests-nb.total': ({ totalRequests }) => {
    const request = plural(totalRequests, 'request');
    const formattedValue = formatNumberUnit(totalRequests);
    return `${formattedValue} ${request} in 24 hours`;
  },
  'cc-tile-requests.title': `HTTP requests`,
  //#endregion
  //#region cc-tile-scalability
  'cc-tile-scalability.error': `Something went wrong while loading scalability config.`,
  'cc-tile-scalability.error.icon-a11y-name': `Warning`,
  'cc-tile-scalability.flavor-info': (flavor) => formatFlavor(flavor),
  'cc-tile-scalability.number': `Number`,
  'cc-tile-scalability.size': `Size`,
  'cc-tile-scalability.title': `Scalability`,
  //#endregion
  //#region cc-tile-status-codes
  'cc-tile-status-codes.about-btn': `About this chart...`,
  'cc-tile-status-codes.close-btn': `Display chart`,
  'cc-tile-status-codes.docs.link': () => sanitize`<a href="https://developer.mozilla.org/en/docs/Web/HTTP/Status">HTTP response status codes (MDN)</a>`,
  'cc-tile-status-codes.docs.msg': `Repartition of HTTP response codes returned in the last 24 hours. Click on legend items to show/hide HTTP code categories.`,
  'cc-tile-status-codes.empty': `No data to display for now.`,
  'cc-tile-status-codes.error': `Something went wrong while loading HTTP response codes.`,
  'cc-tile-status-codes.error.icon-a11y-name': `Warning`,
  'cc-tile-status-codes.title': `HTTP response codes`,
  'cc-tile-status-codes.tooltip': ({ value, percent }) => {
    const request = plural(value, 'request');
    const formattedValue = formatNumber(lang, value);
    return `${formattedValue} ${request} (${formatPercent(lang, percent)})`;
  },
  //#endregion
  //#region cc-toast
  'cc-toast.close': `Close this notification`,
  'cc-toast.icon-alt.danger': `Error`,
  'cc-toast.icon-alt.info': `Information`,
  'cc-toast.icon-alt.success': `Success`,
  'cc-toast.icon-alt.warning': `Warning`,
  //#endregion
  //#region cc-zone
  'cc-zone.country': ({ code, name }) => getCountryName(lang, code, name),
  //#endregion
  //#region cc-zone-input
  'cc-zone-input.error': `Something went wrong while loading zones.`,
  'cc-zone-input.private-map-warning': `Private zones don't appear on the map.`,
  //#endregion
};

// this file is auto generated. Do not edit manually.
import {
  CcAddonDeleteEvent,
  CcAddonNameChangeEvent,
  CcAddonTagsChangeEvent,
} from '../components/cc-addon-admin/cc-addon-admin.events.js';
import { CcAddonElasticsearchOptionsSubmitEvent } from '../components/cc-addon-elasticsearch-options/cc-addon-elasticsearch-options.events.js';
import { CcAddonJenkinsOptionsSubmitEvent } from '../components/cc-addon-jenkins-options/cc-addon-jenkins-options.events.js';
import { CcAddonMongodbOptionsSubmitEvent } from '../components/cc-addon-mongodb-options/cc-addon-mongodb-options.events.js';
import { CcAddonMysqlOptionsSubmitEvent } from '../components/cc-addon-mysql-options/cc-addon-mysql-options.events.js';
import { CcAddonOptionFormSubmitEvent } from '../components/cc-addon-option-form/cc-addon-option-form.events.js';
import { CcAddonOptionChangeEvent } from '../components/cc-addon-option/cc-addon-option.events.js';
import { CcAddonPostgresqlOptionsSubmitEvent } from '../components/cc-addon-postgresql-options/cc-addon-postgresql-options.events.js';
import { CcAddonRedisOptionsSubmitEvent } from '../components/cc-addon-redis-options/cc-addon-redis-options.events.js';
import {
  CcDomainAddEvent,
  CcDomainDeleteEvent,
  CcDomainMarkAsPrimaryEvent,
} from '../components/cc-domain-management/cc-domain-management.events.js';
import {
  CcEmailAddEvent,
  CcEmailDeleteEvent,
  CcEmailMarkAsPrimaryEvent,
  CcEmailSendConfirmationEvent,
} from '../components/cc-email-list/cc-email-list.events.js';
import { CcEnvVarCreateEvent } from '../components/cc-env-var-create/cc-env-var-create.events.js';
import { CcEnvChangeEvent, CcEnvVarFormSubmitEvent } from '../components/cc-env-var-form/cc-env-var-form.events.js';
import {
  CcEnvVarChangeEvent,
  CcEnvVarDeleteEvent,
  CcEnvVarKeepEvent,
} from '../components/cc-env-var-input/cc-env-var-input.events.js';
import { CcGrafanaResetEvent, CcGrafanaToggleEvent } from '../components/cc-grafana-info/cc-grafana-info.events.js';
import {
  CcApplicationDeployCancelEvent,
  CcApplicationRestartEvent,
  CcApplicationStartEvent,
  CcApplicationStopEvent,
} from '../components/cc-header-app/cc-header-app.events.js';
import { CcDateChangeEvent } from '../components/cc-input-date/cc-input-date.events.js';
import { CcNumberChangeEvent } from '../components/cc-input-number/cc-input-number.events.js';
import { CcTagsChangeEvent, CcTextChangeEvent } from '../components/cc-input-text/cc-input-text.events.js';
import {
  CcKvFilterChangeEvent,
  CcKvKeyAddEvent,
  CcKvKeyDeleteEvent,
  CcKvKeysRefreshEvent,
  CcKvLoadMoreKeysEvent,
  CcKvSelectedKeyChangeEvent,
} from '../components/cc-kv-explorer/cc-kv-explorer.events.js';
import {
  CcKvHashElementAddEvent,
  CcKvHashElementDeleteEvent,
  CcKvHashElementUpdateEvent,
  CcKvHashExplorerStateChangeEvent,
  CcKvHashFilterChangeEvent,
  CcKvHashLoadMoreEvent,
} from '../components/cc-kv-hash-explorer/cc-kv-hash-explorer.events.js';
import {
  CcKvListElementAddEvent,
  CcKvListElementUpdateEvent,
  CcKvListExplorerStateChangeEvent,
  CcKvListFilterChangeEvent,
  CcKvListLoadMoreEvent,
} from '../components/cc-kv-list-explorer/cc-kv-list-explorer.events.js';
import {
  CcKvSetElementAddEvent,
  CcKvSetElementDeleteEvent,
  CcKvSetFilterChangeEvent,
  CcKvSetLoadMoreEvent,
} from '../components/cc-kv-set-explorer/cc-kv-set-explorer.events.js';
import { CcKvStringValueChangeEvent } from '../components/cc-kv-string-editor/cc-kv-string-editor.events.js';
import {
  CcKvTerminalCommandSendEvent,
  CcKvTerminalStateChangeEvent,
} from '../components/cc-kv-terminal/cc-kv-terminal.events.js';
import {
  CcLogsOptionChangeEvent,
  CcLogsOptionsChangeEvent,
} from '../components/cc-logs-control/cc-logs-control.events.js';
import { CcLogsDateRangeSelectionChangeEvent } from '../components/cc-logs-date-range-selector/cc-logs-date-range-selector.events.js';
import { CcLogsInstancesSelectionChangeEvent } from '../components/cc-logs-instances/cc-logs-instances.events.js';
import {
  CcLogsLoadingOverflowAcceptEvent,
  CcLogsLoadingOverflowDiscardEvent,
  CcLogsLoadingPauseEvent,
  CcLogsLoadingResumeEvent,
} from '../components/cc-logs-loading-progress/cc-logs-loading-progress.events.js';
import { CcLogsMessageFilterChangeEvent } from '../components/cc-logs-message-filter/cc-logs-message-filter.events.js';
import { CcLogsFollowChangeEvent } from '../components/cc-logs/cc-logs.events.js';
import { CcLogsmapModeChangeEvent } from '../components/cc-logsmap/cc-logsmap.events.js';
import {
  CcMapMarkerClickEvent,
  CcMapMarkerEnterEvent,
  CcMapMarkerLeaveEvent,
} from '../components/cc-map/cc-map.events.js';
import { CcNoticeDismissEvent } from '../components/cc-notice/cc-notice.events.js';
import { CcProductCreateEvent } from '../components/cc-order-summary/cc-order-summary.events.js';
import {
  CcOrgaMemberDeleteEvent,
  CcOrgaMemberEditToggleEvent,
  CcOrgaMemberLeaveEvent,
  CcOrgaMemberUpdateEvent,
} from '../components/cc-orga-member-card/cc-orga-member-card.events.js';
import { CcOrgaMemberInviteEvent } from '../components/cc-orga-member-list/cc-orga-member-list.events.js';
import {
  CcPricingCurrencyChangeEvent,
  CcPricingPlanAddEvent,
  CcPricingPlanDeleteEvent,
  CcPricingQuantityChangeEvent,
  CcPricingTemporalityChangeEvent,
  CcPricingZoneChangeEvent,
} from '../components/cc-pricing-page/cc-pricing-page.events.js';
import {
  CcSshKeyCreateEvent,
  CcSshKeyDeleteEvent,
  CcSshKeyImportEvent,
} from '../components/cc-ssh-key-list/cc-ssh-key-list.events.js';
import {
  CcTcpRedirectionCreateEvent,
  CcTcpRedirectionDeleteEvent,
} from '../components/cc-tcp-redirection/cc-tcp-redirection.events.js';
import { CcToastDismissEvent } from '../components/cc-toast/cc-toast.events.js';
import { CcToggleChangeEvent } from '../components/cc-toggle/cc-toggle.events.js';
import {
  CcClickEvent,
  CcMultiSelectEvent,
  CcRequestSubmitEvent,
  CcSelectEvent,
  CcToggleEvent,
} from '../components/common.events.js';
import { CcErrorMessageChangeEvent, CcFormInvalidEvent, CcFormValidEvent } from './form/form.events.js';
import { CcNotifyEvent } from './notifications.events.js';
import { CcApiErrorEvent } from './send-to-api.events.js';

declare global {
  class CcEvent<T> extends CustomEvent<T> {
    constructor(detail: T);
  }

  interface HTMLElementEventMap {
    'cc-addon-delete': CcAddonDeleteEvent;
    'cc-addon-elasticsearch-options-submit': CcAddonElasticsearchOptionsSubmitEvent;
    'cc-addon-jenkins-options-submit': CcAddonJenkinsOptionsSubmitEvent;
    'cc-addon-mongodb-options-submit': CcAddonMongodbOptionsSubmitEvent;
    'cc-addon-mysql-options-submit': CcAddonMysqlOptionsSubmitEvent;
    'cc-addon-name-change': CcAddonNameChangeEvent;
    'cc-addon-option-change': CcAddonOptionChangeEvent;
    'cc-addon-option-form-submit': CcAddonOptionFormSubmitEvent;
    'cc-addon-postgresql-options-submit': CcAddonPostgresqlOptionsSubmitEvent;
    'cc-addon-redis-options-submit': CcAddonRedisOptionsSubmitEvent;
    'cc-addon-tags-change': CcAddonTagsChangeEvent;
    'cc-api-error': CcApiErrorEvent;
    'cc-application-deploy-cancel': CcApplicationDeployCancelEvent;
    'cc-application-restart': CcApplicationRestartEvent;
    'cc-application-start': CcApplicationStartEvent;
    'cc-application-stop': CcApplicationStopEvent;
    'cc-click': CcClickEvent;
    'cc-date-change': CcDateChangeEvent;
    'cc-domain-add': CcDomainAddEvent;
    'cc-domain-delete': CcDomainDeleteEvent;
    'cc-domain-mark-as-primary': CcDomainMarkAsPrimaryEvent;
    'cc-email-add': CcEmailAddEvent;
    'cc-email-delete': CcEmailDeleteEvent;
    'cc-email-mark-as-primary': CcEmailMarkAsPrimaryEvent;
    'cc-email-send-confirmation': CcEmailSendConfirmationEvent;
    'cc-env-change': CcEnvChangeEvent;
    'cc-env-var-change': CcEnvVarChangeEvent;
    'cc-env-var-create': CcEnvVarCreateEvent;
    'cc-env-var-delete': CcEnvVarDeleteEvent;
    'cc-env-var-form-submit': CcEnvVarFormSubmitEvent;
    'cc-env-var-keep': CcEnvVarKeepEvent;
    'cc-error-message-change': CcErrorMessageChangeEvent;
    'cc-form-invalid': CcFormInvalidEvent;
    'cc-form-valid': CcFormValidEvent;
    'cc-grafana-reset': CcGrafanaResetEvent;
    'cc-grafana-toggle': CcGrafanaToggleEvent;
    'cc-kv-explorer-load-more-keys': CcKvLoadMoreKeysEvent;
    'cc-kv-filter-change': CcKvFilterChangeEvent;
    'cc-kv-hash-element-add': CcKvHashElementAddEvent;
    'cc-kv-hash-element-delete': CcKvHashElementDeleteEvent;
    'cc-kv-hash-element-update': CcKvHashElementUpdateEvent;
    'cc-kv-hash-explorer-state-change': CcKvHashExplorerStateChangeEvent;
    'cc-kv-hash-filter-change': CcKvHashFilterChangeEvent;
    'cc-kv-hash-load-more': CcKvHashLoadMoreEvent;
    'cc-kv-key-add': CcKvKeyAddEvent;
    'cc-kv-key-delete': CcKvKeyDeleteEvent;
    'cc-kv-keys-refresh': CcKvKeysRefreshEvent;
    'cc-kv-list-element-add': CcKvListElementAddEvent;
    'cc-kv-list-element-update': CcKvListElementUpdateEvent;
    'cc-kv-list-explorer-state-change': CcKvListExplorerStateChangeEvent;
    'cc-kv-list-filter-change': CcKvListFilterChangeEvent;
    'cc-kv-list-load-more': CcKvListLoadMoreEvent;
    'cc-kv-selected-key-change': CcKvSelectedKeyChangeEvent;
    'cc-kv-set-element-add': CcKvSetElementAddEvent;
    'cc-kv-set-element-delete': CcKvSetElementDeleteEvent;
    'cc-kv-set-filter-change': CcKvSetFilterChangeEvent;
    'cc-kv-set-load-more': CcKvSetLoadMoreEvent;
    'cc-kv-string-value-change': CcKvStringValueChangeEvent;
    'cc-kv-terminal-command-send': CcKvTerminalCommandSendEvent;
    'cc-kv-terminal-state-change': CcKvTerminalStateChangeEvent;
    'cc-logs-date-range-selection-change': CcLogsDateRangeSelectionChangeEvent;
    'cc-logs-follow-change': CcLogsFollowChangeEvent;
    'cc-logs-instances-selection-change': CcLogsInstancesSelectionChangeEvent;
    'cc-logs-loading-overflow-accept': CcLogsLoadingOverflowAcceptEvent;
    'cc-logs-loading-overflow-discard': CcLogsLoadingOverflowDiscardEvent;
    'cc-logs-loading-pause': CcLogsLoadingPauseEvent;
    'cc-logs-loading-resume': CcLogsLoadingResumeEvent;
    'cc-logs-message-filter-change': CcLogsMessageFilterChangeEvent;
    'cc-logs-option-change': CcLogsOptionChangeEvent;
    'cc-logs-options-change': CcLogsOptionsChangeEvent;
    'cc-logsmap-mode-change': CcLogsmapModeChangeEvent;
    'cc-map-marker-click': CcMapMarkerClickEvent;
    'cc-map-marker-enter': CcMapMarkerEnterEvent;
    'cc-map-marker-leave': CcMapMarkerLeaveEvent;
    'cc-multi-select': CcMultiSelectEvent;
    'cc-notice-dismiss': CcNoticeDismissEvent;
    'cc-notify': CcNotifyEvent;
    'cc-number-change': CcNumberChangeEvent;
    'cc-orga-member-delete': CcOrgaMemberDeleteEvent;
    'cc-orga-member-edit-toggle': CcOrgaMemberEditToggleEvent;
    'cc-orga-member-invite': CcOrgaMemberInviteEvent;
    'cc-orga-member-leave': CcOrgaMemberLeaveEvent;
    'cc-orga-member-update': CcOrgaMemberUpdateEvent;
    'cc-pricing-currency-change': CcPricingCurrencyChangeEvent;
    'cc-pricing-plan-add': CcPricingPlanAddEvent;
    'cc-pricing-plan-delete': CcPricingPlanDeleteEvent;
    'cc-pricing-quantity-change': CcPricingQuantityChangeEvent;
    'cc-pricing-temporality-change': CcPricingTemporalityChangeEvent;
    'cc-pricing-zone-change': CcPricingZoneChangeEvent;
    'cc-product-create': CcProductCreateEvent;
    'cc-request-submit': CcRequestSubmitEvent;
    'cc-select': CcSelectEvent;
    'cc-ssh-key-create': CcSshKeyCreateEvent;
    'cc-ssh-key-delete': CcSshKeyDeleteEvent;
    'cc-ssh-key-import': CcSshKeyImportEvent;
    'cc-tags-change': CcTagsChangeEvent;
    'cc-tcp-redirection-create': CcTcpRedirectionCreateEvent;
    'cc-tcp-redirection-delete': CcTcpRedirectionDeleteEvent;
    'cc-text-change': CcTextChangeEvent;
    'cc-toast-dismiss': CcToastDismissEvent;
    'cc-toggle': CcToggleEvent;
    'cc-toggle-change': CcToggleChangeEvent;
  }
}

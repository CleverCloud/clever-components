// This file is auto-generated. Do not edit manually.
import {
  CcAddonDeleteEvent,
  CcAddonNameChangeEvent,
  CcAddonTagsChangeEvent,
} from '../components/cc-addon-admin/cc-addon-admin.events.js';
import { CcAddonOptionFormSubmitEvent } from '../components/cc-addon-option-form/cc-addon-option-form.events.js';
import { CcAddonOptionChangeEvent } from '../components/cc-addon-option/cc-addon-option.events.js';
import {
  CcDomainAddEvent,
  CcDomainDeleteEvent,
  CcDomainMarkAsPrimaryEvent,
  CcDomainPrimaryChangeEvent,
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
import { CcHeaderAddonBetaRestartEvent } from '../components/cc-header-addon-beta/cc-header-addon-beta.events.js';
import {
  CcApplicationRestartEvent,
  CcApplicationStartEvent,
  CcApplicationStopEvent,
  CcDeploymentCancelEvent,
} from '../components/cc-header-app/cc-header-app.events.js';
import { CcTagsChangeEvent } from '../components/cc-input-text/cc-input-text.events.js';
import {
  CcKvKeyAddEvent,
  CcKvKeyDeleteEvent,
  CcKvKeyFilterChangeEvent,
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
import { CcKvStringValueUpdateEvent } from '../components/cc-kv-string-editor/cc-kv-string-editor.events.js';
import {
  CcKvCommandExecuteEvent,
  CcKvTerminalStateChangeEvent,
} from '../components/cc-kv-terminal/cc-kv-terminal.events.js';
import { CcLogsOptionsChangeEvent } from '../components/cc-logs-control/cc-logs-control.events.js';
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
import {
  CcOauthConsumerChangeEvent,
  CcOauthConsumerCreateEvent,
  CcOauthConsumerDeleteEvent,
  CcOauthConsumerWasCreatedEvent,
  CcOauthConsumerWasDeletedEvent,
  CcOauthConsumerWasUpdatedEvent,
} from '../components/cc-oauth-consumer-form/cc-oauth-consumer-form.events.js';
import { CcProductCreateEvent } from '../components/cc-order-summary/cc-order-summary.events.js';
import {
  CcOrgaMemberDeleteEvent,
  CcOrgaMemberEditToggleEvent,
  CcOrgaMemberLeaveEvent,
  CcOrgaMemberUpdateEvent,
} from '../components/cc-orga-member-card/cc-orga-member-card.events.js';
import {
  CcOrgaMemberInviteEvent,
  CcOrgaMemberLeftEvent,
} from '../components/cc-orga-member-list/cc-orga-member-list.events.js';
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
import { CcTokenCreateEvent } from '../components/cc-token-api-creation-form/cc-token-api-creation-form.events.js';
import {
  CcTokenChangeEvent,
  CcTokenWasUpdatedEvent,
} from '../components/cc-token-api-update-form/cc-token-api-update-form.events.js';
import {
  CcClickEvent,
  CcPasswordResetEvent,
  CcRequestSubmitEvent,
  CcToggleEvent,
  CcTokenRevokeEvent,
  CcTokensRevokeAllEvent,
} from '../components/common.events.js';
import { CcErrorMessageChangeEvent, CcFormInvalidEvent, CcFormValidEvent } from './form/form.events.js';
import { CcNotifyEvent } from './notifications.events.js';
import { CcApiErrorEvent } from './send-to-api.events.js';

declare global {
  class CcEvent<T> extends CustomEvent<T> {
    constructor(type: string, detail?: T);
  }

  class CcInputEvent<T = string> extends CcEvent<T> {}

  class CcSelectEvent<T extends string = string> extends CcEvent<T> {}

  class CcMultiSelectEvent<T extends string = string> extends CcEvent<Array<T>> {}

  interface GlobalEventHandlersEventMap {
    'cc-addon-delete': CcAddonDeleteEvent;
    'cc-addon-name-change': CcAddonNameChangeEvent;
    'cc-addon-option-change': CcAddonOptionChangeEvent;
    'cc-addon-option-form-submit': CcAddonOptionFormSubmitEvent;
    'cc-addon-tags-change': CcAddonTagsChangeEvent;
    'cc-api-error': CcApiErrorEvent;
    'cc-application-restart': CcApplicationRestartEvent;
    'cc-application-start': CcApplicationStartEvent;
    'cc-application-stop': CcApplicationStopEvent;
    'cc-click': CcClickEvent;
    'cc-deployment-cancel': CcDeploymentCancelEvent;
    'cc-domain-add': CcDomainAddEvent;
    'cc-domain-delete': CcDomainDeleteEvent;
    'cc-domain-mark-as-primary': CcDomainMarkAsPrimaryEvent;
    'cc-domain-primary-change': CcDomainPrimaryChangeEvent;
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
    'cc-header-addon-beta-restart': CcHeaderAddonBetaRestartEvent;
    'cc-input': CcInputEvent;
    'cc-kv-command-execute': CcKvCommandExecuteEvent;
    'cc-kv-hash-element-add': CcKvHashElementAddEvent;
    'cc-kv-hash-element-delete': CcKvHashElementDeleteEvent;
    'cc-kv-hash-element-update': CcKvHashElementUpdateEvent;
    'cc-kv-hash-explorer-state-change': CcKvHashExplorerStateChangeEvent;
    'cc-kv-hash-filter-change': CcKvHashFilterChangeEvent;
    'cc-kv-hash-load-more': CcKvHashLoadMoreEvent;
    'cc-kv-key-add': CcKvKeyAddEvent;
    'cc-kv-key-delete': CcKvKeyDeleteEvent;
    'cc-kv-key-filter-change': CcKvKeyFilterChangeEvent;
    'cc-kv-keys-refresh': CcKvKeysRefreshEvent;
    'cc-kv-list-element-add': CcKvListElementAddEvent;
    'cc-kv-list-element-update': CcKvListElementUpdateEvent;
    'cc-kv-list-explorer-state-change': CcKvListExplorerStateChangeEvent;
    'cc-kv-list-filter-change': CcKvListFilterChangeEvent;
    'cc-kv-list-load-more': CcKvListLoadMoreEvent;
    'cc-kv-load-more-keys': CcKvLoadMoreKeysEvent;
    'cc-kv-selected-key-change': CcKvSelectedKeyChangeEvent;
    'cc-kv-set-element-add': CcKvSetElementAddEvent;
    'cc-kv-set-element-delete': CcKvSetElementDeleteEvent;
    'cc-kv-set-filter-change': CcKvSetFilterChangeEvent;
    'cc-kv-set-load-more': CcKvSetLoadMoreEvent;
    'cc-kv-string-value-update': CcKvStringValueUpdateEvent;
    'cc-kv-terminal-state-change': CcKvTerminalStateChangeEvent;
    'cc-logs-date-range-selection-change': CcLogsDateRangeSelectionChangeEvent;
    'cc-logs-follow-change': CcLogsFollowChangeEvent;
    'cc-logs-instances-selection-change': CcLogsInstancesSelectionChangeEvent;
    'cc-logs-loading-overflow-accept': CcLogsLoadingOverflowAcceptEvent;
    'cc-logs-loading-overflow-discard': CcLogsLoadingOverflowDiscardEvent;
    'cc-logs-loading-pause': CcLogsLoadingPauseEvent;
    'cc-logs-loading-resume': CcLogsLoadingResumeEvent;
    'cc-logs-message-filter-change': CcLogsMessageFilterChangeEvent;
    'cc-logs-options-change': CcLogsOptionsChangeEvent;
    'cc-logsmap-mode-change': CcLogsmapModeChangeEvent;
    'cc-map-marker-click': CcMapMarkerClickEvent;
    'cc-map-marker-enter': CcMapMarkerEnterEvent;
    'cc-map-marker-leave': CcMapMarkerLeaveEvent;
    'cc-multi-select': CcMultiSelectEvent;
    'cc-notice-dismiss': CcNoticeDismissEvent;
    'cc-notify': CcNotifyEvent;
    'cc-oauth-consumer-change': CcOauthConsumerChangeEvent;
    'cc-oauth-consumer-create': CcOauthConsumerCreateEvent;
    'cc-oauth-consumer-delete': CcOauthConsumerDeleteEvent;
    'cc-oauth-consumer-was-created': CcOauthConsumerWasCreatedEvent;
    'cc-oauth-consumer-was-deleted': CcOauthConsumerWasDeletedEvent;
    'cc-oauth-consumer-was-updated': CcOauthConsumerWasUpdatedEvent;
    'cc-orga-member-delete': CcOrgaMemberDeleteEvent;
    'cc-orga-member-edit-toggle': CcOrgaMemberEditToggleEvent;
    'cc-orga-member-invite': CcOrgaMemberInviteEvent;
    'cc-orga-member-leave': CcOrgaMemberLeaveEvent;
    'cc-orga-member-left': CcOrgaMemberLeftEvent;
    'cc-orga-member-update': CcOrgaMemberUpdateEvent;
    'cc-password-reset': CcPasswordResetEvent;
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
    'cc-toast-dismiss': CcToastDismissEvent;
    'cc-toggle': CcToggleEvent;
    'cc-token-change': CcTokenChangeEvent;
    'cc-token-create': CcTokenCreateEvent;
    'cc-token-revoke': CcTokenRevokeEvent;
    'cc-token-was-updated': CcTokenWasUpdatedEvent;
    'cc-tokens-revoke-all': CcTokensRevokeAllEvent;
  }
}

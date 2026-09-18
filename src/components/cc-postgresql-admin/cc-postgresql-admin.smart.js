import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcPostgresqlClient } from './cc-postgresql-admin.client.js';
import {
  CcPostgresqlDirectHostWasGeneratedEvent,
  CcPostgresqlPasswordWasResetEvent,
} from './cc-postgresql-admin.events.js';
import './cc-postgresql-admin.js';

/**
 * @import { CcPostgresqlAdmin } from './cc-postgresql-admin.js'
 * @import { PostgresqlAdminAction, PostgresqlAdminStateLoaded } from './cc-postgresql-admin.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-postgresql-admin',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcPostgresqlAdmin>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, addonId } = context;
    const api = new CcPostgresqlClient({ apiConfig, addonId, signal });

    /** @param {PostgresqlAdminAction|null} runningAction */
    const setRunningAction = (runningAction) => {
      updateComponent(
        'state',
        /** @param {PostgresqlAdminStateLoaded} state */ (state) => {
          state.runningAction = runningAction;
        },
      );
    };

    const refreshConnections = () => {
      updateComponent(
        'state',
        /** @param {PostgresqlAdminStateLoaded} state */ (state) => {
          state.connections = { type: 'loading' };
        },
      );

      api
        .getConnections()
        .then(({ count }) => {
          updateComponent(
            'state',
            /** @param {PostgresqlAdminStateLoaded} state */ (state) => {
              state.connections = { type: 'loaded', count };
            },
          );
        })
        .catch((error) => {
          console.error(error);
          updateComponent(
            'state',
            /** @param {PostgresqlAdminStateLoaded} state */ (state) => {
              state.connections = { type: 'error' };
            },
          );
        });
    };

    /**
     * @param {object} params
     * @param {PostgresqlAdminAction} params.action
     * @param {() => Promise<any>} params.call
     * @param {string} params.successMessage
     * @param {string} params.errorMessage
     * @param {(result: any) => void} [params.onSuccess]
     * @param {() => void} [params.onError]
     */
    const runAction = ({ action, call, successMessage, errorMessage, onSuccess, onError }) => {
      setRunningAction(action);

      call()
        .then((result) => {
          setRunningAction(null);
          notifySuccess(successMessage);
          onSuccess?.(result);
        })
        .catch((error) => {
          console.error(error);
          setRunningAction(null);
          notifyError(errorMessage);
          onError?.();
        });
    };

    updateComponent('state', { type: 'loading' });

    api
      .getDashboard()
      .then((dashboard) => {
        updateComponent('state', {
          type: 'loaded',
          capabilities: dashboard.capabilities,
          readOnlyUsers: dashboard.readOnlyUsers,
          connections: { type: 'loading' },
          runningAction: null,
        });
        refreshConnections();
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-postgresql-connections-kill', () => {
      runAction({
        action: 'kill-connections',
        call: () => api.killConnections(),
        successMessage: i18n('cc-postgresql-admin.connections.kill.success'),
        errorMessage: i18n('cc-postgresql-admin.connections.kill.error'),
        onSuccess: refreshConnections,
      });
    });

    onEvent('cc-postgresql-password-reset', () => {
      const notifyPasswordChange = () => component.dispatchEvent(new CcPostgresqlPasswordWasResetEvent());

      runAction({
        action: 'reset-password',
        call: () => api.resetPassword(),
        successMessage: i18n('cc-postgresql-admin.password.reset.success'),
        errorMessage: i18n('cc-postgresql-admin.password.reset.error'),
        onSuccess: notifyPasswordChange,
        // the password may have been changed even though the call failed (the applications linked to
        // the add-on may not have been updated): ask for the credentials to be fetched again anyway
        onError: notifyPasswordChange,
      });
    });

    onEvent('cc-postgresql-database-reset', () => {
      runAction({
        action: 'reset-database',
        call: () => api.resetDatabase(),
        successMessage: i18n('cc-postgresql-admin.reset.success'),
        errorMessage: i18n('cc-postgresql-admin.reset.error'),
        onSuccess: refreshConnections,
      });
    });

    onEvent('cc-postgresql-extension-activate', ({ extension }) => {
      runAction({
        action: 'activate-extension',
        call: () => api.activateExtension(extension),
        successMessage: i18n('cc-postgresql-admin.extension.success', { extension }),
        errorMessage: i18n('cc-postgresql-admin.extension.error', { extension }),
      });
    });

    onEvent('cc-postgresql-read-only-user-create', () => {
      runAction({
        action: 'add-read-only-user',
        call: () => api.addReadOnlyUser(),
        successMessage: i18n('cc-postgresql-admin.read-only-users.create.success'),
        errorMessage: i18n('cc-postgresql-admin.read-only-users.create.error'),
        onSuccess: ({ readOnlyUsers }) => {
          updateComponent(
            'state',
            /** @param {PostgresqlAdminStateLoaded} state */ (state) => {
              state.readOnlyUsers = readOnlyUsers;
            },
          );
        },
      });
    });

    onEvent('cc-postgresql-replica-promote', () => {
      runAction({
        action: 'promote-replica',
        call: () => api.promoteReplica(),
        successMessage: i18n('cc-postgresql-admin.promote.success'),
        errorMessage: i18n('cc-postgresql-admin.promote.error'),
        onSuccess: () => {
          updateComponent(
            'state',
            /** @param {PostgresqlAdminStateLoaded} state */ (state) => {
              state.capabilities = { ...state.capabilities, promoteReplica: false, requestReplication: true };
            },
          );
        },
      });
    });

    onEvent('cc-postgresql-direct-host-generate', () => {
      runAction({
        action: 'generate-direct-host',
        call: () => api.generateDirectHost(),
        successMessage: i18n('cc-postgresql-admin.direct-host.success'),
        errorMessage: i18n('cc-postgresql-admin.direct-host.error'),
        onSuccess: () => component.dispatchEvent(new CcPostgresqlDirectHostWasGeneratedEvent()),
      });
    });

    onEvent('cc-postgresql-instances-reboot', () => {
      runAction({
        action: 'reboot-instances',
        call: () => api.rebootInstances(),
        successMessage: i18n('cc-postgresql-admin.reboot.success'),
        errorMessage: i18n('cc-postgresql-admin.reboot.error'),
      });
    });
  },
});

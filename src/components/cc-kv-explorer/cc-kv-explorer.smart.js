import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-kv-explorer.js';
import { KvClient } from './kv-client.js';
import { KvDetailsCtrl } from './kv-details-ctrl.js';
import { KvKeysCtrl } from './kv-keys-ctrl.js';
import { KvTerminalCtrl } from './kv-terminal-ctrl.js';

/**
 * @typedef {import('./cc-kv-explorer.js').CcKvExplorer} CcKvExplorer
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerState} CcKvExplorerState
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerStateLoaded} CcKvExplorerStateLoaded
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerStateLoadingKeys} CcKvExplorerStateLoadingKeys
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerDetailState} CcKvExplorerDetailState
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerDetailStateAdd} CcKvExplorerDetailStateAdd
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerDetailStateEdit} CcKvExplorerDetailStateEdit
 * @typedef {import('./kv-key-editor-hash-ctrl.js').KvKeyEditorHashCtrl} KvKeyEditorHashCtrl
 * @typedef {import('./kv-key-editor-list-ctrl.js').KvKeyEditorListCtrl} KvKeyEditorListCtrl
 * @typedef {import('./kv-key-editor-set-ctrl.js').KvKeyEditorSetCtrl} KvKeyEditorSetCtrl
 * @typedef {import('./kv-key-editor-string-ctrl.js').KvKeyEditorStringCtrl} KvKeyEditorStringCtrl
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcKvExplorer>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-kv-explorer-beta',
  params: {
    kvApiConfig: { type: Object },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  async onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { kvApiConfig } = context;
    const kvClient = new KvClient(kvApiConfig);

    const keysCtrl = new KvKeysCtrl(
      component,
      (stateUpdater) => {
        updateComponent('state', stateUpdater);
      },
      kvClient,
    );
    const detailsCtrl = new KvDetailsCtrl(
      component,
      (stateUpdater) => {
        updateComponent('detailState', stateUpdater);
      },
      kvClient,
    );
    const terminalCtrl = new KvTerminalCtrl(
      component,
      (stateUpdater) => {
        updateComponent('terminalState', stateUpdater);
      },
      kvClient,
    );

    signal.onabort = () => {
      kvClient.close();
      keysCtrl.abort();
      detailsCtrl.abort();
    };

    // -- keys ---

    onEvent('cc-kv-key-filter-change', async ({ type, pattern }) => {
      try {
        await keysCtrl.filter(type, pattern);
      } catch (e) {
        console.error(e);
        updateComponent('state', { type: 'error-keys', action: 'filtering' });
      }
    });

    onEvent('cc-kv-keys-refresh', async () => {
      try {
        await keysCtrl.refresh();
      } catch (e) {
        console.error(e);
        updateComponent('state', { type: 'error-keys', action: 'refreshing' });
      }
    });

    onEvent('cc-kv-load-more-keys', async () => {
      try {
        await keysCtrl.loadMore();
      } catch (e) {
        console.error(e);
        updateComponent('state', { type: 'error-keys', action: 'loading-more' });
      }
    });

    onEvent('cc-kv-selected-key-change', async (key) => {
      if (keysCtrl.select(key)) {
        try {
          await detailsCtrl.load(key);
        } catch (e) {
          checkIfKeyNotFoundOrElse(e, () => {
            notifyError(i18n('cc-kv-explorer.error.get-key'));
            keysCtrl.clearSelection();
            detailsCtrl.hide();
          });
        }
      }
    });

    onEvent('cc-kv-key-delete', async (key) => {
      try {
        await keysCtrl.delete(key);
        notifySuccess(i18n('cc-kv-explorer.success.delete-key'));

        if (detailsCtrl.keyName === key) {
          detailsCtrl.hide();
        }
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-explorer.error.delete-key'));
        });
      }
    });

    onEvent('cc-kv-key-add', async (keyValue) => {
      try {
        await detailsCtrl.add(keyValue);

        keysCtrl.add({ name: keyValue.name, type: keyValue.type });

        notifySuccess(i18n('cc-kv-explorer.success.add-key'));
      } catch (e) {
        console.error(e);
        notifyError(i18n('cc-kv-explorer.error.add-key'));
      }
    });

    // -- string ---

    onEvent('cc-kv-string-value-update', async (value) => {
      const editorCtrl = /** @type {KvKeyEditorStringCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.save(value);

        notifySuccess(i18n('cc-kv-string-editor.success.update-value'));
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-string-editor.error.update-value'));
        });
      }
    });

    // -- hash ---

    onEvent('cc-kv-hash-filter-change', async (pattern) => {
      const editorCtrl = /** @type {KvKeyEditorHashCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.filter(pattern);
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-hash-explorer.error.apply-filter'));
        });
      }
    });

    onEvent('cc-kv-hash-load-more', async () => {
      const editorCtrl = /** @type {KvKeyEditorHashCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.loadMore();
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-hash-explorer.error.fetch-elements'));
        });
      }
    });

    onEvent('cc-kv-hash-element-delete', async (field) => {
      const editorCtrl = /** @type {KvKeyEditorHashCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.deleteElement(field);
        notifySuccess(i18n('cc-kv-hash-explorer.success.element-delete'));
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-hash-explorer.error.element-delete'));
        });
      }
    });

    onEvent('cc-kv-hash-element-update', async ({ field, value }) => {
      const editorCtrl = /** @type {KvKeyEditorHashCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.updateElement(field, value);
        notifySuccess(i18n('cc-kv-hash-explorer.success.element-update'));
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-hash-explorer.error.element-update'));
        });
      }
    });

    onEvent('cc-kv-hash-element-add', async ({ field, value }) => {
      const editorCtrl = /** @type {KvKeyEditorHashCtrl} */ (detailsCtrl.editorCtrl);

      try {
        const added = await editorCtrl.addElement(field, value);

        if (added) {
          notifySuccess(i18n('cc-kv-hash-explorer.success.element-add'));
        } else {
          notifySuccess(i18n('cc-kv-hash-explorer.success.element-update'));
        }
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-hash-explorer.error.element-add'));
        });
      }
    });

    // -- list

    onEvent('cc-kv-list-filter-change', async (index) => {
      const editorCtrl = /** @type {KvKeyEditorListCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.filter(index);
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-list-explorer.error.apply-filter'));
        });
      }
    });

    onEvent('cc-kv-list-load-more', async () => {
      const editorCtrl = /** @type {KvKeyEditorListCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.loadMore();
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-list-explorer.error.fetch-elements'));
        });
      }
    });

    onEvent('cc-kv-list-element-update', async ({ index, value }) => {
      const editorCtrl = /** @type {KvKeyEditorListCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.updateElement(index, value);
        notifySuccess(i18n('cc-kv-list-explorer.success.element-update'));
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-list-explorer.error.element-update'));
        });
      }
    });

    onEvent('cc-kv-list-element-add', async ({ position, value }) => {
      const editorCtrl = /** @type {KvKeyEditorListCtrl} */ (detailsCtrl.editorCtrl);

      try {
        const index = await editorCtrl.addElement(position, value);

        notifySuccess(i18n('cc-kv-list-explorer.success.element-add', { index }));
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-list-explorer.error.element-add'));
        });
      }
    });

    // -- set ---

    onEvent('cc-kv-set-filter-change', async (pattern) => {
      const editorCtrl = /** @type {KvKeyEditorSetCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.filter(pattern);
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-set-explorer.error.apply-filter'));
        });
      }
    });

    onEvent('cc-kv-set-load-more', async () => {
      const editorCtrl = /** @type {KvKeyEditorSetCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.loadMore();
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-set-explorer.error.fetch-elements'));
        });
      }
    });

    onEvent('cc-kv-set-element-delete', async (element) => {
      const editorCtrl = /** @type {KvKeyEditorSetCtrl} */ (detailsCtrl.editorCtrl);

      try {
        await editorCtrl.deleteElement(element);
        notifySuccess(i18n('cc-kv-set-explorer.success.element-delete'));
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-set-explorer.error.element-delete'));
        });
      }
    });

    onEvent('cc-kv-set-element-add', async (element) => {
      const editorCtrl = /** @type {KvKeyEditorSetCtrl} */ (detailsCtrl.editorCtrl);

      try {
        const added = await editorCtrl.addElement(element);

        if (added) {
          notifySuccess(i18n('cc-kv-set-explorer.success.element-add'));
        } else {
          notifySuccess(i18n('cc-kv-set-explorer.success.element-already-exist'));
        }
      } catch (e) {
        checkIfKeyNotFoundOrElse(e, () => {
          notifyError(i18n('cc-kv-set-explorer.error.element-add'));
        });
      }
    });

    // -- CLI

    onEvent('cc-kv-command-execute', async (commandLine) => {
      await terminalCtrl.runCommandLine(commandLine);
    });

    // -- init ---

    updateComponent('state', { type: 'loading' });
    detailsCtrl.hide();
    terminalCtrl.clear();
    component.resetAddForm();

    let ready = false;
    try {
      ready = await kvClient.ping();
    } catch (e) {
      console.error(e);
      updateComponent('state', { type: 'error' });
    }
    try {
      if (ready) {
        await keysCtrl.fetchKeys({ keys: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      updateComponent('state', { type: 'error-keys', action: 'loading' });
    }

    /**
     * @param {any} e
     * @param {function} orElse
     */
    function checkIfKeyNotFoundOrElse(e, orElse) {
      if (isKeyNotFound(e)) {
        notifyError(i18n('cc-kv-explorer.error.key-doesnt-exist'));
        keysCtrl.onKeyNotFound(e.responseBody.context.key);
        detailsCtrl.hide();
      } else {
        console.error(e);
        orElse();
      }
    }
  },
});

/**
 * @param {{responseBody?: { code?: string}}} e
 * @return {string | null} e
 */
function getErrorCode(e) {
  return e?.responseBody?.code;
}

/**
 * @param {any} e
 * @return {e is {responseBody: { context: {key: string}}}}
 */
function isKeyNotFound(e) {
  return getErrorCode(e) === 'clever.redis-http.key-not-found';
}

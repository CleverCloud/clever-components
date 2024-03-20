import { html, css, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixExternalLinkLine as iconLink,
  iconRemixFlaskLine as iconTest,
} from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-loader/cc-loader.js';
import '../cc-badge/cc-badge.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListState} DomainManagementListState
 * @typedef {import('./cc-domain-management.types.js').DomainManagementFormState} DomainManagementFormState
 * @typedef {import('./cc-domain-management.types.js').Domain} Domain
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref').Ref<CcInputText>} RefCcInputText
 */

/**
 * @cssdisplay block
 *
 * @fires {CustomEvent<string>} cc-domain-management:mark-as-primary - Fires when clicking a "mark as parimary" button.
 * @fires {CustomEvent<string>} cc-domain-management:delete - Fires when clicking a "delete" button.
 *
 */
export class CcDomainManagement extends LitElement {

  static get properties () {
    return {
      domainFormState: { type: Object, attribute: 'form-state' },
      domainListState: { type: Object, attribute: 'domain-list-state' },
    };
  }

  static get INIT_DOMAIN_FORM_STATE () {
    return {
      type: 'idle',
      domain: {
        value: '',
      },
      path: {
        value: '',
      },
    };
  }

  constructor () {
    super();

    /** @type {DomainManagementFormState} */
    this.domainFormState = CcDomainManagement.INIT_DOMAIN_FORM_STATE;

    /** @type {DomainManagementListState} Sets the state of the component. */
    this.domainListState = { type: 'loading' };

    /** @type {ResizeController} */
    this.resizeController = new ResizeController(this, { widthBreakpoints: [800] });

    /** @type {RefCcInputText} */
    this._domainInputRef = createRef();
  }

  _onAdd () {
    const domainValue = this.domainFormState.domain.value.trim();
    const pathValue = this.domainFormState.path.value.trim();

    if (domainValue.length === 0) {
      this.domainFormState = {
        ...this.domainFormState,
        domain: {
          ...this.domainFormState.domain,
          error: 'empty',
        },
      };
      this._domainInputRef.value?.focus();
      return;
    }

    dispatchCustomEvent(this, 'add', {
      domain: domainValue,
      path: pathValue,
    });
  }

  /**
   * @param {string} domainName
   */
  _onMarkPrimary (domainName) {
    dispatchCustomEvent(this, 'mark-as-primary', { domainName });
  }

  /**
   * @param {string} domainName
   */
  _onDelete (domainName) {
    dispatchCustomEvent(this, 'delete', { domainName });
  }

  /**
   * @param {Event & { detail: string }} event
   */
  _onDomainInput ({ detail: value }) {
    this.domainFormState = {
      ...this.domainFormState,
      domain: {
        ...this.domainFormState.domain,
        value,
      },
    };
  }

  /**
   * @param {Event & { detail: string }} event
   */
  _onPathInput ({ detail: value }) {
    this.domainFormState = {
      ...this.domainFormState,
      path: {
        ...this.domainFormState.path,
        value,
      },
    };
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-domain-management.main-heading')}</div>

        <cc-block-section>
          <div slot="title">${i18n('cc-domain-management.form.heading')}</div>
          <div>
            ${this._renderForm(this.domainFormState)}
          </div>
        </cc-block-section>

        <cc-block-section>
          <div slot="title">
            ${i18n('cc-domain-management.list.heading')}
            ${this.domainListState.type === 'loaded' ? html`
              <cc-badge class="domain-count" circle>${this.domainListState.domains.length}</cc-badge>
            ` : ''}
          </div>

          ${this.domainListState.type === 'loading' ? html`
            <cc-loader></cc-loader>
          ` : ''}

          ${this.domainListState.type === 'loaded'
            ? this._renderDomains(this.domainListState.domains, this.resizeController.width)
            : ''}

        </cc-block-section>
      </cc-block>
    `;
  }

  /**
   * @param {DomainManagementFormState} formState
   * @returns {TemplateResult}
   */
  _renderForm ({ type, domain, path }) {
    const isDisabled = type === 'adding';

    return html`
      <form>
        <div class="fieldgroup">
          <cc-input-text  
            class="fieldgroup__domain"
            label="${i18n('cc-domain-management.form.domain.label')}"
            required
            .value="${domain.value}"
            ?disabled="${isDisabled}"
            ${ref(this._domainInputRef)}
            @cc-input-text:input=${this._onDomainInput}
          >
            ${domain.error === 'empty' ? html`
              <p slot="error">${i18n('cc-domain-management.form.domain.error.empty')}</p>
            ` : ''}
          </cc-input-text>
          <cc-input-text 
            class="fieldgroup__path"
            label="${i18n('cc-domain-management.form.path.label')}"
            .value="${path.value}"
            ?disabled="${isDisabled}"
            @cc-input-text:input=${this._onPathInput}
          >
          </cc-input-text>
        </div>
        <cc-button 
          primary
          @cc-button:click=${this._onAdd}
        >${i18n('cc-domain-management.form.submit')}</cc-button>
      </form>
      <!--
        TODO: add text about cleverapps + other stuff 
      -->
    `;
  }

  /**
   * @param {Domain[]} domains
   * @param {number} componentWidth
   * @returns {TemplateResult}
   */
  _renderDomains (domains, componentWidth) {
    const hasLargeWidth = componentWidth > 600;

    return html`
      <div class="${classMap({ 'domains--grid': hasLargeWidth, 'domains--cards': !hasLargeWidth })}">
        ${domains.map(({ name, isPrimary, stateType }) => html`
          <div>
            ${name}
            ${isPrimary ? html`
              <cc-badge>${i18n('cc-domain-management.list.badge.primary')}</cc-badge>
            ` : ''}
            ${name.endsWith('cleverapps.io') ? html`
              <cc-badge class="testing-only">
                <cc-icon .icon=${iconTest}></cc-icon>
                ${i18n('cc-domain-management.list.badge.testing-only')}
              </cc-badge>
            ` : ''}
          </div>
          <div>
            <a href="https://${name}">
              https://${name}
              <cc-icon .icon=${iconLink} a11y-name="${i18n('cc-domain-management.new-window')}"></cc-icon>
            </a>
          </div>
          <div class="actions">

            ${!isPrimary ? html`
              <cc-button 
                primary
                outlined
                ?waiting="${stateType === 'marking-primary'}"
                @cc-button:click=${() => this._onMarkPrimary(name)}
              >
                ${i18n('cc-domain-management.list.btn.primary')}
              </cc-button>
            ` : ''}

            <cc-button
              danger 
              outlined
              ?waiting="${stateType === 'deleting'}"
              @cc-button:click=${() => this._onDelete(name)}
            >
              ${i18n('cc-domain-management.list.btn.delete')}
            </cc-button>
          </div>
        `)}
      </div>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }

        .fieldgroup {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .fieldgroup__domain {
          flex-grow: 5;
        }

        .fieldgroup__path {
          flex-grow: 2;
        }

        form {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        form cc-button {
          margin-top: 1em;
          margin-left: auto;
        }

        .domain-count {
          margin-left: 0.2em;
          font-size: 0.9em;
        }

        .domains--grid {
          display: grid;
          gap: 1em;
          grid-template-columns: 1fr max-content max-content;
        }

        .domains--cards {
          display: grid;
          justify-content: start;
          gap: 1em;
          grid-template-rows: max-content max-content max-content;
        }

        .actions {
          display: flex;
          justify-content: end;
          gap: 0.5em;
        }

        .domains--cards .actions {
          flex-direction: column;
          margin-bottom: 2em;
        }

        .testing-only {
          color: var(--cc-color-text-primary);
        }
      `,
    ];
  }
}

window.customElements.define('cc-domain-management-beta', CcDomainManagement);

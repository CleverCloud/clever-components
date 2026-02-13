import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixAddCircleLine,
  iconRemixBankCard_2Line as iconRemixBankCard,
  iconRemixBuildingLine,
  iconRemixChat_4Line as iconRemixChat,
  iconRemixKey_2Line as iconRemixKey,
  iconRemixLockLine,
  iconRemixTerminalLine,
} from '../../assets/cc-remix.icons.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import {
  CcHomepageOnboardingCliEvent,
  CcHomepageOnboardingConfigPaymentEvent,
  CcHomepageOnboardingNewOrganisationEvent,
  CcHomepageOnboardingNewProjectEvent,
  CcHomepageOnboardingNewResourceEvent,
  CcHomepageOnboardingSecureEvent,
  CcHomepageOnboardingSshKeysEvent,
  CcHomepageOnboardingSupportEvent,
} from './cc-homepage-onboarding.events.js';
import { fakeString } from '../../lib/fake-strings.js';

/**
 * @returns {Record<string,HomepageOnboardingCard>}
 */
function getCards() {
  return {
    newResource: {
      title: i18n('cc-homepage-onboarding.card.new-resource.title'),
      description: i18n('cc-homepage-onboarding.card.new-resource.description'),
      icon: iconRemixAddCircleLine,
      iconColor: 'white',
      buttonText: i18n('cc-homepage-onboarding.card.new-resource.button'),
      select: {
        title: i18n('cc-homepage-onboarding.card.new-resource.select.title'),
        placeholder: i18n('cc-homepage-onboarding.card.new-resource.select.placeholder'),
      },
      event: (/** @type {string} */ orgId) => new CcHomepageOnboardingNewResourceEvent(orgId),
    },
    newProject: {
      title: i18n('cc-homepage-onboarding.card.new-project.title'),
      description: i18n('cc-homepage-onboarding.card.new-project.description'),
      icon: iconRemixAddCircleLine,
      iconColor: 'white',
      buttonText: i18n('cc-homepage-onboarding.card.new-project.button'),
      event: () => new CcHomepageOnboardingNewProjectEvent(),
    },
    secure: {
      title: i18n('cc-homepage-onboarding.card.secure.title'),
      description: i18n('cc-homepage-onboarding.card.secure.description'),
      icon: iconRemixLockLine,
      iconColor: 'purple',
      buttonText: i18n('cc-homepage-onboarding.card.secure.button'),
      event: () => new CcHomepageOnboardingSecureEvent(),
    },
    sshKeys: {
      title: i18n('cc-homepage-onboarding.card.ssh-keys.title'),
      description: i18n('cc-homepage-onboarding.card.ssh-keys.description'),
      icon: iconRemixKey,
      iconColor: 'purple',
      buttonText: i18n('cc-homepage-onboarding.card.ssh-keys.button'),
      event: () => new CcHomepageOnboardingSshKeysEvent(),
    },
    cli: {
      title: i18n('cc-homepage-onboarding.card.cli.title'),
      description: i18n('cc-homepage-onboarding.card.cli.description'),
      icon: iconRemixTerminalLine,
      iconColor: 'blue',
      buttonText: i18n('cc-homepage-onboarding.card.cli.button'),
      event: () => new CcHomepageOnboardingCliEvent(),
    },
    newOrganisation: {
      title: i18n('cc-homepage-onboarding.card.new-organisation.title'),
      description: i18n('cc-homepage-onboarding.card.new-organisation.description'),
      icon: iconRemixBuildingLine,
      iconColor: 'dark-purple',
      buttonText: i18n('cc-homepage-onboarding.card.new-organisation.button'),
      event: () => new CcHomepageOnboardingNewOrganisationEvent(),
    },
    configPayment: {
      title: i18n('cc-homepage-onboarding.card.config-payment.title'),
      description: i18n('cc-homepage-onboarding.card.config-payment.description'),
      icon: iconRemixBankCard,
      iconColor: 'orange',
      buttonText: i18n('cc-homepage-onboarding.card.config-payment.button'),
      event: () => new CcHomepageOnboardingConfigPaymentEvent(),
    },
    support: {
      title: i18n('cc-homepage-onboarding.card.support.title'),
      description: i18n('cc-homepage-onboarding.card.support.description'),
      icon: iconRemixChat,
      iconColor: 'dark-orange',
      buttonText: i18n('cc-homepage-onboarding.card.support.button'),
      event: () => new CcHomepageOnboardingSupportEvent(),
    },
  };
}

const SKELETON_TITLE = fakeString(20);
const SKELETON_DESCRIPTION = fakeString(100);
/** @type {HomepageOnboardingCard[]} */
const SKELETON_CARDS = [
  {
    title: fakeString(15),
    description: fakeString(50),
    icon: iconRemixAddCircleLine,
    iconColor: 'white',
    buttonText: fakeString(10),
  },
  {
    title: fakeString(15),
    description: fakeString(50),
    icon: iconRemixLockLine,
    iconColor: 'purple',
    buttonText: fakeString(10),
  },
  {
    title: fakeString(15),
    description: fakeString(50),
    icon: iconRemixTerminalLine,
    iconColor: 'blue',
    buttonText: fakeString(10),
  },
  {
    title: fakeString(15),
    description: fakeString(50),
    icon: iconRemixBuildingLine,
    iconColor: 'orange',
    buttonText: fakeString(10),
  },
];

/**
 * @import { IconModel } from '../common.types.js'
 * @import { HomepageOnboardingState, HomepageOnboardingCard } from './cc-homepage-onboarding.types.js'
 */

/**
 * A component that displays onboarding cards on the homepage.
 * Shows different cards (max 4) and messages depending on the user type (new user vs existing user).
 *
 * @cssdisplay block
 */
export class CcHomepageOnboarding extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {HomepageOnboardingState} Set the state of the component. */
    this.state = { type: 'loading' };

    /** @type {string} */
    this._selectedOrganisation = '';
  }

  /**
   * @param {CustomEvent<string>} e
   * @private
   */
  _onOrganisationSelect(e) {
    this._selectedOrganisation = e.detail;
  }

  /**
   * @param {HomepageOnboardingCard} card
   * @private
   */
  _onCardButtonClick(card) {
    if (card.event != null) {
      if (card.select != null) {
        this.dispatchEvent(card.event(this._selectedOrganisation));
      } else {
        this.dispatchEvent(card.event());
      }
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-homepage-onboarding.error')}"></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const cards = this.state.type === 'loaded' ? this.state.cardIds.map((id) => getCards()[id]) : SKELETON_CARDS;
    const title =
      this.state.type === 'loaded'
        ? this.state.userType === 'new-user'
          ? i18n('cc-homepage-onboarding.title.new-user')
          : i18n('cc-homepage-onboarding.title.already-user')
        : SKELETON_TITLE;
    const description =
      this.state.type === 'loaded'
        ? this.state.userType === 'new-user'
          ? i18n('cc-homepage-onboarding.description.new-user')
          : i18n('cc-homepage-onboarding.description.already-user')
        : SKELETON_DESCRIPTION;

    return html`
      <div class="container">
        <div class="header">
          <h2 class=${classMap({ title: true, skeleton })}>${title}</h2>
          <p class=${classMap({ description: true, skeleton })}>${description}</p>
        </div>
        <div class="cards">${cards.map((card) => this._renderCard(card, skeleton))}</div>
      </div>
    `;
  }

  /**
   * @param {HomepageOnboardingCard} card
   * @param {boolean} skeleton
   * @private
   */
  _renderCard(card, skeleton) {
    return html`
      <div class=${classMap({ card: true, 'blue-card': card.iconColor === 'white', skeleton })}>
        ${this._renderIcon(card.icon, card.iconColor, skeleton)}
        <h3 class=${classMap({ 'card-title': true, skeleton })}>${card.title}</h3>
        <p class=${classMap({ 'card-description': true, skeleton })}>${card.description}</p>
        ${!skeleton && card.select
          ? html`<cc-select
              .label=${card.select.title}
              .placeholder=${card.select.placeholder}
              required
              value=""
              .options=${this.state.type === 'loaded' ? this.state.organisationOptions : []}
              @cc-select=${this._onOrganisationSelect}
            ></cc-select>`
          : ''}
        <cc-button class="card-button" ?skeleton=${skeleton} @cc-click=${() => this._onCardButtonClick(card)}
          >${card.buttonText}</cc-button
        >
      </div>
    `;
  }

  /**
   * @param {IconModel} icon
   * @param {string} color
   * @param {boolean} skeleton
   * @private
   */
  _renderIcon(icon, color, skeleton) {
    const colorClass = `color-${color}`;
    return html`
      <div class=${classMap({ icon: true, [colorClass]: true, skeleton })}>
        ${!skeleton && icon != null ? html`<cc-icon .icon=${icon}></cc-icon>` : ''}
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
          width: 100%;
        }

        .container {
          align-items: center;
          border: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          gap: 2em;
          padding: 3em;
          text-align: center;
        }

        .title {
          font-size: 1.5em;
          font-weight: bold;
          line-height: 2.25;
          margin: 0;
        }

        .description {
          font-size: 1em;
          line-height: 1.3;
          margin: 0;
          max-width: 50em;
        }

        .cards {
          display: grid;
          gap: 1.3em;
          grid-template-columns: repeat(auto-fit, minmax(max(18em, calc((100% - 3 * 1.3em) / 4)), 1fr));
          width: 100%;
        }

        .card {
          border-radius: 1em;
          border-top: 2px solid #f3f4f6;
          box-shadow:
            0 4px 6px -4px #0000001a,
            0 10px 15px -3px #0000001a;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1.25em;
          min-height: 24em;
          padding: 2em;
          text-align: left;
        }

        .blue-card {
          background: linear-gradient(135deg, #3d5fb4 0%, #6d1cf0 100%);
          color: var(--color-white, #ffffff);
        }

        .blue-card cc-select {
          color: var(--color-grey-100, #0d0d0d);

          --cc-color-text-weak: white;
          --cc-select-label-color: white;
        }

        .icon {
          border-radius: 0.5em;
          box-shadow:
            0 4px 6px -4px #0000001a,
            0 10px 15px -3px #0000001a;
          padding: 1em;
          width: fit-content;
        }

        .icon cc-icon {
          color: white;
          font-size: 3em;
        }

        .color-purple {
          background: linear-gradient(135deg, #8d30d7 0%, #a93df7 100%);
        }

        .color-dark-purple {
          background: linear-gradient(135deg, #5b15de 0%, #9523f9 100%);
        }

        .color-blue {
          background: linear-gradient(135deg, #1548de 0%, #2359f9 100%);
        }

        .color-orange {
          background: linear-gradient(135deg, #e96636 0%, #e07d60 100%);
        }

        .color-dark-orange {
          background: linear-gradient(135deg, #cc2121 0%, #e67151 100%);
        }

        .color-white {
          background: rgb(255 255 255 / 20%);
        }

        .card-title {
          font-size: 1.5em;
          margin: 0;
        }

        .card-description {
          flex-grow: 1;
          font-size: 1em;
          margin: 0;
        }

        .card-button {
          font-weight: bold;
          text-transform: uppercase;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }

        .card.skeleton {
          border-top-color: transparent;
        }
      `,
    ];
  }
}

window.customElements.define('cc-homepage-onboarding', CcHomepageOnboarding);

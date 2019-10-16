// This is mainly inspired by https://github.com/github/time-elements/blob/master/src/relative-time-element.js
// This file is not using lit* deps on purpose (keep small and not useful).

import { i18n } from '../lib/i18n.js';
import moment from 'moment';
import 'moment/locale/fr.js';
import { getLanguage } from '../lib/i18n';

const trackedElements = [];
let updateIntervalId;

function updateTrackedElements () {
  trackedElements.forEach(($element) => $element._triggerUpdate());
}

/**
 */
export class CcDatetimeRelative extends HTMLElement {

  constructor () {
    super();
  }

  static get observedAttributes () {
    return ['datetime'];
  }

  get datetime () {
    return this.getAttribute('datetime');
  }

  set datetime (value) {
    this.setAttribute('datetime', value);
  }

  attributeChangedCallback (attrName, old, date) {
    if (attrName === 'datetime') {
      this.title = i18n('cc-datetime-relative.title', { date });
      this._triggerUpdate();
    }
  }

  connectedCallback () {
    trackedElements.push(this);
    if (updateIntervalId == null) {
      updateTrackedElements();
      // 10 seconds
      updateIntervalId = setInterval(updateTrackedElements, 10 * 1000);
    }
  }

  disconnectedCallback () {
    const idx = trackedElements.indexOf(this);
    if (idx !== -1) {
      trackedElements.splice(idx, 1);
    }
    if (trackedElements.length > 0 && updateIntervalId != null) {
      clearInterval(updateIntervalId);
      updateIntervalId = null;
    }
  }

  _triggerUpdate () {
    const date = this.getAttribute('datetime');
    if (getLanguage() === 'fr') {
      moment.locale('fr');
    }
    else {
      moment.locale('en');
    }
    const newContent = moment(new Date(date)).fromNow();
    if (this.textContent !== newContent) {
      this.textContent = newContent;
    }
  }
}

window.customElements.define('cc-datetime-relative-moment', CcDatetimeRelative);

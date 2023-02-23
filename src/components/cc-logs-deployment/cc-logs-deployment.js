import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-loader/cc-loader.js';
import '../cc-logs-poc/cc-logs-poc.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { _renderStepLabel } from './stepRender.js';
import { StepsController } from './stepsController.js';

const doneSvg = new URL('../../assets/checkbox-circle-fill.svg', import.meta.url).href;
const errorSvg = new URL('../../assets/spam-2-fill.svg', import.meta.url).href;
const infoSvg = new URL('../../assets/information-fill.svg', import.meta.url).href;
const warnSvg = new URL('../../assets/alert-fill.svg', import.meta.url).href;

function formatDuration (ms) {
  if (ms < 1000) {
    return 'less than one second';
  }

  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
}

export class CcLogsDeployment extends LitElement {
  static get properties () {
    return {
      steps: { type: Array },
      openedLogsSteps: { type: Array },
    };
  }

  constructor () {
    super();

    this.steps = [];
    this.openedLogsSteps = [];
  }

  _isLogsShown (step) {
    return this.openedLogsSteps.includes(step.name);
  }

  _toggleLogs (step) {
    if (this._isLogsShown(step)) {
      this.openedLogsSteps = this.openedLogsSteps.filter((s) => s !== step.name);
    }
    else {
      this.openedLogsSteps = [...this.openedLogsSteps, step.name];
    }
  }

  setDetail (detail) {
    const ctrl = new StepsController(this.steps);
    ctrl.setDetail(detail);
    this.steps = ctrl.steps;
  }

  addLog (log) {
    const ctrl = new StepsController(this.steps);
    ctrl.addLog(log);
    this.steps = ctrl.steps;
  }

  addLogs (logs) {
    const ctrl = new StepsController(this.steps);
    ctrl.addLogs(logs);
    this.steps = ctrl.steps;
  }

  error () {
    const ctrl = new StepsController(this.steps);
    ctrl.error();
    this.steps = ctrl.steps;
  }

  success () {
    const ctrl = new StepsController(this.steps);
    ctrl.success();
    this.steps = ctrl.steps;
  }

  addStep (stepId, { group = false, intent = 'normal', final = false }) {
    const ctrl = new StepsController(this.steps);
    ctrl.addStep(stepId, { group, intent, final });
    this.steps = ctrl.steps;
  }

  render () {
    return html`
      <div class="timeline"></div>
      ${this.steps.map((step) => this._renderStep(step))}
    `;
  }

  _renderStep (step) {
    if (step.group) {
      return this._renderGroup(step);
    }

    if (step.intent === 'info') {
      return html`
        <div class="step-info">
          <img src="${infoSvg}" alt=""/>
          <div class="step-info-detail">
            ${_renderStepLabel(step)}
          </div>
        </div>
      `;
    }

    if (step.intent === 'warning') {
      return html`
        <div class="step-info">
          <img src="${warnSvg}" alt=""/>
          <div class="step-info-detail">
            ${_renderStepLabel(step)}
          </div>
        </div>
      `;
    }

    const hasSubSteps = step.sub != null && step.sub.length > 0;
    const hasLogs = step.logs != null && step.logs.length > 0;
    const isLogsShown = this._isLogsShown(step);

    return html`
      <div class="step ${classMap({ success: step.state === 'done', error: step.state === 'error' })}">
        <div class="step-header">
          ${this._renderState(step.state)}
          <span class="step-header-label">${_renderStepLabel(step)}</span>
          ${this._renderStepDuration(step)}
        </div>
        ${this._renderStepDetail(step.detail)}
        ${hasSubSteps
          ? html`
            <div class="sub-steps">${step.sub.map((step) => this._renderSubStep(step))}</div>
          ` : ''
        }
        ${hasLogs
          ? html`
            <cc-button @cc-button:click=${() => this._toggleLogs(step)} ?link=${true}>${isLogsShown ? 'hide logs' : 'show logs'}</cc-button>
            ${isLogsShown ? html`<cc-logs-poc ?withVirtualizer=${true} ?follow=${true} .logs=${step.logs}></cc-logs-poc>` : ''}
          ` : ''
        }
      </div>
    `;
  }

  _renderSubStep (step) {

    if (step.intent === 'info') {
      return html`
        <div class="sub-step">
          <div class="sub-step-header info">
            <img src="${infoSvg}" alt=""/>
            ${_renderStepLabel(step)}
          </div>
        </div>
      `;
    }

    return html`
      <div class="sub-step">
        <div class="sub-step-header">
          ${this._renderState(step.state)}
          <span>${_renderStepLabel(step)}</span>
          ${this._renderStepDuration(step)}
        </div>
      </div>
    `;
  }

  _renderStepDetail (detail) {
    if (detail == null) {
      return '';
    }

    return html`
      <div class="details">
        <img src="${infoSvg}" alt=""/>
        <div>
          ${JSON.stringify(detail)}
        </div>
      </div>
    `;
  }

  _renderStepDuration (step) {
    if (step.start != null && step.end != null) {
      const duration = formatDuration(step.end.getTime() - step.start.getTime());
      return html`
        <div class="duration">${duration != null ? `Took ${duration}` : ''}</div>`;
    }

    return null;
  }

  _renderState (state) {
    if (state === 'loading') {
      return html`
        <cc-loader></cc-loader>`;
    }
    if (state === 'done') {
      return html`<img src="${doneSvg}" alt=""/>`;
    }
    if (state === 'error') {
      return html`<img src="${errorSvg}" alt=""/>`;
    }
  }

  _renderGroup (step) {
    const getGroupIcon = (group) => {
      if (group === 'deployment-asked') {
        return '🙏';
      }
      if (group === 'prepare') {
        return '🔪';
      }
      if (group === 'build') {
        return '🍲';
      }
      if (group === 'run') {
        return '🍻';
      }
      if (group === 'deliver') {
        return '🚚';
      }
      if (group === 'deployment-success') {
        return '🤗';
      }
      if (group === 'deployment-error') {
        return '😡';
      }
    };

    return html`
      <div class="group">
        <div class="header">
          <div class="icon">${getGroupIcon(step.name)}</div>
          <div class="label">${_renderStepLabel(step)}</div>
        </div>
        ${this._renderStepDetail(step.detail)}
      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        
        :host {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .timeline {
          position: absolute;
          z-index: 1;
          top: 10px;
          bottom: 10px;
          left: 22px;
          width: 2px;
          background-color: var(--color-grey-30);
        }

        .group .header {
          display: flex;
          height: 40px;
          align-items: center;
          gap: 0.5em;
        }

        .group .label {
          position: relative;
          left: 2.8em;
          color: var(--cc-color-text-strong);
          font-size: 1.2em;
          font-weight: bold;
        }

        .group .icon {
          position: absolute;
          z-index: 2;
          display: flex;
          width: 36px;
          height: 36px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-grey-30);
          background-color: #fff;
          border-radius: 50%;
          font-size: 1em;
        }

        .group .details {
          margin-left: 60px;
        }

        .step {
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          border: 2px solid var(--cc-color-border-primary-weak);
          margin-left: 2.5em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: 5px;
          gap: 0.5em;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .step-header-label {
          flex: 1;
        }

        .duration {
          color: var(--cc-color-text-weak);
          font-size: 0.8em;
        }

        .success {
          border-color: var(--cc-color-bg-success);
        }

        .error {
          border-color: var(--cc-color-bg-danger);
        }

        .step-info {
          display: inline-flex;
          align-self: flex-start;
          padding: 0.8em;
          border-left: 3px solid var(--color-grey-20);
          margin-left: 2.5em;
          background-color: var(--cc-color-bg-neutral);
          border-bottom-left-radius: 3px;
          border-top-left-radius: 3px;
          color: var(--cc-color-text-primary);
          gap: 0.5em;
        }

        .step-info img {
          width: 1em;
          height: 1em;
        }

        .step-info-detail {
          flex: 1;
        }

        .sub-steps {
          display: flex;
          flex-direction: column;
          margin-left: 1.6em;
          gap: 0.3em;
        }

        .sub-step-header {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .sub-step-header.info {
          color: var(--cc-color-text-primary);
        }

        cc-loader {
          width: 1.5em;
          height: 1.5em;
        }

        img {
          width: 1.5em;
          height: 1.5em;
        }

        .sub-step cc-loader {
          width: 1em;
          height: 1em;
        }

        .sub-step img {
          width: 1em;
          height: 1em;
        }

        .deployment-details {
          display: grid;
          flex-direction: column;
          margin-left: 0.3em;
          gap: 0.3em;
          grid-column-gap: 0.5em;
          grid-template-columns: auto auto;
        }

        .deployment-details > div {
          display: inline-flex;
          align-items: center;
          gap: 0.2em;
        }

        .logs-wrapper {
          display: flex;
          width: 100%;
          min-width: 0;
          max-width: 500px;
          min-height: 0;
          max-height: 100px;
          flex-direction: column;
          align-items: stretch;
          padding: 0.5em;
          border: 1px solid #ccc;
        }
        
        cc-logs-poc {
          max-height: 300px;
          padding: 0.5em;
          border: 1px solid var(--cc-color-bg-soft);
          background-color: var(--cc-color-bg-default);
        }
        
        cc-badge {
          font-family: var(--cc-ff-monospace, monospace);
          font-weight: bold;
        }
        
        .deployment-reason {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          align-self: center;
          padding: 1em;
          border: 1px solid var(--cc-color-bg-primary-weak);
          background-color: var(--cc-color-bg-default);
          border-radius: 3px;
          gap: 1.5em;
        }

        .diagram-title {
          font-weight: bold;
        }

        .diagram-content.vertical-scaling {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        
        .diagram-content.new-commit {
          display: grid;
          flex-direction: column;
          align-items: center;
          grid-gap: 0.5em;
          grid-template-columns: min-content max-content;
        }

        .diagram-content.new-commit cc-badge {
          grid-column: 1;
        }
        
        .diagram-content.new-commit img {
          align-self: center;
          justify-self: center;
        }

        .diagram-content.new-commit span {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
        }
        
      `];
  }
}

window.customElements.define('cc-logs-deployment', CcLogsDeployment);

import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-datetime-relative/cc-datetime-relative.js';
import '../cc-loader/cc-loader.js';
import '../cc-logs-poc/cc-logs-poc.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const doneSvg = new URL('../../assets/checkbox-circle-fill.svg', import.meta.url).href;
const errorSvg = new URL('../../assets/spam-2-fill.svg', import.meta.url).href;
const infoSvg = new URL('../../assets/information-fill.svg', import.meta.url).href;
const warnSvg = new URL('../../assets/alert-fill.svg', import.meta.url).href;
const gitSvg = new URL('../../assets/git.svg', import.meta.url).href;
const arrowDownSvg = new URL('../../assets/arrow-down-line.svg', import.meta.url).href;
const arrowRightSvg = new URL('../../assets/arrow-right-line.svg', import.meta.url).href;

const STEPS_SPEC = [
  {
    name: 'deploymentAsked',
    next: 'prepareInstance',
  },
  {
    name: 'prepareInstance',
    steps: [
      {
        name: 'startVM',
      },
      {
        name: 'injectEnvVar',
      },
    ],
    next: 'buildCache',
  },
  {
    name: 'buildCache',
    steps: [
      {
        name: 'check',
        next (opt) {
          if (opt === 'buildCacheHit') {
            return 'buildCache/downloadBuildCache';
          }
          if (opt === 'buildCacheMiss') {
            return 'preBuildHook';
          }
          // undefined = runtime error!
        },
      },
      {
        name: 'downloadBuildCache',
        next: 'preRunHook',
      },
    ],
  },
  {
    name: 'injectingEnvVar',
    states: ['loading', 'done'],
  },
  {
    name: 'preBuildHook',
    optional: true,
    next: '',
  },
  {
    name: 'build',
    steps: [
      {
        name: 'clone',
      },
      {
        name: 'runBuildCommand',
      },
    ],
    next: 'postBuildHook',
  },
  {
    name: 'postBuildHook',
    optional: true,
    next: 'preRunHook',
  },
  {
    name: 'preRunHook',
    optional: true,
    next: 'preRunHook',
  },
  {
    name: 'runApp',
    next: 'postRunHook',
  },
  {
    name: 'postRunHook',
    optional: true,
    next: 'postRunHook',
  },
  {
    name: 'deploymentSuccess',
    final: true,
  },
  {
    name: 'deploymentError',
    final: true,
  },
];

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

/**
 *
 * @param {Date} date
 */
function formatDate (date) {
  return date.toLocaleString(
    'en-GB',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  );
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
    const lastStep = this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;

    if (lastStep != null) {
      if (lastStep.sub.length > 0) {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            sub: [
              ...lastStep.sub.slice(0, -1),
              {
                ...lastStep.sub[lastStep.sub.length - 1],
                detail,
              },
            ],
          },
        ];
      }
      else {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            detail,
          },
        ];
      }
    }
  }

  addLog (log) {
    this.addLogs([log]);
  }

  addLogs (logs) {
    const lastStep = this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;
    if (lastStep != null) {
      this.steps = [
        ...this.steps.slice(0, -1),
        {
          ...lastStep,
          logs: [...(lastStep.logs ?? []), ...logs],
        },
      ];
    }
  }

  error () {
    const lastStep = this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;
    if (lastStep != null) {
      this.steps = [
        ...this.steps.slice(0, -1),
        {
          ...lastStep,
          state: 'error',
          sub: [
            ...lastStep.sub.slice(0, -1),
            {
              ...lastStep.sub[lastStep.sub.length - 1],
              state: 'error',
            },
          ],
        },
        {
          name: 'deployment-error',
          group: true,
          state: 'error',
          sub: [],
        },
      ];
      this.addStep('deployment-after-error', { group: false, intent: 'warning', final: true });
    }
  }

  success () {
    this.addStep('deployment-success', { group: true, intent: 'normal', final: false });
    this.addStep('deployment-url', { group: false, intent: 'info', final: false });
    this.addStep('deployment-duration', { group: false, intent: 'info', final: true });
  }

  addStep (stepId, { group = false, intent = 'normal', final = false }) {
    const lastStep = this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;

    const parseStepId = (id) => {
      const split = id.split('/');
      if (split.length === 1) {
        return {
          name: id,
        };
      }
      else {
        return {
          name: split[0],
          sub: split[1],
        };
      }
    };

    const newStep = parseStepId(stepId);

    if (newStep.name === 'build') {
      console.log();
    }

    const newStepModel = (parsedStep) => {

      if (parsedStep.sub != null) {
        return {
          name: parsedStep.name,
          state: final ? 'done' : 'loading',
          end: final ? new Date() : null,
          start: new Date(),
          sub: [
            {
              name: parsedStep.sub,
              state: final ? 'done' : 'loading',
              intent,
              start: new Date(),
              end: final ? new Date() : null,
            },
          ],
        };
      }
      else {
        return {
          name: parsedStep.name,
          state: final ? 'done' : 'loading',
          group,
          intent,
          sub: [],
          start: new Date(),
          end: final ? new Date() : null,
        };
      }
    };

    if (lastStep == null) {
      this.steps = [newStepModel(newStep)];
    }
    else if (lastStep.name !== newStep.name) {
      // make last step done
      // and add new step

      if (lastStep.sub.length === 0) {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            state: 'done',
            end: new Date(),
          },
          newStepModel(newStep),
        ];
      }
      else {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            sub: [
              ...lastStep.sub.slice(0, -1),
              {
                ...lastStep.sub[lastStep.sub.length - 1],
                state: 'done',
                end: new Date(),
              },
            ],
            state: 'done',
            end: new Date(),
          },
          newStepModel(newStep),
        ];
      }
    }
    else {

      if (lastStep.sub.length === 0) {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            sub: [
              {
                name: newStep.sub,
                state: final ? 'done' : 'loading',
                intent,
                start: new Date(),
                end: final ? new Date() : null,
              },
            ],
          },
        ];
      }
      else {
        // modify last sub step and add the sub step
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            sub: [
              ...lastStep.sub.slice(0, -1),
              {
                ...lastStep.sub[lastStep.sub.length - 1],
                state: 'done',
                end: new Date(),
              },
              {
                name: newStep.sub,
                state: final ? 'done' : 'loading',
                intent,
                start: new Date(),
                end: final ? new Date() : null,
              },
            ],
          },
        ];
      }
    }

    console.log(this.steps);
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
            ${this._renderStepLabel(step)}
          </div>
        </div>
      `;
    }

    if (step.intent === 'warning') {
      return html`
        <div class="step-info">
          <img src="${warnSvg}" alt=""/>
          <div class="step-info-detail">
            ${this._renderStepLabel(step)}
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
          <span class="step-header-label">${this._renderStepLabel(step)}</span>
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
            ${this._renderStepLabel(step)}
          </div>
        </div>
      `;
    }

    return html`
      <div class="sub-step">
        <div class="sub-step-header">
          ${this._renderState(step.state)}
          <span>${this._renderStepLabel(step)}</span>
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
          <div class="label">${this._renderStepLabel(step)}</div>
        </div>
        ${this._renderStepDetail(step.detail)}
      </div>
    `;
  }

  _renderStepLabel (step) {
    if (step.group) {
      if (step.name === 'deployment-asked') {
        return 'A new deployment has been requested';
      }
      if (step.name === 'prepare') {
        return 'We are preparing a new virtual machine';
      }
      if (step.name === 'build') {
        return 'We are building your application';
      }
      if (step.name === 'run') {
        return 'We are starting your application';
      }
      if (step.name === 'deliver') {
        return 'We are delivering your application';
      }
      if (step.name === 'deployment-success') {
        return 'Your application is ready';
      }
      if (step.name === 'deployment-error') {
        return 'Oups, something went wrong during deployment';
      }
    }

    if (step.name === 'deployment-reason-cc-cpu-load') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>Clever Cloud</strong> because a <strong>high
            CPU load</strong> has been detected on your application.</div>
          <div class="diagram">
            <div class="diagram-title">Vertical scaling</div>
            <div class="diagram-content vertical-scaling">
              <cc-badge weight="strong" intent="info">S</cc-badge>
              <img src=${arrowRightSvg} alt=""/>
              <cc-badge weight="strong" intent="info">L</cc-badge>
            </div>
          </div>  
        </div>
      `;
    }
    if (step.name === 'deployment-reason-cc-maintenance') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>Clever Cloud</strong> as part of our maintenance and security process.</div>
          <div class="diagram">
            <div class="diagram-title">Maintenance</div>
            <div class="diagram-content">
              A <a href="https://somewhere">security issue</a> was affecting the version 8.1.5 of NodeJS.
              We upgraded the NodeJS version to 8.1.6.
            </div>
          </div>  
        </div>
      `;
    }
    if (step.name === 'deployment-reason-cc-monitoring') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>Clever Cloud</strong> as part of our monitoring process.</div>
          <div class="diagram">
            <div class="diagram-title">Monitoring</div>
            <div class="diagram-content">
              Application did not respond on port 8080 after 10 attempts.
            </div>
          </div>  
        </div>
      `;
    }
    if (step.name === 'deployment-reason-cc-support') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>Benoit</strong> from the Clever Cloud support team.</div>
          <div class="diagram">
            <div class="diagram-title">Support team</div>
            <div class="diagram-content">
              A deployment has been forced after you <a href="https://somwhere" target="_blank">contacted the support</a>.
            </div>
          </div>  
        </div>
      `;
    }

    if (step.name === 'deployment-reason-user-new-version') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>Clever Cloud</strong> because a new version has been detected.</div>
          <div class="diagram">
            <div class="diagram-title">New version</div>
            <div class="diagram-content new-commit">
              <cc-badge weight="dimmed" .iconSrc=${gitSvg}>54e526d</cc-badge>
              <span>"Rework ssh keys view" (20/11/2022, Robert Tran)</span>
              <img src=${arrowDownSvg} alt=""/>
              <cc-badge weight="dimmed" .iconSrc=${gitSvg}>e5d6d52</cc-badge>
              <span>"Rework orga members view" (01/12/2022, Florian Sanders)</span>
            </div>
          </div>
        </div>
      `;
    }

    if (step.name === 'deployment-reason-user-restart') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>John Doe</strong> through the <strong>Console</strong>.</div>
        </div>
      `;
    }

    if (step.name === 'deployment-reason-user-restart-version') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>John Doe</strong> through the <strong>CLI</strong>.</div>
          <div class="diagram">
            <div class="diagram-title">Specific version</div>
            <div class="diagram-content new-commit">
              <cc-badge weight="dimmed" .iconSrc=${gitSvg}>e5d6d52</cc-badge>
              <span>"Rework orga members view" (01/12/2022, Florian Sanders)</span>
              <img src=${arrowDownSvg} alt=""/>
              <cc-badge weight="dimmed" .iconSrc=${gitSvg}>54e526d</cc-badge>
              <span>"Rework ssh keys view" (20/11/2022, Robert Tran)</span>
            </div>
          </div>
        </div>
      `;
    }

    if (step.name === 'deployment-reason-user-change-scaling-conf') {
      return html`
        <div class="deployment-reason">
          <div class="reason">This deployment has been triggered by <strong>Clever Cloud</strong> after <strong>John Doe</strong> changed the scaling configuration.</div>
          <div class="diagram">
            <div class="diagram-title">Vertical scaling configuration changed</div>
            <div class="diagram-content vertical-scaling">
              <cc-badge weight="strong" intent="info">XS</cc-badge>
              <img src=${arrowRightSvg} alt=""/>
              <cc-badge weight="strong" intent="info">S</cc-badge>
            </div>
          </div>
        </div>
      `;
    }

    if (step.name === 'application-details') {
      return html`
        <div style="margin-bottom: 0.5em;"><strong>Application configuration</strong></div>
        <div class="deployment-details">
          <div>Runtime</div>
          <cc-badge weight="dimmed" icon-src="https://assets.clever-cloud.com/logos/nodejs.svg">NodeJS</cc-badge>
          <div>Zone</div>
          <cc-badge weight="dimmed">Paris</cc-badge>
          <div>Version</div>
          <cc-badge weight="dimmed" .iconSrc=${gitSvg}>e5d6d52</cc-badge>
          <div>Vertical scaling</div>
          <cc-badge weight="dimmed">S -> XL</cc-badge>
          <div>Horizontal scaling</div>
          <cc-badge weight="dimmed">1</cc-badge>
        </div>
      `;
    }
    if (step.name === 'deployment-details-with-build') {
      return html`
        <div style="margin-bottom: 0.5em;"><strong>Deployment configuration</strong></div>
        <div class="deployment-details">
          <div>No down time</div>
          <cc-badge weight="dimmed">Yes</cc-badge>
          <div>Force build</div>
          <cc-badge weight="dimmed">Yes</cc-badge>
          <div>Dedicated build VM</div>
          <cc-badge weight="dimmed">Yes</cc-badge>
          <div>Build VM size</div>
          <cc-badge weight="dimmed">S</cc-badge>
        </div>
      `;
    }
    if (step.name === 'deployment-details-without-build') {
      return html`
        <div style="margin-bottom: 0.5em;"><strong>Deployment configuration</strong></div>
        <div class="deployment-details">
          <div>No down time</div>
          <cc-badge weight="dimmed">Yes</cc-badge>
          <div>Force build</div>
          <cc-badge weight="dimmed">No</cc-badge>
          <div>Dedicated build VM</div>
          <cc-badge weight="dimmed">Yes</cc-badge>
          <div>Build VM size</div>
          <cc-badge weight="dimmed">S</cc-badge>
        </div>
      `;
    }
    if (step.name === 'deployment-start') {
      return html`Deployment started ${formatDate(step.start)}`;
    }

    if (step.name === 'start-vm') {
      return 'Starting virtual machine';
    }
    if (step.name === 'inject-env') {
      return 'Injecting environment variables';
    }
    if (step.name === 'build-cache') {
      return 'Checking for an existing build cache';
    }
    if (step.name === 'download') {
      return 'Downloading build archive';
    }
    if (step.name === 'build-cache-found') {
      return html`We found the build archive for commit <code>e5d6d52</code>`;
    }
    if (step.name === 'build-cache-not-found') {
      return html`We didn't find the build archive for commit <code>e5d6d52</code>`;
    }

    const hookFound = (hook) => {
      return html`We found <code>${hook}</code> environment variable`;
    };

    const hookNotFound = (hook) => {
      return html`We did not find <code>${hook}</code> environment variable. <a href="https://somewhere"
                                                                                target="_blank">More about deployment
        hooks</a>.`;
    };

    if (step.name === 'pre-run-hook') {
      return 'Hook before application start';
    }
    if (step.name === 'pre-run-hook-found') {
      return hookFound('PRE_RUN_HOOK');
    }
    if (step.name === 'pre-run-hook-not-found') {
      return hookNotFound('PRE_RUN_HOOK');
    }

    if (step.name === 'post-run-hook') {
      return 'Hook after application start';
    }
    if (step.name === 'post-run-hook-found') {
      return hookFound('POST_RUN_HOOK');
    }
    if (step.name === 'post-run-hook-not-found') {
      return hookNotFound('POST_RUN_HOOK');
    }

    if (step.name === 'pre-build-hook') {
      return 'Hook before application build';
    }
    if (step.name === 'pre-build-hook-found') {
      return hookFound('PRE_BUILD_HOOK');
    }
    if (step.name === 'pre-build-hook-not-found') {
      return hookNotFound('PRE_BUILD_HOOK');
    }

    if (step.name === 'post-build-hook') {
      return 'Hook after application build';
    }
    if (step.name === 'post-build-hook-found') {
      return hookFound('POST_BUILD_HOOK');
    }
    if (step.name === 'post-build-hook-not-found') {
      return hookNotFound('POST_BUILD_HOOK');
    }

    if (step.name === 'run-hook') {
      return 'Running hook command';
    }

    if (step.name === 'build') {
      return 'Building application';
    }

    if (step.name === 'clone') {
      return 'Fetching the code';
    }

    if (step.name === 'build-command') {
      return 'Running the build command';
    }

    if (step.name === 'start-app') {
      return 'Starting application';
    }

    if (step.name === 'monitoring') {
      return 'Installing monitoring on port 8080';
    }
    if (step.name === 'health-check') {
      return 'Checking health on port 8080';
    }
    if (step.name === 'health-check-ok') {
      return 'Application is healthy';
    }
    if (step.name === 'health-check-ko') {
      return 'Application is not reachable on port 8080';
    }
    if (step.name === 'wire') {
      return 'Connecting traffic to the application';
    }
    if (step.name === 'cron') {
      return 'Setting up scheduled tasks';
    }
    if (step.name === 'setup-cron') {
      return 'Installing CRON';
    }
    if (step.name === 'no-cron') {
      return html`No scheduled tasks defined. Did you know you could <a href="https://somewhere" target="_blank">setup a CRON job</a>?`;
    }

    if (step.name === 'deployment-url') {
      return html`Your application is running at <a href="https://app-3af80970-d8bf-47ab-af5c-e56fb6c481f9.cleverapps.io" target="_blank">https://app-3af80970-d8bf-47ab-af5c-e56fb6c481f9.cleverapps.io</a>`;
    }

    if (step.name === 'deployment-duration') {
      const duration = formatDuration(step.end.getTime() - this.steps[0].start.getTime());
      return html`Deployment took ${duration}.`;
    }

    if (step.name === 'deployment-after-error') {
      return html`A new deployment attempt will be triggered. You can check the <a href="https://somewhere">full logs</a> or <a href="https://somewhere">contact our awesome support team</a>.`;
    }

    return step.name;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        
        :host {
          display: flex;
          flex-direction: column;
          gap: 1em;
          position: relative;
        }

        .timeline {
          position: absolute;

          left: 22px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background-color: var(--color-grey-30);
          z-index: 1;
        }

        .group {

        }

        .group .header {
          display: flex;
          align-items: center;
          gap: 0.5em;
          height: 40px;
        }

        .group .label {
          position: relative;
          left: 2.8em;
          font-size: 1.2em;
          font-weight: bold;
          color: var(--cc-color-text-strong);
        }

        .group .icon {
          position: absolute;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 1em;
          width: 36px;
          height: 36px;
          border: 2px solid var(--color-grey-30);
          background-color: #fff;
          border-radius: 50%;
        }

        .group .details {
          margin-left: 60px;
        }

        .step {
          background-color: var(--cc-color-bg-neutral);
          border: 2px solid var(--cc-color-border-primary-weak);
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          margin-left: 2.5em;
          gap: 0.5em;
        }

        .step-header {
          align-items: center;
          display: flex;
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
          border-left: 3px solid var(--color-grey-20);
          background-color: var(--cc-color-bg-neutral);
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
          padding: 0.8em;
          margin-left: 2.5em;
          color: var(--cc-color-text-primary);
          align-self: flex-start;
          gap: 0.5em;
        }

        .step-info img {
          height: 1em;
          width: 1em;
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
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .sub-step-header.info {
          color: var(--cc-color-text-primary);
        }

        cc-loader {
          height: 1.5em;
          width: 1.5em;
        }

        img {
          height: 1.5em;
          width: 1.5em;
        }

        .sub-step cc-loader {
          height: 1em;
          width: 1em;
        }

        .sub-step img {
          height: 1em;
          width: 1em;
        }

        .deployment-details {
          display: grid;
          flex-direction: column;
          gap: 0.3em;
          grid-template-columns: auto auto;
          grid-column-gap: 0.5em;
          margin-left: 0.3em;
        }

        .deployment-details > div {
          display: inline-flex;
          gap: 0.2em;
          align-items: center;
        }

        .logs-wrapper {
          flex-direction: column;
          width: 100%;
          display: flex;
          align-items: stretch;
          padding: 0.5em;
          border: 1px solid #ccc;
          min-height: 0;
          min-width: 0;
          max-height: 100px;
          max-width: 500px;
        }
        
        cc-logs-poc {
          border: 1px solid var(--cc-color-bg-soft);
          padding: 0.5em;
          max-height: 300px;
          background-color: var(--cc-color-bg-default);
        }
        
        cc-badge {
          font-family: var(--cc-ff-monospace, monospace);
          font-weight: bold;
        }
        
        .deployment-reason {
          display: flex;
          gap: 0.5em;
          flex-direction: column;
        }
        .reason {
          
        }
        .diagram {
          align-self: center;
          display: flex;
          flex-direction: column;
          gap: 1.5em;
          border: 1px solid var(--cc-color-bg-primary-weak);
          padding: 1em;
          background-color: var(--cc-color-bg-default);
          align-items: center;
          border-radius: 3px;
        }
        .diagram-title {
          font-weight: bold;
        }
        .diagram-content {
          
        }
        .diagram-content.vertical-scaling {
          display: flex;
          gap: 0.5em;
          align-items: center;
        }
        
        .diagram-content.new-commit {
          grid-gap: 0.5em;
          align-items: center;
          display: grid;
          flex-direction: column;
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

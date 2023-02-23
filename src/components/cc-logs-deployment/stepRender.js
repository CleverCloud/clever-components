import { html } from 'lit';

const gitSvg = new URL('../../assets/git.svg', import.meta.url).href;
const arrowDownSvg = new URL('../../assets/arrow-down-line.svg', import.meta.url).href;
const arrowRightSvg = new URL('../../assets/arrow-right-line.svg', import.meta.url).href;

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

export function _renderStepLabel (step) {
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
          <cc-badge weight="dimmed">No</cc-badge>
          <div>Build VM size</div>
          <cc-badge weight="dimmed">S</cc-badge>
        </div>
      `;
  }
  if (step.name === 'deployment-details-with-build-dedicated') {
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
          <cc-badge weight="dimmed">No</cc-badge>
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
    // const duration = formatDuration(step.end.getTime() - this.steps[0].start.getTime());
    return html`Deployment took XXX minutes.`;
  }

  if (step.name === 'deployment-after-error') {
    return html`A new deployment attempt will be triggered. You can check the <a href="https://somewhere">full logs</a> or <a href="https://somewhere">contact our awesome support team</a>.`;
  }

  return step.name;
}

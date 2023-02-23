const deploy = (reason, withBuild, dedicatedBuildInstance) => {
  return [
    '$group:deployment-asked',
    `$info:deployment-reason-${reason}`,
    '$info:application-details',
    withBuild ? '$info:deployment-details-with-build' : '$info:deployment-details-without-build',
    '$info:deployment-start',
  ];
};

const prepare = [
  '$group:prepare',
  'start-vm',
  '$wait:1000',
  'inject-env',
  '$logs:100-10',
  'build-cache',
  '$wait:100',
  '$info:build-cache/build-cache-found',
  'build-cache/download',
  '$logs:100-5',
];

const build = [
  '$group:build',
  'pre-build-hook',
  '$wait:100',
  '$info:pre-build-hook/pre-build-hook-not-found',
  'build/clone',
  '$logs:100-20',
  'build/build-command',
  '$logs:100-50',
  'post-build-hook',
  '$wait:100',
  '$info:post-build-hook/post-build-hook-not-found',
];

const run = [
  '$group:run',
  'pre-run-hook',
  '$wait:100',
  '$info:pre-run-hook/pre-run-hook-found',
  'pre-run-hook/run-hook',
  '$wait:5000',
  'start-app',
  '$logs:100-100',
  'post-run-hook',
  '$wait:100',
  '$info:post-run-hook/post-run-hook-not-found',
];

const deliver = [
  '$group:deliver',
  'monitoring/health-check',
  '$info:monitoring/health-check-ok',
  'wire',
  '$info:cron/no-cron',
];

const scenario = (id, withBuild, dedicatedBuildInstance) => {
  const s = {
    reason: deploy(id, withBuild, dedicatedBuildInstance),
    steps: [...prepare],
  };

  if (withBuild && !dedicatedBuildInstance) {
    s.steps = s.steps.concat(build);
  }
  s.steps = s.steps.concat([
    ...run,
    ...deliver,
  ]);
  s.done = ['$success'];

  return s;
};

const reasons = [
  ['user-new-version', true],
  ['user-restart', false],
  ['user-restart-version', false],
  ['user-change-scaling-conf', false],

  ['cc-cpu-load', false],
  ['cc-maintenance', false],
  ['cc-monitoring', false],
  ['cc-support', false],
];

export const scenarios = {
  ...Object.fromEntries(reasons.map((r) => ([r[0], (dedicatedBuildInstance) => scenario(r[0], r[1], dedicatedBuildInstance)]))),
  'error-build': {
    reason: [
      '$group:deployment-asked',
      '$info:deployment-reason',
      '$info:deployment-details',
      '$info:deployment-start',
    ],
    steps: [
      ...prepare,
      '$group:build',
      'pre-build-hook',
      '$wait:100',
      '$info:pre-build-hook/pre-build-hook-not-found',
      'build/clone',
      '$logs:100-20',
      'build/build-command',
      '$logs:100-50',
    ],
    done: [
      '$error',
    ],
  },
};

export const dedicatedBuildInstanceSteps = [
  ...prepare,
  ...build,
];

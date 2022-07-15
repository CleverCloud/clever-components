import { getVariants } from '../lib.js';

const COMMIT_ONE = '99b8617a5e102b318593eed3cd0c0a67e77b7e9a';
const COMMIT_TWO = 'bf4c76b3c563050d32e411b2f06d11515c7d8304';

function app (variantName, variantLogoName, commit = COMMIT_ONE) {
  return {
    name: `Awesome ${variantName} app (PROD)`,
    commit,
    variantName,
    variantLogo: `https://assets.clever-cloud.com/logos/${variantLogoName}.svg`,
    lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
  };
}

const zoneParis = {
  name: 'par',
  country: 'France',
  countryCode: 'fr',
  city: 'Paris',
  tags: ['region:eu', 'infra:clever-cloud'],
};

const baseProperties = [];

export const variants = getVariants({
  app: [
    undefined,
    // app('Docker', 'docker'),
    // app('Go', 'go'),
    // app('Haskell', 'haskell'),
    // app('Java + JAR', 'java-jar'),
    // app('Java + Maven', 'maven'),
    // app('Java + WAR', 'java-war'),
    // app('Java or Scala + Play! 2', 'play2'),
    // app('Node', 'nodejs'),
    // app('PHP', 'php'),
    // app('Python', 'python'),
    // app('Ruby', 'ruby'),
    // app('Scala', 'scala'),
    // app('Static', 'apache'),
    ...getVariants({
      name: ['My Awesome app (PROD)', 'My Awesome app with a very very very very very very very very very very very long name (PROD)'],
    }, [app('Node', 'nodejs')]),
  ],
  disableButtons: [false, true],
  error: [false, true],
  runningCommit: [undefined, COMMIT_ONE],
  startingCommit: [undefined, COMMIT_TWO],
  status: [
    undefined,
    'unknown',
    'starting',
    'running',
    'restarting',
    'restarting-with-downtime',
    'stopped',
    'start-failed',
    'restart-failed',
  ],
  zone: [undefined, zoneParis],
});

// export const variants = [
//   {
//     app: app('Node', 'nodejs'),
//     runningCommit: COMMIT_ONE,
//     startingCommit: COMMIT_TWO,
//     status: 'running',
//     zone: zoneParis,
//   },
// ];

// language=CSS
export const style = `

`;

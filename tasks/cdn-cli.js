import chalk from 'chalk';
import textTable from 'text-table';
import { toCdnEntryName } from './cdn-entry-name.js';
import { CDN_ENVIRONMENTS } from './cdn-environments.js';
import { CdnManager } from './cdn-manager.js';
import { NO_CACHE } from './cellar-client.js';
import { getCurrentBranch } from './git-utils.js';

async function run() {
  const [command, env, name] = process.argv.slice(2);

  if (command === '-h' || command === 'help') {
    return help();
  }

  const cdnEnvironment = getCdnEnvironment(env);
  switch (command) {
    case 'get':
      return get(cdnEnvironment, await getCdnEntryName(cdnEnvironment, name));
    case 'list':
      return list(cdnEnvironment);
    case 'publish':
      return publish(cdnEnvironment, await getCdnEntryName(cdnEnvironment, name));
    case 'delete':
      return remove(cdnEnvironment, await getCdnEntryName(cdnEnvironment, name));
    case 'ui':
      return publishUi(cdnEnvironment);
  }

  console.log(chalk.red.bold('[!] Unknown command'));
  printAvailableCommands();
  process.exit(1);
}

/**
 * @param {CdnEnvironment} cdnEnvironment
 * @param {string} name
 * @return {Promise<string>}
 */
async function getCdnEntryName(cdnEnvironment, name) {
  let _name;
  if (cdnEnvironment.semver) {
    _name = name;
  } else {
    _name = name ?? getCurrentBranch();
  }
  return toCdnEntryName(cdnEnvironment, _name);
}

/**
 * @param {string} env
 * @return {CdnEnvironment}
 */
function getCdnEnvironment(env) {
  if (env == null) {
    throw new Error('env parameter is mandatory');
  }

  const cdnEnvironment = CDN_ENVIRONMENTS[env];
  if (cdnEnvironment == null) {
    throw new Error(`Unsupported env '${env}'. Possible values are: ${supportedEnvironments()}`);
  }

  console.log(
    chalk.magenta(`CDN env '${chalk.bold(cdnEnvironment.name)}' (${chalk.italic(cdnEnvironment.getIndexUrl())})`),
  );
  console.log('-'.repeat(cdnEnvironment.name.length + cdnEnvironment.getIndexUrl().length + 13));

  return cdnEnvironment;
}

/**
 *
 * @param {CdnEnvironment} cdnEnvironment
 * @param name
 * @return {Promise<void>}
 */
async function get(cdnEnvironment, name) {
  const cdnManager = new CdnManager(cdnEnvironment);
  const entry = await cdnManager.get(name);

  if (entry == null) {
    console.log(chalk.red(`[!] CDN entry '${chalk.bold(name)}' not found`));
    process.exit(1);
  }
  console.log(textTable([entryToPrintableDetails(entry)]));
}

async function list(cdnEnvironment) {
  const cdnManager = new CdnManager(cdnEnvironment);
  const entries = await cdnManager.list();

  if (entries.length === 0) {
    console.log(chalk.yellow('(!) No CDN entry right now'));
  } else {
    console.log(chalk.bold(entries.length === 1 ? 'One CDN entry:' : `${entries.length} CDN entries:`));
    console.log();
    const table = entries.map((p) => entryToPrintableDetails(p));
    console.log(textTable(table));
  }
}

async function publish(cdnEnvironment, name) {
  const cdnManager = new CdnManager(cdnEnvironment);
  cdnManager.assertReadyToPublish(name);

  if (await cdnManager.exists(name)) {
    if (cdnEnvironment.isImmutable()) {
      console.log(chalk.red(`[!] CDN entry '${chalk.bold(name)}' already exists`));
      throw new Error(`Cannot update CDN entry on an immutable environment`);
    } else {
      console.log(chalk.yellow(`(!) CDN entry '${chalk.bold(name)}' already exists`));
      await remove(cdnEnvironment, name);
    }
  }

  console.log(`Publishing entry '${chalk.bold(name)}'...`);

  const newEntry = await cdnManager.publish(name);
  console.log(chalk.green(`CDN entry '${chalk.bold(name)}' available at: ${chalk.underline(newEntry.url)}`));
}

async function remove(cdnEnvironment, name) {
  const cdnManager = new CdnManager(cdnEnvironment);
  if (await cdnManager.exists(name)) {
    console.log(`Deleting CDN entry '${chalk.bold(name)}'...`);
    await cdnManager.remove(name);
    console.log(chalk.green(`CDN entry '${chalk.bold(name)}' deleted`));
  } else {
    console.log(chalk.yellow(`(!) CDN entry '${chalk.bold(name)}' not found`));
  }
}

async function publishUi(cdnEnvironment) {
  console.log(`Publishing CDN UI on '${chalk.bold(cdnEnvironment.name)}' environment...`);

  await cdnEnvironment.createCellarClient().sync({
    localDir: 'cdn-ui',
    cacheControl: NO_CACHE,
  });

  console.log(chalk.green(`CDN UI published on '${chalk.bold(cdnEnvironment.name)}' environment`));
  console.log(`  index: ${chalk.underline(cdnEnvironment.getIndexUrl())}`);
  console.log(`  list:  ${chalk.underline(cdnEnvironment.getListUrl())}`);
}

function entryToPrintableDetails(entry) {
  return [
    ...entry.updatedAt.substring(0, 19).split('T'),
    chalk.red(entry.commitId.substring(0, 8)),
    chalk.bold.yellow(entry.name),
    chalk.green(entry.author),
    '\n  ' + chalk.italic.blue(entry.url),
  ];
}

async function help() {
  console.log(chalk.bold.blue('CDN manager CLI'));
  console.log();
  console.log(chalk.italic('With this CLI you can manage the CDN entries.'));
  printAvailableCommands();
  console.log();
  console.log(`Supported environments (<ENV>): ${supportedEnvironments()}`);
  console.log(
    `The <NAME> argument is mandatory for environments 'release' and 'staging'. For environment 'preview', the argument is optional (current git branch will be used if omitted).`,
  );
}

function printAvailableCommands() {
  console.log('\nAvailable commands:');
  console.log(`  ${chalk.bold('-h, help')}                 get help for command`);
  console.log(`  ${chalk.bold('get <ENV> <NAME?>')}        get a CDN entry`);
  console.log(`  ${chalk.bold('list <ENV>')}               list CDN entries`);
  console.log(`  ${chalk.bold('publish <ENV> <NAME?>')}    publish a CDN entry`);
  console.log(`  ${chalk.bold('delete <ENV> <NAME?>')}     delete a CDN entry`);
  console.log(`  ${chalk.bold('ui <ENV>')}                 publish the CDN UI`);
}

function supportedEnvironments() {
  return chalk.bold(Object.keys(CDN_ENVIRONMENTS).join(', '));
}

run().catch((e) => {
  console.log(chalk.red.bold('[!] An error occurred!'));
  console.error(e);
  process.exit(1);
});

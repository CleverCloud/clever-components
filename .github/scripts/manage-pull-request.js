import { createConfigBuilder } from '@clevercloud/reglage';
import { Octokit } from '@octokit/rest';
import { appendFile, readFile } from 'node:fs/promises';
import { z } from 'zod';
import { describeOptions, exitWithConfigErrors, pickKeysFromObject, readFileAsSchema } from './config-utils.js';

/**
 * @import { RestEndpointMethodTypes } from '@octokit/rest'
 * @import { ConfigBuilder, InvalidConfigError } from '@clevercloud/reglage'
 */

/**
 * Catalogue of every option these actions can read, with its Zod schema and
 * documentation. This is the single source of truth: validation, coercion and
 * the usage text are all derived from here.
 *
 * BODY / BODY_FILE_PATH and REVIEWERS / REVIEWERS_FILE_PATH use optional schemas
 * because each pair is "either, or neither" rather than a required value. When a
 * `*_FILE_PATH` is set, its contents are resolved in `#resolveConfig()` (BODY) or
 * `getReviewers()` (reviewers).
 */
const OPTIONS = /** @type {const} */ ({
  GITHUB_TOKEN: { schema: z.string().min(1), secret: true, documentation: 'GitHub API token' },
  GITHUB_REPOSITORY: {
    schema: z.string().regex(/^[^/]+\/[^/]+$/, 'must be in owner/repo format'),
    documentation: 'Repository in format owner/repo',
  },
  TITLE: { schema: z.string().min(1), documentation: 'Pull request title' },
  HEAD: { schema: z.string().min(1), documentation: 'Source branch (the branch with changes)' },
  BASE: { schema: z.string().min(1), documentation: 'Target branch (where to merge into)' },
  BODY: { schema: z.string().optional(), documentation: 'Pull request body as string' },
  BODY_FILE_PATH: { schema: z.string().optional(), documentation: 'Path to file containing pull request body' },
  PR_NUMBER: { schema: z.coerce.number().int().positive(), documentation: 'Pull request number' },
  REVIEWERS: {
    schema: z.string().optional(),
    documentation: 'Comma-separated list of GitHub handles (overrides file)',
  },
  REVIEWERS_FILE_PATH: {
    schema: z.string().optional(),
    documentation: 'Path to a JSON file containing an array of handles',
  },
});

/**
 * The per-action schema. Built via `pickKeysFromObject()` so the type system knows
 * exactly which options that action reads, including the Zod schemas and
 * documentation attached to each key. `#resolveConfig(action)` then returns a
 * config narrowed to that exact subset, so e.g.
 * `#resolveConfig('assign-reviewers').get('BODY')` is a compile error.
 */
const ACTION_OPTIONS = {
  create: pickKeysFromObject(
    ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'TITLE', 'HEAD', 'BASE', 'BODY', 'BODY_FILE_PATH'],
    OPTIONS,
  ),
  'assign-reviewers': pickKeysFromObject(
    ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'REVIEWERS', 'REVIEWERS_FILE_PATH'],
    OPTIONS,
  ),
};

/**
 * GitHub Client for creating pull requests
 */
class GithubPullRequestClient {
  /**
   * @param {string} token - GitHub API token
   */
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Create a new pull request
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} title - Pull request title
   * @param {string} head - Source branch
   * @param {string} base - Target branch
   * @param {string} [body] - Pull request body (optional)
   * @returns {Promise<RestEndpointMethodTypes["pulls"]["create"]["response"]["data"]>}
   */
  async createPullRequest(owner, repo, title, head, base, body) {
    try {
      const response = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
        body,
      });
      console.log(`✓ Created PR #${response.data.number} at ${response.data.html_url}`);
      return response.data;
    } catch (err) {
      console.error('✗ Error creating pull request:', err instanceof Error ? err.message : 'unknown');
      process.exit(1);
    }
  }

  /**
   * Request reviews on a pull request
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @param {string[]} reviewers - GitHub handles to request reviews from
   */
  async assignReviewers(owner, repo, prNumber, reviewers) {
    try {
      const response = await this.octokit.rest.pulls.requestReviewers({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        pull_number: prNumber,
        reviewers,
      });
      console.log(`✓ Requested review from ${reviewers.join(', ')} on ${owner}/${repo}#${prNumber}`);
      return response.data;
    } catch (err) {
      console.error('✗ Error requesting reviewers:', err instanceof Error ? err.message : 'unknown');
      process.exit(1);
    }
  }
}

/**
 * Command-line interface manager for GitHub pull request operations
 */
class PullRequestActionManager {
  constructor() {
    this.client = null;
  }

  /**
   * @param {string} action
   * @returns {action is keyof typeof ACTION_OPTIONS}
   */
  isValidAction(action) {
    return Object.keys(ACTION_OPTIONS).includes(action);
  }

  printUsage() {
    console.log(`
Usage: node manage-pull-request.js <action>

Actions:
  create            Create a new pull request
  assign-reviewers  Request reviews on an existing pull request

Environment variables by action:

  create:
    Required: GITHUB_TOKEN, GITHUB_REPOSITORY, TITLE, HEAD, BASE
    Optional: BODY or BODY_FILE_PATH (PR body)

  assign-reviewers:
    Required: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER
    Optional: REVIEWERS (comma-separated, overrides the file) or
              REVIEWERS_FILE_PATH (JSON array of handles,
              defaults to .github/reviewers.json)

Variable descriptions:
${describeOptions(OPTIONS)}
`);
  }

  /**
   * Resolve and validate an action's config from `process.env`. Exits with the
   * validation errors if anything is missing or malformed.
   *
   * Called with a literal action, the returned config is narrowed to exactly the
   * options that action reads: e.g. reading `PR_NUMBER` off a `create` config is
   * a compile error because `create` never has it.
   * @template {keyof typeof ACTION_OPTIONS} A
   * @param {A} action
   */
  #resolveConfig(action) {
    const builder = createConfigBuilder(ACTION_OPTIONS[action]);
    builder.addSource('env', process.env);

    // When BODY_FILE_PATH is set, the PR body is read from that file; this lives in
    // a cross-field refinement so reading (and any read error) flows through the same
    // config-validation path. BODY stays optional — unlike a comment, a PR body is not
    // required. Only `create` carries BODY; the builder is typed for the generic action
    // `A`, hence the single cast to the body-bearing subset.
    if ('BODY' in ACTION_OPTIONS[action]) {
      /** @type {ConfigBuilder<Pick<typeof OPTIONS, 'BODY' | 'BODY_FILE_PATH'>>} */ (builder).refine(
        'BODY',
        (schema, resolved) => {
          const filePath = resolved.BODY_FILE_PATH;
          return typeof filePath === 'string' ? readFileAsSchema(filePath, 'body') : schema;
        },
      );
    }

    try {
      return builder.buildConfig();
    } catch (error) {
      exitWithConfigErrors(/** @type {InvalidConfigError} */ (error));
    }
  }

  /**
   * Resolve the list of reviewers.
   * Priority: REVIEWERS env (comma-separated) overrides the JSON file.
   * The file defaults to .github/reviewers.json and must contain a JSON array of handles.
   * @param {string | undefined} reviewers
   * @param {string | undefined} reviewersFilePath
   * @returns {Promise<string[]>}
   */
  async getReviewers(reviewers, reviewersFilePath) {
    if (reviewers) {
      return this.#parseReviewers(reviewers);
    }
    const filePath = reviewersFilePath ?? '.github/reviewers.json';
    try {
      const parsed = JSON.parse(await readFile(filePath, { encoding: 'utf-8' }));
      if (!Array.isArray(parsed)) {
        throw new Error(`${filePath} must contain a JSON array of GitHub handles`);
      }
      return parsed.map((handle) => String(handle).trim()).filter(Boolean);
    } catch (error) {
      console.error('✗ Error reading reviewers file:', error instanceof Error ? error.message : 'unknown');
      process.exit(1);
    }
  }

  /**
   * @param {string} value
   * @returns {string[]}
   */
  #parseReviewers(value) {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Validate and parse inputs for the given action.
   * @param {keyof typeof ACTION_OPTIONS} action
   */
  async validateAndGetInputs(action) {
    if (action === 'create') {
      const config = this.#resolveConfig('create');
      const [owner, repo] = config.get('GITHUB_REPOSITORY').split('/');
      return {
        owner,
        repo,
        title: config.get('TITLE'),
        head: config.get('HEAD'),
        base: config.get('BASE'),
        body: config.get('BODY'),
      };
    }

    const config = this.#resolveConfig('assign-reviewers');
    const [owner, repo] = config.get('GITHUB_REPOSITORY').split('/');
    const reviewers = await this.getReviewers(config.get('REVIEWERS'), config.get('REVIEWERS_FILE_PATH'));
    if (reviewers.length === 0) {
      console.error('✗ No reviewers resolved (set the REVIEWERS env var or populate the reviewers file)');
      process.exit(1);
    }
    return {
      owner,
      repo,
      prNumber: config.get('PR_NUMBER'),
      reviewers,
    };
  }

  /**
   * Write key/value pairs to the GitHub Actions step output file, if available.
   * @param {Record<string, string | number>} outputs
   */
  async #writeStepOutputs(outputs) {
    if (!process.env.GITHUB_OUTPUT) {
      return;
    }
    const lines = Object.entries(outputs)
      .map(([key, value]) => `${key}=${value}\n`)
      .join('');
    try {
      await appendFile(process.env.GITHUB_OUTPUT, lines);
    } catch (err) {
      console.error('✗ Error writing step outputs:', err instanceof Error ? err.message : 'unknown');
      process.exit(1);
    }
  }

  /** @param {keyof typeof ACTION_OPTIONS} action */
  async executeAction(action) {
    const inputs = await this.validateAndGetInputs(action);
    this.client = new GithubPullRequestClient(process.env.GITHUB_TOKEN);

    switch (action) {
      case 'create': {
        const { owner, repo, title, head, base, body } = inputs;
        const pr = await this.client.createPullRequest(owner, repo, title, head, base, body);
        await this.#writeStepOutputs({
          // eslint-disable-next-line camelcase
          pr_number: pr.number,
          // eslint-disable-next-line camelcase
          pr_url: pr.html_url,
        });
        break;
      }

      case 'assign-reviewers': {
        const { owner, repo, prNumber, reviewers } = inputs;
        await this.client.assignReviewers(owner, repo, prNumber, reviewers);
        break;
      }
    }
  }
}

async function main() {
  const action = process.argv[2];
  const manager = new PullRequestActionManager();

  if (!action) {
    console.error('Error: No action specified');
    manager.printUsage();
    process.exit(1);
  }

  if (!manager.isValidAction(action)) {
    console.error(`Error: Invalid action "${action}"`);
    manager.printUsage();
    process.exit(1);
  }

  try {
    await manager.executeAction(action);
  } catch (error) {
    console.error('✗ Unexpected error:', error instanceof Error ? error.message : 'unknown');
    process.exit(1);
  }
}

main();

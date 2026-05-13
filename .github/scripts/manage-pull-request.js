import { Octokit } from '@octokit/rest';
import { appendFile, readFile } from 'node:fs/promises';

/**
 * @typedef {import('@octokit/rest').RestEndpointMethodTypes} RestEndpointMethodTypes
 */

const ACTIONS = /** @type {const} */ (['create', 'assign-reviewers']);

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
   * @returns {action is typeof ACTIONS[number]}
   */
  isValidAction(action) {
    return ACTIONS.includes(/** @type {typeof ACTIONS[number]} */ (action));
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
  GITHUB_TOKEN        GitHub API token
  GITHUB_REPOSITORY   Repository in format owner/repo
  TITLE               Pull request title
  HEAD                Source branch (the branch with changes)
  BASE                Target branch (where to merge into)
  BODY                Pull request body as string
  BODY_FILE_PATH      Path to file containing pull request body
  PR_NUMBER           Pull request number
  REVIEWERS           Comma-separated list of GitHub handles (overrides file)
  REVIEWERS_FILE_PATH Path to a JSON file containing an array of handles
`);
  }

  async getMessageBody() {
    if (process.env.BODY_FILE_PATH) {
      try {
        return await readFile(process.env.BODY_FILE_PATH, { encoding: 'utf-8' });
      } catch (error) {
        console.error('✗ Error reading message file:', error instanceof Error ? error.message : 'unknown');
        process.exit(1);
      }
    }
    return process.env.BODY;
  }

  /**
   * Resolve the list of reviewers.
   * Priority: REVIEWERS env (comma-separated) overrides the JSON file.
   * The file defaults to .github/reviewers.json and must contain a JSON array of handles.
   * @returns {Promise<string[]>}
   */
  async getReviewers() {
    if (process.env.REVIEWERS) {
      return this.#parseReviewers(process.env.REVIEWERS);
    }
    const filePath = process.env.REVIEWERS_FILE_PATH ?? '.github/reviewers.json';
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
   * Configuration mapping actions to their required environment variables
   * @type {Record<typeof ACTIONS[number], string[]>}
   */
  #actionConfig = {
    create: ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'TITLE', 'HEAD', 'BASE'],
    'assign-reviewers': ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER'],
  };

  /**
   * Validate environment variables for the given action
   * @param {typeof ACTIONS[number]} action
   * @returns {string[]} Array of validation errors
   */
  #validateEnvironment(action) {
    const errors = [];
    const requiredEnvVars = this.#actionConfig[action];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        errors.push(`${envVar} is required`);
      }
    }

    return errors;
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
   * Retrieve and parse input values from environment variables
   * @param {typeof ACTIONS[number]} action
   */
  async #getInputsFromEnvironment(action) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    if (action === 'create') {
      const body = await this.getMessageBody();
      return {
        owner,
        repo,
        title: process.env.TITLE,
        head: process.env.HEAD,
        base: process.env.BASE,
        body,
      };
    }

    const reviewers = await this.getReviewers();
    if (reviewers.length === 0) {
      console.error('✗ No reviewers resolved (set the REVIEWERS env var or populate the reviewers file)');
      process.exit(1);
    }
    return {
      owner,
      repo,
      prNumber: Number(process.env.PR_NUMBER),
      reviewers,
    };
  }

  /** @param {typeof ACTIONS[number]} action */
  async validateAndGetInputs(action) {
    const errors = this.#validateEnvironment(action);

    if (errors.length > 0) {
      console.error('Environment validation errors:');
      errors.forEach((error) => console.error(`  - ${error}`));
      console.error('\nRun with no arguments to see usage information.');
      process.exit(1);
    }

    return await this.#getInputsFromEnvironment(action);
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

  /** @param {typeof ACTIONS[number]} action */
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

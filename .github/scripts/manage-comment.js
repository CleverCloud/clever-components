import { createConfigBuilder } from '@clevercloud/reglage';
import { Octokit } from '@octokit/rest';
import { z } from 'zod';
import { describeOptions, exitWithConfigErrors, pickKeysFromObject, readFileAsSchema } from './config-utils.js';

/**
 * @import { RestEndpointMethodTypes } from '@octokit/rest'
 * @import { ConfigBuilder, InvalidConfigError } from '@clevercloud/reglage'
 * @typedef {RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"]} CommentList
 */

/**
 * Catalogue of every option these actions can read, with its Zod schema and
 * documentation. This is the single source of truth: validation, coercion and
 * the usage text are all derived from here.
 *
 * MESSAGE / MESSAGE_FILE_PATH use optional schemas because the requirement is
 * "one of them" rather than a single named variable; that is enforced in
 * `validateAndGetInputs()`. MARKER is required, but only included in
 * `ACTION_OPTIONS` for the actions that need it.
 */
const OPTIONS = /** @type {const} */ ({
  GITHUB_TOKEN: { schema: z.string().min(1), secret: true, documentation: 'GitHub API token' },
  GITHUB_REPOSITORY: {
    schema: z.string().regex(/^[^/]+\/[^/]+$/, 'must be in owner/repo format'),
    documentation: 'Repository in format owner/repo',
  },
  PR_NUMBER: { schema: z.coerce.number().int().positive(), documentation: 'Pull request number' },
  MARKER: { schema: z.string().min(1), documentation: 'Unique identifier to find existing comments' },
  MESSAGE: { schema: z.string().optional(), documentation: 'Comment body as string' },
  MESSAGE_FILE_PATH: { schema: z.string().optional(), documentation: 'Path to file containing comment body' },
});

/**
 * The per-action schema. Built via `pickKeysFromObject()` so the type system knows
 * exactly which options that action reads, including the Zod schemas and
 * documentation attached to each key. `#resolveConfig(action)` then returns a
 * config narrowed to that exact subset, so e.g.
 * `#resolveConfig('delete').get('MESSAGE')` is a compile error.
 */
const ACTION_OPTIONS = {
  create: pickKeysFromObject(
    ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MESSAGE', 'MESSAGE_FILE_PATH'],
    OPTIONS,
  ),
  edit: pickKeysFromObject(
    ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MARKER', 'MESSAGE', 'MESSAGE_FILE_PATH'],
    OPTIONS,
  ),
  delete: pickKeysFromObject(['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MARKER'], OPTIONS),
  'create-or-edit': pickKeysFromObject(
    ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MARKER', 'MESSAGE', 'MESSAGE_FILE_PATH'],
    OPTIONS,
  ),
};

/**
 * GitHub Client for managing comments on pull requests
 */
class GithubCommentClient {
  /**
   * @param {string} token - GitHub API token
   */
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Get the authenticated bot login
   * @returns {Promise<string>} Bot login name
   */
  async getBotLogin() {
    try {
      const { data: user } = await this.octokit.rest.users.getAuthenticated();
      console.log('logged in as', user.login);
      return user.login;
    } catch {
      return 'github-actions[bot]';
    }
  }

  /**
   * Get all comments for a pull request
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @returns {Promise<CommentList>}
   */
  async getComments(owner, repo, prNumber) {
    try {
      const { data } = await this.octokit.issues.listComments({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        issue_number: prNumber,
      });
      return data;
    } catch (err) {
      console.error('Error fetching comments:', err);
      process.exit(1);
    }
  }

  /**
   * Find a specific comment by bot and marker
   * @param {CommentList} comments
   * @param {string} botLogin
   * @param {string} marker
   */
  #findTargetComment(comments, botLogin, marker) {
    return comments.find(
      (c) => c.user && c.user.login === botLogin && typeof c.body === 'string' && c.body.includes(marker),
    );
  }

  /**
   * Find an existing comment by bot and marker
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @param {string} marker - Marker to identify the comment
   */
  async findExistingComment(owner, repo, prNumber, marker) {
    const botLogin = await this.getBotLogin();
    const comments = await this.getComments(owner, repo, prNumber);
    return this.#findTargetComment(comments, botLogin, marker);
  }

  /**
   * Create a new comment on a pull request
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} prNumber - Pull request number
   * @param {string} body - Comment body
   */
  async createComment(owner, repo, prNumber, body) {
    try {
      const response = await this.octokit.rest.issues.createComment({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        issue_number: prNumber,
        body,
      });
      console.log(`✓ Created new comment (id: ${response.data.id}) on ${owner}/${repo}#${prNumber}`);
      return response.data;
    } catch (err) {
      console.error('✗ Error creating comment:', err instanceof Error ? err.message : 'unknown');
      process.exit(1);
    }
  }

  /**
   * Edit an existing comment
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} commentId - Comment ID to edit
   * @param {string} body - New comment body
   * @param {number} prNumber - Pull request number
   */
  async editComment(owner, repo, commentId, body, prNumber) {
    try {
      const response = await this.octokit.rest.issues.updateComment({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        comment_id: commentId,
        body,
      });
      console.log(`✓ Edited comment (id: ${commentId}) on ${owner}/${repo}#${prNumber}`);
      return response.data;
    } catch (err) {
      console.error('✗ Error editing comment:', err instanceof Error ? err.message : 'unknown');
      process.exit(1);
    }
  }

  /**
   * Delete a comment
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} commentId - Comment ID to delete
   * @param {number} prNumber - Pull request number
   */
  async deleteComment(owner, repo, commentId, prNumber) {
    try {
      await this.octokit.rest.issues.deleteComment({
        owner,
        repo,
        // eslint-disable-next-line camelcase
        comment_id: commentId,
      });
      console.log(`✓ Deleted comment (id: ${commentId}) on ${owner}/${repo}#${prNumber}`);
    } catch (err) {
      console.error('✗ Error deleting comment:', err instanceof Error ? err.message : 'unknown');
      process.exit(1);
    }
  }
}

/**
 * Command-line interface manager for GitHub comment operations
 */
class CommentActionManager {
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
Usage: node manage-comment.js <action>

Actions:
  create         Create a new comment
  edit           Edit an existing comment
  delete         Delete an existing comment
  create-or-edit Create comment if it doesn't exist, edit if it does

Environment variables by action:

  create:
    Required: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, MESSAGE or MESSAGE_FILE_PATH

  edit:
    Required: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, MARKER, MESSAGE or MESSAGE_FILE_PATH

  delete:
    Required: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, MARKER

  create-or-edit:
    Required: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, MARKER, MESSAGE or MESSAGE_FILE_PATH

Variable descriptions:
${describeOptions(OPTIONS)}
`);
  }

  /**
   * Resolve and validate an action's config from `process.env`. Exits with the
   * validation errors if anything is missing or malformed.
   *
   * Called with a literal action, the returned config is narrowed to exactly the
   * options that action reads: e.g. `#resolveConfig('delete').get('MESSAGE')` is a
   * compile error because `delete` never has a message.
   * @template {keyof typeof ACTION_OPTIONS} A
   * @param {A} action
   */
  #resolveConfig(action) {
    const builder = createConfigBuilder(ACTION_OPTIONS[action]);
    builder.addSource('env', process.env);

    // The "one of MESSAGE / MESSAGE_FILE_PATH" rule can't be expressed at the
    // per-field schema level, so it lives in a cross-field refinement. Only the
    // body-bearing actions carry MESSAGE; `delete` does not. The builder is typed
    // for the generic action `A`, hence the single cast to bridge it to the
    // message-bearing subset.
    if ('MESSAGE' in ACTION_OPTIONS[action]) {
      const MESSAGE_OR_FILE_REQUIRED = 'MESSAGE or MESSAGE_FILE_PATH is required for this action';
      /** @type {ConfigBuilder<Pick<typeof OPTIONS, 'MESSAGE' | 'MESSAGE_FILE_PATH'>>} */ (builder).refine(
        'MESSAGE',
        (_schema, resolved) => {
          const filePath = resolved.MESSAGE_FILE_PATH;
          if (typeof filePath === 'string') {
            return readFileAsSchema(filePath, 'message');
          }
          return z.string({ error: MESSAGE_OR_FILE_REQUIRED }).min(1, MESSAGE_OR_FILE_REQUIRED);
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
   * Validate and parse inputs for the given action. Required env vars and the
   * "one of MESSAGE / MESSAGE_FILE_PATH" rule (including reading the file) are all
   * enforced by `#resolveConfig()`, so `MESSAGE` resolves to the final body.
   *
   * @param {keyof typeof ACTION_OPTIONS} action
   */
  validateAndGetInputs(action) {
    if (action === 'delete') {
      const config = this.#resolveConfig('delete');
      const [owner, repo] = config.get('GITHUB_REPOSITORY').split('/');
      return {
        owner,
        repo,
        prNumber: config.get('PR_NUMBER'),
        marker: config.get('MARKER'),
      };
    }

    if (action === 'create') {
      const config = this.#resolveConfig('create');
      const [owner, repo] = config.get('GITHUB_REPOSITORY').split('/');
      const body = /** @type {string} */ (config.get('MESSAGE'));
      return {
        owner,
        repo,
        prNumber: config.get('PR_NUMBER'),
        body,
      };
    }

    // `edit` and `create-or-edit` share the same shape (marker + body).
    const config = this.#resolveConfig(action);
    const [owner, repo] = config.get('GITHUB_REPOSITORY').split('/');
    const body = /** @type {string} */ (config.get('MESSAGE'));
    return {
      owner,
      repo,
      prNumber: config.get('PR_NUMBER'),
      marker: config.get('MARKER'),
      body,
    };
  }

  /** @param {keyof typeof ACTION_OPTIONS} action */
  async executeAction(action) {
    const { owner, repo, prNumber, marker, body } = this.validateAndGetInputs(action);
    this.client = new GithubCommentClient(process.env.GITHUB_TOKEN);

    switch (action) {
      case 'create': {
        await this.client.createComment(owner, repo, prNumber, body);
        break;
      }

      case 'edit': {
        const targetComment = await this.client.findExistingComment(owner, repo, prNumber, marker);

        if (!targetComment) {
          console.error(`✗ No comment found with marker "${marker}"`);
          process.exit(1);
        }

        await this.client.editComment(owner, repo, targetComment.id, body, prNumber);
        break;
      }

      case 'delete': {
        const targetComment = await this.client.findExistingComment(owner, repo, prNumber, marker);

        if (!targetComment) {
          console.log(`ℹ No comment found with marker "${marker}" - nothing to delete`);
          return;
        }

        await this.client.deleteComment(owner, repo, targetComment.id, prNumber);
        break;
      }

      case 'create-or-edit': {
        const targetComment = await this.client.findExistingComment(owner, repo, prNumber, marker);

        if (targetComment) {
          await this.client.editComment(owner, repo, targetComment.id, body, prNumber);
        } else {
          await this.client.createComment(owner, repo, prNumber, body);
        }
        break;
      }
    }
  }
}

async function main() {
  const action = process.argv[2];
  const manager = new CommentActionManager();

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

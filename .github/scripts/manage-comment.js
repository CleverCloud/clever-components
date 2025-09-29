import { Octokit } from '@octokit/rest';
import { readFile } from 'node:fs/promises';

/**
 * @typedef {import('@octokit/rest').RestEndpointMethodTypes} RestEndpointMethodTypes
 */

const ACTIONS = /** @type {const} */ (['create', 'edit', 'delete', 'create-or-edit']);

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
   * @returns {Promise<RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"]>}
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
   * @param {RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"]} comments
   * @param {string} botLogin
   * @param {string} marker
   */
  #findTargetComment(comments, botLogin, marker) {
    return comments.find(
      (c) => c.user && c.user.login === botLogin && typeof c.body === 'string' && c.body.includes(marker),
    );
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
   * @returns {action is typeof ACTIONS[number]}
   */
  isValidAction(action) {
    return ACTIONS.includes(/** @type {typeof ACTIONS[number]} */ (action));
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
  GITHUB_TOKEN      GitHub API token
  GITHUB_REPOSITORY Repository in format owner/repo
  PR_NUMBER         Pull request number
  MARKER            Unique identifier to find existing comments
  MESSAGE           Comment body as string
  MESSAGE_FILE_PATH Path to file containing comment body
`);
  }

  async getMessageBody() {
    if (process.env.MESSAGE_FILE_PATH) {
      try {
        return await readFile(process.env.MESSAGE_FILE_PATH, { encoding: 'utf-8' });
      } catch (error) {
        console.error('✗ Error reading message file:', error instanceof Error ? error.message : 'unknown');
        process.exit(1);
      }
    }
    return process.env.MESSAGE;
  }

  /**
   * Configuration mapping actions to their required environment variables
   * @type {Record<typeof ACTIONS[number], string[]>}
   */
  #actionConfig = {
    create: ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MESSAGE_OR_FILE'],
    edit: ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MARKER', 'MESSAGE_OR_FILE'],
    delete: ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MARKER'],
    'create-or-edit': ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'PR_NUMBER', 'MARKER', 'MESSAGE_OR_FILE'],
  };

  /**
   * Validate environment variables for the given action
   * @param {typeof ACTIONS[number]} action
   * @returns {string[]} Array of validation errors
   */
  #validateEnvironment(action) {
    const errors = [];
    const requiredEnvVars = this.#actionConfig[action];

    // Validate required environment variables
    for (const envVar of requiredEnvVars) {
      if (envVar === 'MESSAGE_OR_FILE') {
        // Special case: either MESSAGE or MESSAGE_FILE_PATH is required
        if (!process.env.MESSAGE && !process.env.MESSAGE_FILE_PATH) {
          errors.push('MESSAGE or MESSAGE_FILE_PATH is required for this action');
        }
      } else if (!process.env[envVar]) {
        errors.push(`${envVar} is required`);
      }
    }

    return errors;
  }

  /**
   * Retrieve and parse input values from environment variables
   * @param {typeof ACTIONS[number]} action
   * @returns {Promise<{owner: string, repo: string, prNumber: number, marker?: string, body?: string}>}
   */
  async #getInputsFromEnvironment(action) {
    const requiredEnvVars = this.#actionConfig[action];
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const prNumber = Number(process.env.PR_NUMBER);
    const marker = requiredEnvVars.includes('MARKER') ? process.env.MARKER : undefined;
    const body = requiredEnvVars.includes('MESSAGE_OR_FILE') ? await this.getMessageBody() : undefined;

    return { owner, repo, prNumber, marker, body };
  }

  /** @param {typeof ACTIONS[number]} action */
  async validateAndGetInputs(action) {
    // Step 1: Validate environment variables
    const errors = this.#validateEnvironment(action);

    if (errors.length > 0) {
      console.error('Environment validation errors:');
      errors.forEach((error) => console.error(`  - ${error}`));
      console.error('\nRun with no arguments to see usage information.');
      process.exit(1);
    }

    // Step 2: Retrieve and parse inputs
    return await this.#getInputsFromEnvironment(action);
  }

  /** @param {typeof ACTIONS[number]} action */
  async executeAction(action) {
    const { owner, repo, prNumber, marker, body } = await this.validateAndGetInputs(action);
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

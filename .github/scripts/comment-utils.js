import { Octokit } from '@octokit/rest';
import { readFile } from 'node:fs/promises';

/**
 * @typedef {import('@octokit/rest').RestEndpointMethodTypes} RestEndpointMethodTypes
 */

export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getBotLogin() {
  try {
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log('logged in as', user.login);
    return user.login;
  } catch {
    return 'github-actions[bot]';
  }
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {number} prNumber
 */
export async function getComments(owner, repo, prNumber) {
  try {
    const { data } = await octokit.issues.listComments({
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
 * @param {RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"]} comments
 * @param {string} botLogin
 * @param {string} marker
 */
export function findTargetComment(comments, botLogin, marker) {
  return comments.find(
    (c) => c.user && c.user.login === botLogin && typeof c.body === 'string' && c.body.includes(marker),
  );
}

export async function getEssentialInfo({ requireMessage = false } = {}) {
  const missingVars = [];
  if (process.env.GITHUB_REPOSITORY == null) {
    missingVars.push('GITHUB_REPOSITORY');
  }
  if (process.env.PR_NUMBER == null) {
    missingVars.push('PR_NUMBER');
  }

  let body;
  if (requireMessage) {
    if (process.env.MESSAGE_FILE_PATH != null) {
      try {
        body = await readFile(process.env.MESSAGE_FILE_PATH, { encoding: 'utf-8' });
      } catch (error) {
        console.error('Error while retrieving the file', error);
        process.exit(1);
      }
    } else {
      if (process.env.MESSAGE == null) {
        missingVars.push('MESSAGE or MESSAGE_FILE_PATH');
      }
      body = process.env.MESSAGE;
    }
  }

  if (process.env.MARKER == null) {
    missingVars.push('MARKER');
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const prNumber = Number(process.env.PR_NUMBER);
  const marker = process.env.MARKER;

  return requireMessage ? { owner, repo, prNumber, marker, body } : { owner, repo, prNumber, marker };
}

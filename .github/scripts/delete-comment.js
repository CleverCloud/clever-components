// eslint-disable-next-line import/no-unresolved
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function main() {
  const { owner, repo, marker, prNumber } = await getEssentialInfo();
  const botLogin = await getBotLogin();
  const comments = await getComments(owner, repo, prNumber);
  const targetComment = findTargetComment(comments, botLogin, marker);

  if (targetComment != null) {
    await deleteComment(owner, repo, targetComment.id, prNumber);
  }
}

main();

async function getBotLogin() {
  try {
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log('logged in as', user.login);
    return user.login;
  } catch {
    return 'github-actions[bot]';
  }
}

async function getComments(owner, repo, prNumber) {
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

function findTargetComment(comments, botLogin, marker) {
  return comments.find(
    (c) => c.user && c.user.login === botLogin && typeof c.body === 'string' && c.body.includes(marker),
  );
}

async function deleteComment(owner, repo, commentId, prNumber) {
  try {
    await octokit.rest.issues.deleteComment({
      owner,
      repo,
      // eslint-disable-next-line camelcase
      comment_id: commentId,
    });
    console.log(`Deleted comment (id: ${commentId}) on ${owner}/${repo}#${prNumber}`);
  } catch (err) {
    console.error('Error deleting comment:', err);
    process.exit(1);
  }
}

async function getEssentialInfo() {
  const missingVars = [];
  if (process.env.GITHUB_REPOSITORY == null) {
    missingVars.push('GITHUB_REPOSITORY');
  }
  if (process.env.PR_NUMBER == null) {
    missingVars.push('PR_NUMBER');
  }
  if (process.env.MARKER == null) {
    missingVars.push('MARKER');
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const prNumber = process.env.PR_NUMBER;
  const marker = process.env.MARKER;

  return { owner, repo, prNumber, marker };
}

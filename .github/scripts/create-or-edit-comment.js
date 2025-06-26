import { Octokit } from '@octokit/rest';
import { readFile } from 'node:fs/promises';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function main() {
  const { owner, repo, marker, prNumber, body } = await getEssentialInfo();
  const botLogin = await getBotLogin();
  const comments = await getComments(owner, repo, prNumber);
  const targetComment = findTargetComment(comments, botLogin, marker);

  if (targetComment != null) {
    await editComment(owner, repo, targetComment.id, body, prNumber);
  } else {
    await createComment(owner, repo, prNumber, body);
  }
}

main();

async function getBotLogin() {
  try {
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log('logged in as', user.login);
    return user.login;
  } catch (e) {
    return 'github-actions[bot]';
  }
}

async function getComments(owner, repo, prNumber) {
  try {
    const { data } = await octokit.issues.listComments({
      owner,
      repo,
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

async function editComment(owner, repo, commentId, body, prNumber) {
  try {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body,
    });
    console.log(`Edited comment (id: ${commentId}) on ${owner}/${repo}#${prNumber}`);
  } catch (err) {
    console.error('Error editing comment:', err);
    process.exit(1);
  }
}

async function createComment(owner, repo, prNumber, body) {
  try {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body,
    });
    console.log(`Created new comment on ${owner}/${repo}#${prNumber}`);
  } catch (err) {
    console.error('Error creating comment:', err);
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

  let body;
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

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const prNumber = process.env.PR_NUMBER;
  const marker = process.env.MARKER;

  return { owner, repo, prNumber, marker, body };
}

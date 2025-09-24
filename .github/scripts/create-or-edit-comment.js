import { findTargetComment, getBotLogin, getComments, getEssentialInfo, octokit } from './comment-utils.js';

async function main() {
  const { owner, repo, marker, prNumber, body } = await getEssentialInfo({ requireMessage: true });
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

/**
 * @param {string} owner
 * @param {string} repo
 * @param {number} commentId
 * @param {string} body
 * @param {number} prNumber
 */
async function editComment(owner, repo, commentId, body, prNumber) {
  try {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      // eslint-disable-next-line camelcase
      comment_id: commentId,
      body,
    });
    console.log(`Edited comment (id: ${commentId}) on ${owner}/${repo}#${prNumber}`);
  } catch (err) {
    console.error('Error editing comment:', err);
    process.exit(1);
  }
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {string} body
 * @param {number} prNumber
 */
async function createComment(owner, repo, prNumber, body) {
  try {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      // eslint-disable-next-line camelcase
      issue_number: prNumber,
      body,
    });
    console.log(`Created new comment on ${owner}/${repo}#${prNumber}`);
  } catch (err) {
    console.error('Error creating comment:', err);
    process.exit(1);
  }
}

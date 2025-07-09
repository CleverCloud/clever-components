import { findTargetComment, getBotLogin, getComments, getEssentialInfo, octokit } from './comment-utils.js';

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

/**
 * @param {string} owner
 * @param {string} repo
 * @param {number} commentId
 * @param {number} prNumber
 */
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

import { execSync } from 'child_process';
import superagent from 'superagent';

export function getCurrentBranch () {
  const stdout = execSync('git branch --show-current');
  return stdout.toString().trim();
}

export function getCurrentCommit () {
  const stdout = execSync('git rev-parse HEAD');
  return stdout.toString().trim();
}

export function getCurrentAuthor () {
  const stdout = execSync(`git log -1 --pretty=format:'%an'`);
  return stdout.toString().trim();
}

/**
 * Decodes a GitHub object returned by one of the following API:
 *
 * @param tagGitHubObject
 * @return {Promise<{author: string, commitId: string, updatedAt: string}>}
 */
export async function describeTag (tagGitHubObject) {
  const { type, url } = tagGitHubObject.object;

  const object = (await superagent.get(url).set(getGitHubHeaders())).body;

  if (type === 'tag') {
    return {
      author: object.tagger.name,
      commitId: object.object.sha,
      updatedAt: object.tagger.date,
    };
  }
  else if (type === 'commit') {
    return {
      author: object.committer.name,
      commitId: object.sha,
      updatedAt: object.committer.date,
    };
  }

  throw new Error(`Unsupported type ${type}`);
}

/**
 * Constructs the headers necessary to call GitHub API.
 * If the `GITHUB_TOKEN` env var is found, it will be used for the Authorization header.
 *
 * @param tokenMandatory - Whether GITHUB_TOKEN env var is mandatory
 * @return {{'User-Agent': string}|{Authorization: string, 'User-Agent': string, 'X-GitHub-Api-Version': string}}
 */
export function getGitHubHeaders (tokenMandatory = false) {
  const headers = { 'User-Agent': 'clever-cloud' };
  const gitHubToken = process.env.GITHUB_TOKEN;
  if (gitHubToken == null || gitHubToken.length === 0) {
    if (tokenMandatory) {
      throw new Error('You must provide GITHUB_TOKEN env var with a valid GitHub Token.');
    }
    return headers;
  }
  return {
    ...headers,
    Authorization: `Bearer ${gitHubToken}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

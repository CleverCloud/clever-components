import { exec as execRaw } from 'child_process';
import fs from 'fs/promises';
import { promisify } from 'util';

const exec = promisify(execRaw);

// !! WARNINGS !!
// * The code with the scripts/commands is a all-in-one file with everything, lots of shell exec...
// * There is a lot of room to improve this.
//   * Consider this system a work in progress.

async function run () {

  const [command, branch] = process.argv.slice(2);
  const currentBranch = await getCurrentBranch();

  switch (command) {
    case 'list':
      return listPreviews();
    case 'publish':
      return publishPreviewBranch(branch || currentBranch);
    case 'delete':
      return deletePreviewBranch(branch || currentBranch);
  }

  throw new Error('Unknown command!');
}

async function getCurrentBranch () {
  const { stdout } = await exec('git branch --show-current');
  return stdout.trim();
}

async function getCurrentCommit () {
  const { stdout } = await exec('git rev-parse HEAD');
  return stdout.trim();
}

async function getCurrentAuthor () {
  const { stdout } = await exec(`git log -1 --pretty=format:'%an'`);
  return stdout.trim();
}

async function listPreviews () {
  const manifest = await getManifest();
  if (manifest.previews.length === 0) {
    console.log('No previews right now.');
  }
  else {
    console.log('Available previews:');
    manifest.previews.forEach((p) => {
      console.log(p.branch, p.updatedAt.substr(0, 19), p.commitId.substr(0, 8), p.author, p.url);
    });
  }
}

async function publishPreviewBranch (branch) {

  await s3cmd('sync', [
    `storybook-static/. s3://clever-components-preview/${branch}/`,
    '--acl-public',
    '--guess-mime-type',
    '--no-mime-magic',
    '--delete-removed',
  ]);

  const manifest = await getManifest();
  const newPreview = {
    branch,
    url: `https://clever-components-preview.cellar-c2.services.clever-cloud.com/${branch}/index.html`,
    updatedAt: new Date().toISOString(),
    commitId: await getCurrentCommit(),
    author: await getCurrentAuthor(),
  };
  const previewIndex = manifest.previews.findIndex((p) => p.branch === branch);
  if (previewIndex !== -1) {
    manifest.previews[previewIndex] = newPreview;
  }
  else {
    manifest.previews.push(newPreview);
  }

  await updateManifest(manifest);
  await updateListIndex(manifest);

  console.log('Preview available at: ' + newPreview.url);
}

async function deletePreviewBranch (branch) {
  await s3cmd('rm', [
    `s3://clever-components-preview/${branch}/`,
    '--recursive',
  ]);
  const manifest = await getManifest();
  const previewIndex = manifest.previews.findIndex((p) => p.branch === branch);
  if (previewIndex !== -1) {
    manifest.previews.splice(previewIndex, 1);
  }

  await updateManifest(manifest);
  await updateListIndex(manifest);
}

async function getManifest () {
  try {
    await s3cmd('get', [
      `s3://clever-components-preview/preview-manifest.json`,
      '.preview-manifest.json',
      '--force',
    ]);
    const jsonManifest = await fs.readFile('.preview-manifest.json', 'utf-8');
    return JSON.parse(jsonManifest);
  }
  catch (e) {
    return {
      version: 1,
      previews: [],
    };
  }
}

async function updateManifest (manifest) {
  await fs.writeFile('.preview-manifest.json', JSON.stringify(manifest, null, '  '));
  await s3cmd('put', [
    '.preview-manifest.json',
    `s3://clever-components-preview/preview-manifest.json`,
    '--acl-public',
    '--guess-mime-type',
    '--no-mime-magic',
  ]);
}

async function updateListIndex (manifest) {
  await fs.writeFile('.preview-index.html', `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Clever Components - Previews</title>
      <style>
        body {
          margin: 0 auto;
          font-family: Arial, sans-serif;
          width: 100%;
          max-width: 50rem;
        }
        code {
          font-family: "SourceCodePro", "monaco", monospace;
          font-size: 1rem;
        }
        table {
          width: 100%;
        }
        th {
          text-align: left;
        }
        th,
        td {
          padding: 0.25rem 0;
        }
      </style>
      <script src="https://components.clever-cloud.com/load.js?components=cc-datetime-relative" type="module"></script>
    </head>
    <body>
    <h1>Clever Components - Previews</h1>
    ${manifest.previews.length === 0 ? `
      <p><em>No previews right now</em></p>
    ` : `
      <table>
        <tr>
          <th>Branch</th>
          <th>Updated</th>
          <th>Commit ID</th>
          <th>Author</th>
        </tr>
        ${manifest.previews.map((p) => `
          <tr>
            <td><a href="https://clever-components-preview.cellar-c2.services.clever-cloud.com/${p.branch}/index.html"><code>${p.branch}</code></a></td>
            <td><cc-datetime-relative datetime="${p.updatedAt}">${p.updatedAt}</cc-datetime-relative></td>
            <td><span title="${p.commitId}">${p.commitId.substr(0, 8)}</span></td>
            <td>${p.author}</td>
          </tr>
        `).join('\n')}
      </table>
    `}
    </body>
    </html>
  `);
  await s3cmd('put', [
    '.preview-index.html',
    `s3://clever-components-preview/index.html`,
    '--acl-public',
    '--guess-mime-type',
    '--no-mime-magic',
  ]);
}

function s3cmd (command, params) {
  const fullCommand = [
    's3cmd',
    '-c .clever-components-previews.s3cfg',
    command,
    ...params,
  ].join(' ');
  return exec(fullCommand).then(({ stdout, stderr }) => {
    if (stdout !== '') {
      console.log(stdout.trim());
      console.log('-'.repeat(120));
    }
    if (stderr !== '') {
      console.error(stderr);
      console.log('-'.repeat(120));
      throw new Error(`Error with s3cmd ${command}`);
    }
  });
}

run().catch((e) => {
  console.error(e);
  console.log('Available commands are: list, publish [branch?], delete [branch?]');
  process.exit(1);
});

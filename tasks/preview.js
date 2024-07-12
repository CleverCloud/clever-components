import chalk from 'chalk';
import fs from 'fs/promises';
import textTable from 'text-table';
import { CellarClient } from './cellar-client.js';
import { getCurrentAuthor, getCurrentBranch, getCurrentCommit } from './git-utils.js';

// !! WARNINGS !!
// * We're still depending on git with exec

const cellar = new CellarClient({
  bucket: 'clever-components-preview',
  accessKeyId: process.env.PREVIEWS_CELLAR_KEY_ID,
  secretAccessKey: process.env.PREVIEWS_CELLAR_SECRET_KEY,
});

async function run() {
  const [command, branch] = process.argv.slice(2);
  const currentBranch = getCurrentBranch();

  switch (command) {
    case 'get':
      return getPreview(branch ?? currentBranch);
    case 'list':
      return listPreviews();
    case 'publish':
      return publishPreviewBranch(branch ?? currentBranch);
    case 'delete':
      return deletePreviewBranch(branch ?? currentBranch);
  }

  throw new Error('Unknown command!');
}

async function getPreview(branch) {
  const manifest = await getManifest();
  const preview = manifest.previews.find((p) => p.branch === branch);

  if (preview == null) {
    console.log(`No preview for branch ${branch} could be found.`);
    process.exit(1);
  } else {
    console.log(textTable([previewToPrintableDetails(preview)]));
  }
}

async function listPreviews() {
  const manifest = await getManifest();
  if (manifest.previews.length === 0) {
    console.log('No previews right now.');
  } else {
    const table = manifest.previews.map((p) => previewToPrintableDetails(p));
    console.log(textTable(table));
  }
}

async function publishPreviewBranch(branch) {
  const localDir = 'storybook-static';
  const remoteDir = branch;

  await cellar.sync({ localDir, remoteDir, deleteRemoved: true });

  const manifest = await getManifest();
  const newPreview = {
    branch,
    url: `https://clever-components-preview.cellar-c2.services.clever-cloud.com/${branch}/index.html`,
    updatedAt: new Date().toISOString(),
    commitId: getCurrentCommit(),
    author: getCurrentAuthor(),
  };
  const previewIndex = manifest.previews.findIndex((p) => p.branch === branch);
  if (previewIndex !== -1) {
    manifest.previews[previewIndex] = newPreview;
  } else {
    manifest.previews.push(newPreview);
  }

  await updateManifest(manifest);
  await updateListIndex(manifest);

  console.log('\nPreview available at: ' + newPreview.url);
}

async function deletePreviewBranch(branch) {
  await cellar.deleteManyObjects({ prefix: branch + '/' });
  const manifest = await getManifest();
  const previewIndex = manifest.previews.findIndex((p) => p.branch === branch);
  if (previewIndex !== -1) {
    manifest.previews.splice(previewIndex, 1);
  }

  await updateManifest(manifest);
  await updateListIndex(manifest);
}

async function getManifest() {
  return cellar.getObject({ key: 'preview-manifest.json' }).catch((e) => {
    return {
      version: 1,
      previews: [],
    };
  });
}

async function updateManifest(manifest) {
  const manifestJson = JSON.stringify(manifest, null, '  ');
  await fs.writeFile('.preview-manifest.json', manifestJson);
  return cellar.putObject({
    key: 'preview-manifest.json',
    body: manifestJson,
  });
}

async function updateListIndex(manifest) {
  const indexHtml = `
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
          max-width: 50em;
        }
        code {
          font-family: "SourceCodePro", "monaco", monospace;
          font-size: 1em;
        }
        table {
          width: 100%;
        }
        th {
          text-align: left;
        }
        th,
        td {
          padding: 0.25em 0;
        }
      </style>
      <script src="https://components.clever-cloud.com/load.js?components=cc-datetime-relative" type="module"></script>
    </head>
    <body>
    <h1>Clever Components - Previews</h1>
    ${
      manifest.previews.length === 0
        ? `
      <p><em>No previews right now</em></p>
    `
        : `
      <table>
        <tr>
          <th>Branch</th>
          <th>Updated</th>
          <th>Commit ID</th>
          <th>Author</th>
        </tr>
        ${manifest.previews
          .map(
            (p) => `
          <tr>
            <td><a href="${p.url}"><code>${p.branch}</code></a></td>
            <td><cc-datetime-relative datetime="${p.updatedAt}">${p.updatedAt}</cc-datetime-relative></td>
            <td><span title="${p.commitId}">${p.commitId.substr(0, 8)}</span></td>
            <td>${p.author}</td>
          </tr>
        `,
          )
          .join('\n')}
      </table>
    `
    }
    </body>
    </html>
  `;
  await fs.writeFile('.preview-index.html', indexHtml);
  return cellar.putObject({
    key: 'index.html',
    body: indexHtml,
  });
}

function previewToPrintableDetails(p) {
  return [
    ...p.updatedAt.substr(0, 19).split('T'),
    chalk.red(p.commitId.substr(0, 8)),
    chalk.yellow(p.branch),
    chalk.green(p.author),
    '\n  ' + chalk.italic(chalk.blue(p.url)),
  ];
}

run().catch((e) => {
  console.error(e);
  console.log('Available commands are: get [branch?], list, publish [branch?], delete [branch?]');
  process.exit(1);
});

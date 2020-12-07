'use strict';

const fs = require('fs/promises');
const superagent = require('superagent');

async function run () {

  const response = await superagent
    .get('https://api.github.com/repos/CleverCloud/clever-components/git/matching-refs/tags')
    .set('User-Agent', 'clever-cloud');

  const tags = response.body.map((matchingRef) => getTag(matchingRef.ref));
  const tagsJson = JSON.stringify(tags, null, '  ');

  await fs.writeFile('dist-cdn/versions-list.json', tagsJson);
}

function getTag (ref) {
  const [tag] = ref.split('/').slice(2);
  return tag;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

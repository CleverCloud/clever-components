import { expect } from '@bundled-es-modules/chai';
import { filterSections, getTagMatchers, matchesFilterQuery, parseFilterQuery } from '../src/lib/filter-sections.js';

const SECTIONS = [
  {
    label: 'Resources',
    items: [
      {
        label: 'my-node-app',
        id: 'app_1',
        matchers: ['is:app', 'is:node', 'project:billing'],
        tags: ['project:billing', 'env:prod'],
      },
      { label: 'my-php-app', id: 'app_2', matchers: ['is:app', 'is:php'], tags: ['Production'] },
      {
        label: 'main-db',
        id: 'addon_1',
        matchers: ['is:addon', 'is:postgresql-addon', 'project:billing'],
        tags: ['project:billing', 'env:staging'],
      },
    ],
  },
  {
    label: 'Organisations',
    items: [{ label: 'Clever Cloud', id: 'orga_1', matchers: [] }],
  },
];

const labelsFor = (query, options) =>
  filterSections(SECTIONS, query, options).flatMap((section) => section.items.map((item) => item.label));

describe('parseFilterQuery()', () => {
  it('splits on whitespace and partitions keywords from free text', () => {
    expect(parseFilterQuery('is:app project:billing my app')).to.deep.equal({
      keywordTokens: ['is:app', 'project:billing'],
      textTokens: ['my', 'app'],
    });
  });

  it('treats a tag token as a keyword, colons in the tag included', () => {
    expect(parseFilterQuery('tag:env:prod tag:production')).to.deep.equal({
      keywordTokens: ['tag:env:prod', 'tag:production'],
      textTokens: [],
    });
  });

  it('treats a bare tag prefix as free text', () => {
    expect(parseFilterQuery('tag:')).to.deep.equal({ keywordTokens: [], textTokens: ['tag:'] });
  });

  it('lowercases and trims the query', () => {
    expect(parseFilterQuery('  IS:App  MyApp ')).to.deep.equal({
      keywordTokens: ['is:app'],
      textTokens: ['myapp'],
    });
  });

  it('treats a bare prefix as free text, since the user is mid-typing', () => {
    expect(parseFilterQuery('is:')).to.deep.equal({ keywordTokens: [], textTokens: ['is:'] });
  });

  it('treats an unlisted prefix as free text, so colons in ids and URLs still search', () => {
    expect(parseFilterQuery('https://example.com')).to.deep.equal({
      keywordTokens: [],
      textTokens: ['https://example.com'],
    });
  });

  it('honours a custom prefix list', () => {
    expect(parseFilterQuery('is:app project:billing', ['is:'])).to.deep.equal({
      keywordTokens: ['is:app'],
      textTokens: ['project:billing'],
    });
  });

  it('returns no token for an empty query', () => {
    expect(parseFilterQuery('   ')).to.deep.equal({ keywordTokens: [], textTokens: [] });
  });
});

describe('getTagMatchers()', () => {
  it('prefixes each tag with tag:, colons in the tag included', () => {
    expect(getTagMatchers(['env:prod', 'production'])).to.deep.equal(['tag:env:prod', 'tag:production']);
  });

  it('trims and lowercases the tags, since the query is lowercased', () => {
    expect(getTagMatchers(['  Env:Prod '])).to.deep.equal(['tag:env:prod']);
  });

  it('drops blank and duplicate tags', () => {
    expect(getTagMatchers(['env:prod', '', '  ', 'ENV:PROD'])).to.deep.equal(['tag:env:prod']);
  });

  it('returns no matcher without tags', () => {
    expect(getTagMatchers(undefined)).to.deep.equal([]);
    expect(getTagMatchers(null)).to.deep.equal([]);
  });
});

describe('matchesFilterQuery()', () => {
  const parsed = (query) => parseFilterQuery(query);

  it('requires every keyword to be among the matchers', () => {
    expect(matchesFilterQuery(parsed('is:app is:node'), ['is:app', 'is:node'], ['x'])).to.equal(true);
    expect(matchesFilterQuery(parsed('is:app is:node'), ['is:app'], ['x'])).to.equal(false);
  });

  it('matches free text against any one of the text fields', () => {
    expect(matchesFilterQuery(parsed('node'), [], ['my-node-app', 'app_1'])).to.equal(true);
    expect(matchesFilterQuery(parsed('app_1'), [], ['my-node-app', 'app_1'])).to.equal(true);
    expect(matchesFilterQuery(parsed('nope'), [], ['my-node-app', 'app_1'])).to.equal(false);
  });

  it('requires every text token to match, possibly on different fields', () => {
    expect(matchesFilterQuery(parsed('node app_1'), [], ['my-node-app', 'app_1'])).to.equal(true);
    expect(matchesFilterQuery(parsed('node nope'), [], ['my-node-app', 'app_1'])).to.equal(false);
  });

  it('ignores nullish text fields', () => {
    expect(matchesFilterQuery(parsed('node'), [], ['my-node-app', null, undefined])).to.equal(true);
  });
});

describe('filterSections()', () => {
  it('narrows items by keyword', () => {
    expect(labelsFor('is:node')).to.deep.equal(['my-node-app']);
  });

  it('narrows items by project keyword', () => {
    expect(labelsFor('project:billing')).to.deep.equal(['my-node-app', 'main-db']);
  });

  it('narrows items by tag keyword, whether the tag has a colon or not', () => {
    expect(labelsFor('tag:env:prod')).to.deep.equal(['my-node-app']);
    expect(labelsFor('tag:production')).to.deep.equal(['my-php-app']);
  });

  it('matches a tag exactly, not as a prefix', () => {
    expect(labelsFor('tag:env')).to.deep.equal([]);
    expect(labelsFor('tag:env:pro')).to.deep.equal([]);
  });

  it('matches a tag regardless of its casing', () => {
    expect(labelsFor('tag:PRODUCTION')).to.deep.equal(['my-php-app']);
  });

  it('reads the tags with a custom accessor', () => {
    const sections = [
      {
        items: [
          { label: 'a', customerTags: ['env:prod'] },
          { label: 'b', tags: ['env:prod'] },
        ],
      },
    ];
    const labels = filterSections(sections, 'tag:env:prod', { getTags: (item) => item.customerTags }).flatMap(
      (section) => section.items.map((item) => item.label),
    );
    expect(labels).to.deep.equal(['a']);
  });

  it('reaches the project tag through tag: as well as project:', () => {
    expect(labelsFor('tag:project:billing')).to.deep.equal(labelsFor('project:billing'));
  });

  it('does not search tags as free text', () => {
    expect(labelsFor('production')).to.deep.equal([]);
    expect(labelsFor('env:prod')).to.deep.equal([]);
  });

  it('combines tag keywords with other tokens', () => {
    expect(labelsFor('is:app tag:env:prod')).to.deep.equal(['my-node-app']);
    expect(labelsFor('is:addon tag:env:prod')).to.deep.equal([]);
    expect(labelsFor('tag:project:billing main')).to.deep.equal(['main-db']);
  });

  it('narrows items by free text, across label and id', () => {
    expect(labelsFor('php')).to.deep.equal(['my-php-app']);
    expect(labelsFor('addon_1')).to.deep.equal(['main-db']);
  });

  it('combines keywords and free text', () => {
    expect(labelsFor('is:app my')).to.deep.equal(['my-node-app', 'my-php-app']);
    expect(labelsFor('is:app main')).to.deep.equal([]);
  });

  it('drops sections left with no item', () => {
    const sections = filterSections(SECTIONS, 'is:app');
    expect(sections.map((section) => section.label)).to.deep.equal(['Resources']);
  });

  it('keeps every section on an empty query by default', () => {
    expect(filterSections(SECTIONS, '  ')).to.deep.equal(SECTIONS);
  });

  it('returns nothing on an empty query when asked to', () => {
    expect(filterSections(SECTIONS, '  ', { emptyQuery: 'none' })).to.deep.equal([]);
  });

  it('drops sections that were already empty, even without a query', () => {
    const sections = [...SECTIONS, { label: 'Kubernetes', items: [] }];
    expect(filterSections(sections, '  ').map((section) => section.label)).to.deep.equal([
      'Resources',
      'Organisations',
    ]);
  });

  it('returns already-matching sections as-is when there is no query', () => {
    expect(filterSections(SECTIONS, '  ')[0]).to.equal(SECTIONS[0]);
  });

  it('does not mutate the input sections', () => {
    const before = JSON.parse(JSON.stringify(SECTIONS));
    filterSections(SECTIONS, 'is:app');
    expect(SECTIONS).to.deep.equal(before);
  });

  it('honours custom accessors', () => {
    const sections = [{ items: [{ name: 'my-app', realId: 'zzz', tags: ['is:app'] }] }];
    const options = { getMatchers: (item) => item.tags, getTexts: (item) => [item.name, item.realId] };
    expect(filterSections(sections, 'zzz', options)[0].items).to.have.lengthOf(1);
    expect(filterSections(sections, 'is:app', options)[0].items).to.have.lengthOf(1);
    expect(filterSections(sections, 'nope', options)).to.deep.equal([]);
  });
});

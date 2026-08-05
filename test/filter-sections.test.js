import { expect } from '@bundled-es-modules/chai';
import { filterSections, matchesFilterQuery, parseFilterQuery } from '../src/lib/filter-sections.js';

const SECTIONS = [
  {
    label: 'Resources',
    items: [
      { label: 'my-node-app', id: 'app_1', matchers: ['is:app', 'is:node', 'project:billing'] },
      { label: 'my-php-app', id: 'app_2', matchers: ['is:app', 'is:php'] },
      { label: 'main-db', id: 'addon_1', matchers: ['is:addon', 'is:postgresql-addon', 'project:billing'] },
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

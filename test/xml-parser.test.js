import { beforeAll, describe, expect, it } from 'vitest';
import { parseRssFeed } from '../src/lib/xml-parser.js';

describe('XML parsing', () => {
  let fileString = '';
  beforeAll(async () => {
    fileString = await fetch('./test/xml-file-test.xml').then((r) => r.text());
  });

  // Test file has more than 12 items
  describe('limit test', () => {
    it('retrieves only 9 max (default)', async () => {
      const parsedXML = parseRssFeed(fileString);
      expect(parsedXML).toBeInstanceOf(Array);
      expect(parsedXML).toHaveLength(9);
    });

    it('retrieves only 6 (less than default limit)', async () => {
      const parsedXML = parseRssFeed(fileString, 6);
      expect(parsedXML).toBeInstanceOf(Array);
      expect(parsedXML).toHaveLength(6);
    });

    it('returns an empty array if the limit is set to a negative number', async () => {
      const parsedXML = parseRssFeed(fileString, -1);
      expect(parsedXML).toBeInstanceOf(Array);
      expect(parsedXML).toHaveLength(0);
    });

    it('returns an empty array if the limit is set to zero', async () => {
      const parsedXML = parseRssFeed(fileString, 0);
      expect(parsedXML).toBeInstanceOf(Array);
      expect(parsedXML).toHaveLength(0);
    });

    it('retrieves only 10 (more than default limit)', async () => {
      const parsedXML = parseRssFeed(fileString, 10);
      expect(parsedXML).toBeInstanceOf(Array);
      expect(parsedXML).toHaveLength(10);
    });

    it('retrieves the number of items of the file if the limit is above', async () => {
      const parsedXML = parseRssFeed(fileString, 20);
      expect(parsedXML).toBeInstanceOf(Array);
      expect(parsedXML).toHaveLength(10);
    });
  });

  it('has the correct format', async () => {
    const parsedXML = parseRssFeed(fileString, 3);
    expect(parsedXML).toBeInstanceOf(Array);
    expect(parsedXML).toHaveLength(3);
    parsedXML.forEach((item) => {
      expect(item).toBeInstanceOf(Object);
      const keys = Object.keys(item).sort();
      expect(keys).toEqual(['banner', 'date', 'description', 'link', 'title']);
    });
  });

  it('parses correctly', async () => {
    const parsedXML = parseRssFeed(fileString, 3);
    expect(parsedXML).toHaveLength(3);

    const firstItem = parsedXML[0];
    expect(firstItem.title).toBe('Deploy a custom ChatGPT, based on PHP');
    expect(firstItem.description).toBe(
      'Since last year, OpenAI has been in the news with its large ' +
        'language models (LLM), notably GPT-3.5 and GPT-4, available through ChatGPT. ' +
        'But you can also include them within your own applications thanks to an API. ' +
        "Here's an example of how you can take advantage of it on Clever Cloud.",
    );
    expect(firstItem.date).toBe(new Date('Wed, 11 Oct 2023 07:30:48 +0000').toISOString());
    expect(firstItem.banner).toBe('https://cdn.clever-cloud.com/uploads/2023/10/2.svg');
    expect(firstItem.link).toBe(
      'https://www.clever-cloud.com/blog/features/2023/10/11/deploy-a-custom-chatgpt-based-on-php/',
    );

    const secondItem = parsedXML[1];
    expect(secondItem.title).toBe('Back-to-work events for Clever Cloud');
    expect(secondItem.description).toBe(
      'After a well-deserved summer break, ' +
        'Clever Cloud is taking part in a number of trade shows and conferences this autumn 2023.' +
        ' Would you like to talk with us, or tell us how our product has changed your life?' +
        ' You can do so at the following events:',
    );
    expect(secondItem.date).toBe(new Date('Tue, 26 Sep 2023 14:43:18 +0000').toISOString());
    expect(secondItem.banner).toBe(
      'https://cdn.clever-cloud.com/uploads/2023/09/rentree-des-evenements-pour-clever-2.svg',
    );
    expect(secondItem.link).toBe(
      'https://www.clever-cloud.com/blog/company/2023/09/26/back-to-work-events-for-clever-cloud/',
    );

    const thirdItem = parsedXML[2];
    expect(thirdItem.title).toBe('Open sourcing Sōzu connectors');
    expect(thirdItem.description).toBe(
      'Clever Cloud is today the main developer of Sōzu, ' +
        'a Reverse Proxy that was developped at Clever Cloud, in Rust, to meet the needs of our infrastructure ' +
        'for performance and hot reloading. Sōzu is used throughout Clever Cloud, paired with HAProxy,' +
        " to route traffic to our customer's applications.",
    );
    expect(thirdItem.date).toBe(new Date('Mon, 25 Sep 2023 15:19:04 +0000').toISOString());
    expect(thirdItem.banner).toBe(
      'https://cdn.clever-cloud.com/uploads/2023/09/clever-cloud-devoile-ses-connecteurs-sozu-open-source-3.svg',
    );
    expect(thirdItem.link).toBe(
      'https://www.clever-cloud.com/blog/engineering/2023/09/25/reverse-proxy-open-sourcing-sozu-connectors/',
    );
  });

  describe('XML parsing error check', () => {
    it('throws an error with bad XML ', () => {
      const wrongFileString = 'here is a wrong thing' + fileString;
      expect(() => parseRssFeed(wrongFileString)).toThrow();
    });

    it("doesn't throw an error with whitespaces", () => {
      const wrongFileString = '\n' + fileString;
      expect(() => parseRssFeed(wrongFileString)).not.toThrow();
      const parsedXML = parseRssFeed(wrongFileString);
      expect(parsedXML).not.toBeNull();
      expect(parsedXML.length).toBeGreaterThan(0);
    });
  });
});

import { expect } from '@bundled-es-modules/chai';
import { parseRssFeed } from '../src/lib/xml-parser.js';

describe('XML parsing', () => {

  let fileString = '';
  before(async () => {
    fileString = await fetch('./test/xml-file-test.xml').then((r) => r.text());
  });

  // Test file has more than 12 items
  describe('limit test', () => {
    it('retrieves only 9 max (default)', async () => {
      const parsedXML = parseRssFeed(fileString);
      expect(parsedXML).to.be.an('array');
      expect(parsedXML).to.have.lengthOf(9);
    });

    it('retrieves only 6 (less than default limit)', async () => {
      const parsedXML = parseRssFeed(fileString, 6);
      expect(parsedXML).to.be.an('array');
      expect(parsedXML).to.have.lengthOf(6);
    });

    it('retrieves only 12 (more than default limit)', async () => {
      const parsedXML = parseRssFeed(fileString, 12);
      expect(parsedXML).to.be.an('array');
      expect(parsedXML).to.have.lengthOf(12);
    });
  });

  it('has the correct format', async () => {
    const parsedXML = parseRssFeed(fileString, 3);
    expect(parsedXML).to.be.an('array');
    expect(parsedXML).to.have.lengthOf(3);
    parsedXML.forEach((item) => {
      expect(item).to.be.an('object');
      expect(item).to.have.all.keys('title', 'banner', 'date', 'description', 'link');
    });
  });

  it('parses correctly', async () => {
    const parsedXML = parseRssFeed(fileString, 3);
    expect(parsedXML).to.have.lengthOf(3);

    // First Item
    // Title: Clever Cloud Welcomes ViteMaDose!
    // Description: The year 2021 was marked by the arrival of the covid 19 vaccine.
    // A hope for many, announcing the end of this pandemic that will have marked the beginning of our century.
    // Haha. Well, actually, no. On the eve of the year 2022, we discover the fascinating capacity of the variant named Omicron to spread. [&#8230;]
    // Date: Thu, 06 Jan 2022 18:11:20 +0000
    // Banner: https://staging-cc-assets.cellar-c2.services.clever-cloud.com/uploads/2022/01/ViteMaDose-318x123.webp
    // Link: https://clevercloud-staging.cleverapps.io/blog/company/2022/01/06/clever-cloud-welcomes-vitemadose/
    const firstItem = parsedXML[0];
    expect(firstItem.title).to.deep.equal('Clever Cloud Welcomes ViteMaDose!');
    expect(firstItem.description).to.deep.equal('The year 2021 was marked by the arrival of the covid 19 vaccine.'
      + ' A hope for many, announcing the end of this pandemic that will have marked the beginning of our century.'
      + ' Haha. Well, actually, no. On the eve of the year 2022, we discover the fascinating capacity of the variant named Omicron to spread. […]');
    expect(firstItem.date).to.deep.equal(new Date('Thu, 06 Jan 2022 18:11:20 +0000').toISOString());
    expect(firstItem.banner).to.deep.equal('https://staging-cc-assets.cellar-c2.services.clever-cloud.com/uploads/2022/01/ViteMaDose-318x123.webp');
    expect(firstItem.link).to.deep.equal('https://clevercloud-staging.cleverapps.io/blog/company/2022/01/06/clever-cloud-welcomes-vitemadose/');

    // Second Item
    // Title: Powered by Clever Cloud &#8211; Secret Santa by JoliCode
    // Description: Christmas is next week and you probably heard about the “Secret Santa” tradition.
    // Loïck Piera, Web Consultant at JoliCode,
    // developed an app called Secret Santa to help you organise yours with your colleagues, friends or family.
    // Secret Santa has been hosted by Clever Cloud since 2018.
    // What is a Secret Santa? It&#8217;s a Christmas tradition [&#8230;]
    // Date: Tue, 14 Dec 2021 15:50:07 +0000
    // Banner: https://staging-cc-assets.cellar-c2.services.clever-cloud.com/uploads/2022/01/ViteMaDose-318x123.webp
    // Link: https://clevercloud-staging.cleverapps.io/blog/company/2021/12/14/powered-by-clever-cloud-secret-santa-by-jolicode/
    const secondItem = parsedXML[1];
    expect(secondItem.title).to.deep.equal('Powered by Clever Cloud – Secret Santa by JoliCode');
    expect(secondItem.description).to.deep.equal('Christmas is next week and you probably heard about the “Secret Santa” tradition.'
      + ' Loïck Piera, Web Consultant at JoliCode,'
      + ' developed an app called Secret Santa to help you organise yours with your colleagues, friends or family.'
      + ' Secret Santa has been hosted by Clever Cloud since 2018.'
      + ' What is a Secret Santa? It’s a Christmas tradition […]');
    expect(secondItem.date).to.deep.equal(new Date('Tue, 14 Dec 2021 15:50:07 +0000').toISOString());
    expect(secondItem.banner).to.deep.equal('https://staging-cc-assets.cellar-c2.services.clever-cloud.com/uploads/2021/12/Secret-Santa-2-318x123.png');
    expect(secondItem.link).to.deep.equal('https://clevercloud-staging.cleverapps.io/blog/company/2021/12/14/powered-by-clever-cloud-secret-santa-by-jolicode/');

    // Third Item
    // Title: Security update about Log4Shell
    // Description: What is Log4Shell?
    // You probably heard about Log4Shell (or CVE-2021-44228),
    // the vulnerability which impacted log4j, a famous log library written in Java.
    // This critical vulnerability allows to remotely execute code on the servers
    // of a company or to display the environment variables of an application.
    // What has been implemented at Clever Cloud? At Clever Cloud, [&#8230;]
    // Date: Mon, 13 Dec 2021 13:10:32 +0000
    // Banner: https://staging-cc-assets.cellar-c2.services.clever-cloud.com/uploads/2021/12/Security-update-318x159.png
    // Link: https://clevercloud-staging.cleverapps.io/blog/engineering/2021/12/13/security-update-about-log4shell/
    const thirdItem = parsedXML[2];
    expect(thirdItem.title).to.deep.equal('Security update about Log4Shell');
    expect(thirdItem.description).to.deep.equal('What is Log4Shell?'
      + ' You probably heard about Log4Shell (or CVE-2021-44228),'
      + ' the vulnerability which impacted log4j, a famous log library written in Java.'
      + ' This critical vulnerability allows to remotely execute code on the servers'
      + ' of a company or to display the environment variables of an application.'
      + ' What has been implemented at Clever Cloud? At Clever Cloud, […]');
    expect(thirdItem.date).to.deep.equal(new Date(' Mon, 13 Dec 2021 13:10:32 +0000').toISOString());
    expect(thirdItem.banner).to.deep.equal('https://staging-cc-assets.cellar-c2.services.clever-cloud.com/uploads/2021/12/Security-update-318x159.png');
    expect(thirdItem.link).to.deep.equal('https://clevercloud-staging.cleverapps.io/blog/engineering/2021/12/13/security-update-about-log4shell/');
  });

  describe('XML parsing error check', () => {
    it('throws an error with bad XML ', () => {
      const wrongFileString = 'here is a wrong thing' + fileString;
      expect(() => parseRssFeed(wrongFileString)).to.throw();
    });

  });

});

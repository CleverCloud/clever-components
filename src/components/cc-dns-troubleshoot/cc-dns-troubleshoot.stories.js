import { makeStory } from '../../stories/lib/make-story.js';
import './cc-dns-troubleshoot.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dns-trouble-shoot>',
  component: 'cc-dns-troubleshoot',
};

const conf = {
  component: 'cc-dns-troubleshoot',
};

const baseDnsInfo = {
  domain: 'www.florian-sanders.fr',
  expectedDnsInfo: {
    cname: 'domain.par.clever-cloud.com.',
    aRecords: [
      '46.252.181.103',
      '46.252.181.104',
      '91.208.207.214',
      '91.208.207.215',
      '91.208.207.216',
      '91.208.207.217',
      '91.208.207.218',
      '185.42.117.108',
      '185.42.117.109',
    ],
  },
  actualDnsInfo: {
    cname: 'domain.rbx.clever-cloud.com.',
    aRecords: [
      '87.98.177.181',
      '87.98.182.136',
      '87.98.180.173',
      '87.98.177.176',
    ],
  },
};

export const wrongCname = makeStory(conf, {
  items: [baseDnsInfo],
});

export const missingARecords = makeStory(conf, {
  items: [{
    ...baseDnsInfo,
    actualDnsInfo: {
      ...baseDnsInfo.actualDnsInfo,
      cname: null,
      aRecords: baseDnsInfo.expectedDnsInfo.aRecords.slice(0, 4),
    },
  }],
});

export const wrongAndMissingARecords = makeStory(conf, {
  items: [{
    ...baseDnsInfo,
    actualDnsInfo: {
      ...baseDnsInfo.actualDnsInfo,
      cname: null,
      aRecords: [
        '87.98.177.181',
        '87.98.182.136',
        '87.98.180.173',
        '87.98.177.176',
      ],
    },
  }],
});

export const allARecordsValid = makeStory(conf, {
  items: [{
    ...baseDnsInfo,
    actualDnsInfo: {
      ...baseDnsInfo.actualDnsInfo,
      cname: null,
      aRecords: baseDnsInfo.expectedDnsInfo.aRecords,
    },
  }],
});

export const cnameValid = makeStory(conf, {
  items: [{
    ...baseDnsInfo,
    actualDnsInfo: {
      ...baseDnsInfo.actualDnsInfo,
      cname: baseDnsInfo.expectedDnsInfo.cname,
      aRecords: baseDnsInfo.expectedDnsInfo.aRecords,
    },
  }],
});

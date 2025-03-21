import { expect, fixture } from '@open-wc/testing';

describe('getStatusFromBcd function', () => {
  it('should return true for browser released more than 2.5 years ago', () => {
    const oldBrowserInfo = {
      firefox: {
        '50.0': {
          release_date: '2016-11-15',
        },
      },
    };
    expect(getStatusFromBcd('firefox', '50.0', oldBrowserInfo)).to.equal(true);
  });

  it('should return false for recent browser release', () => {
    const recentBrowserInfo = {
      chrome: {
        '120.0': {
          release_date: '2023-12-05',
        },
      },
    };
    expect(getStatusFromBcd('chrome', '120.0', recentBrowserInfo)).to.equal(false);
  });
});

function getStatusFromBcd(browser, version, browsersInfos) {
  const releaseDate = new Date(browsersInfos[browser][version].release_date);
  const now = Date.now();
  const twoYearsAndHalf = new Date();
  twoYearsAndHalf.setFullYear(twoYearsAndHalf.getFullYear() - 2);
  twoYearsAndHalf.setMonth(twoYearsAndHalf.getMonth() - 6);

  const isWidely = now - releaseDate.getTime() >= now - twoYearsAndHalf.getTime();
  return isWidely;
}

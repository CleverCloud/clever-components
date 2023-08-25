import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
import { LogsList } from './logs-list.js';

function generateLogs (length, offset = 0, getMetadata = () => []) {
  return Array
    .from({ length })
    .map((_, index) => {
      const offsetIndex = index + offset;
      const id = String(offsetIndex).padStart(5, '0');
      return {
        id,
        timestamp: 1600000000000 + (offsetIndex * 1000),
        message: `Message ${id}`,
        metadata: getMetadata(offsetIndex),
      };
    });
}

function expectIndexes (list, fullList, indexes) {
  const expectedList = fullList.filter((_, i) => indexes.includes(i));
  return expect(list).to.deep.equal(expectedList);
}

describe('', () => {

  let list;
  let spy;

  beforeEach(() => {
    spy = hanbi.spy();
    list = new LogsList(spy.handler);
  });

  it('basics', () => {

    expect(list.getList()).to.deep.equal([]);
    expect(spy.callCount).to.equal(0);

    const logs = generateLogs(4);
    list.append(logs);
    expect(list.getList()).to.deep.equal(logs);
    expect(spy.callCount).to.equal(1);

    list.clear();
    expect(list.getList()).to.deep.equal([]);
    expect(spy.callCount).to.equal(2);
  });

  it('setLimit()', () => {

    const logsOne = generateLogs(10);
    list.append(logsOne);
    expect(list.getList()).to.deep.equal(logsOne);
    expect(spy.callCount).to.equal(1);

    list.setLimit(5);
    expect(list.getList()).to.deep.equal(logsOne.slice(5));
    expect(spy.callCount).to.equal(2);

    const logsTwo = generateLogs(2, 10);
    list.append(logsTwo);
    expect(list.getList()).to.deep.equal([
      ...logsOne.slice(10 - 3),
      ...logsTwo,
    ]);
    expect(spy.callCount).to.equal(3);

    const logsThree = generateLogs(8, 12);
    list.append(logsThree);
    expect(list.getList()).to.deep.equal([
      ...logsThree.slice(3),
    ]);
    expect(spy.callCount).to.equal(4);

    list.clear();
    expect(list.getList()).to.deep.equal([]);
    expect(spy.callCount).to.equal(5);
  });

  it('setFilter()', () => {

    const logs = generateLogs(24, 0, (i) => {
      const aValues = ['a', 'aa', 'aaa', 'aaaa'];
      const bValues = ['b', 'bb', 'bbb'];
      return [
        { name: 'A', value: aValues[i % aValues.length] },
        { name: 'B', value: bValues[i % bValues.length] },
      ];
    });

    list.append(logs);
    expect(list.getList()).to.deep.equal(logs);
    expect(spy.callCount).to.equal(1);

    list.setFilter([
      { metadata: 'A', value: 'a' },
    ]);
    expectIndexes(list.getList(), logs, [0, 4, 8, 12, 16, 20]);
    expect(spy.callCount).to.equal(2);

    list.setFilter([
      { metadata: 'A', value: 'a' },
      { metadata: 'A', value: 'aa' },
    ]);
    expectIndexes(list.getList(), logs, [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21]);
    expect(spy.callCount).to.equal(3);

    list.setFilter([
      { metadata: 'A', value: 'a' },
      { metadata: 'B', value: 'b' },
    ]);
    expectIndexes(list.getList(), logs, [0, 12]);
    expect(spy.callCount).to.equal(4);

    list.setFilter(null);
    expect(list.getList()).to.deep.equal(logs);
    expect(spy.callCount).to.equal(5);
  });

  it.skip('filter perfs', () => {

    list.setFilter([
      { metadata: 'A', value: 'a' },
    ]);

    // let lastDiff = 5;

    const iterationsAbove = [];

    // const before = new Date().getTime();
    for (let i = 0; i < 250; i += 1) {
      const logs = generateLogs(1000, 0, (i) => {
        return [{ name: 'A', value: 'a' }, { name: 'B', value: 'b' }, { name: 'C', value: 'c' }];
      });
      const before = new Date().getTime();
      list.append(logs);
      const after = new Date().getTime();
      const diff = after - before;
      if (diff > 5) {
        iterationsAbove.push(list.getList().length + '/' + diff);
      }
    }
    // const after = new Date().getTime();
    // const diff = after - before;
    // console.log(diff);

    console.log(iterationsAbove.length, iterationsAbove.join(', '));
  });

  it('findByIndex()', () => {

    list.setLimit(100);

    const logsOne = generateLogs(100, 0);
    list.append(logsOne);

    const resultOne = list.findByIndex(10);
    expect(resultOne).to.deep.equal(logsOne[10]);

    const logsTwo = generateLogs(20, 0);
    list.append(logsTwo);

    const resultTwo = list.findByIndex(10);
    expect(resultTwo).to.deep.equal(logsOne[30]);

    list.clear();

    const resultThree = list.findByIndex(10);
    expect(resultThree).to.not.exist;
  });

  it('findIndexById()', () => {

    list.setLimit(100);

    const logsOne = generateLogs(100, 0);
    list.append(logsOne);

    const resultOne = list.findIndexById('00010');
    expect(resultOne).to.deep.equal(10);

    const logsTwo = generateLogs(20, 0);
    list.append(logsTwo);

    const resultTwo = list.findIndexById('00010');
    expect(resultTwo).to.deep.equal(-1);

    const resultThree = list.findIndexById('00030');
    expect(resultThree).to.deep.equal(10);

    list.clear();

    const resultFour = list.findByIndex('00030');
    expect(resultFour ?? null).to.equal(null);
  });

  it('findIndexById()', () => {

    list.setLimit(100);

    const logsOne = generateLogs(100, 0);
    list.append(logsOne);

    const resultOne = list.findIndexById('00010');
    expect(resultOne).to.deep.equal(10);

    const logsTwo = generateLogs(20, 0);
    list.append(logsTwo);

    const resultTwo = list.findIndexById('00010');
    expect(resultTwo).to.deep.equal(-1);

    const resultThree = list.findIndexById('00030');
    expect(resultThree).to.deep.equal(10);

    list.clear();

    const resultFour = list.findIndexById('00030');
    expect(resultFour).to.equal(null);
  });

  it('getRange()', () => {

    const logsOne = generateLogs(10, 10);
    list.append(logsOne);

    const rangeOne = list.getRange('00012', '00016');
    expect(rangeOne).to.deep.equal(['00012', '00013', '00014', '00015', '00016']);

    const rangeTwo = list.getRange('00016', '00012');
    expect(rangeTwo).to.deep.equal(['00012', '00013', '00014', '00015', '00016']);

    const rangeFour = list.getRange('00005', '00015');
    expect(rangeFour).to.deep.equal([]);

    const rangeFive = list.getRange('00015', '00025');
    expect(rangeFive).to.deep.equal([]);

    const rangeSix = list.getRange('00025', '00035');
    expect(rangeSix).to.deep.equal([]);
  });
});

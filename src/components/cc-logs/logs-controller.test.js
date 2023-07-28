import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
import { LogsController } from './logs-controller.js';

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

  let logsCtrl;
  let spy;

  beforeEach(() => {
    spy = hanbi.spy();
    logsCtrl = new LogsController({
      requestUpdate: spy.handler,
    });
  });

  it('basics', () => {

    expect(logsCtrl.getList()).to.deep.equal([]);
    expect(spy.callCount).to.equal(0);

    const logs = generateLogs(4);
    logsCtrl.append(logs);
    expect(logsCtrl.getList()).to.deep.equal(logs);
    expect(spy.callCount).to.equal(1);

    logsCtrl.clear();
    expect(logsCtrl.getList()).to.deep.equal([]);
    expect(spy.callCount).to.equal(2);
  });

  it('limit', () => {

    const logsOne = generateLogs(10);
    logsCtrl.append(logsOne);
    expect(logsCtrl.getList()).to.deep.equal(logsOne);
    expect(spy.callCount).to.equal(1);

    logsCtrl.limit = 5;
    expect(logsCtrl.getList()).to.deep.equal(logsOne.slice(5));
    expect(spy.callCount).to.equal(2);

    const logsTwo = generateLogs(2, 10);
    logsCtrl.append(logsTwo);
    expect(logsCtrl.getList()).to.deep.equal([
      ...logsOne.slice(7),
      ...logsTwo,
    ]);
    expect(spy.callCount).to.equal(3);

    const logsThree = generateLogs(8, 12);
    logsCtrl.append(logsThree);
    expect(logsCtrl.getList()).to.deep.equal([
      ...logsThree.slice(3),
    ]);
    expect(spy.callCount).to.equal(4);

    logsCtrl.clear();
    expect(logsCtrl.getList()).to.deep.equal([]);
    expect(spy.callCount).to.equal(5);
  });

  it('filter', () => {

    const logs = generateLogs(24, 0, (i) => {
      const aValues = ['a', 'aa', 'aaa', 'aaaa'];
      const bValues = ['b', 'bb', 'bbb'];
      return [
        { name: 'A', value: aValues[i % aValues.length] },
        { name: 'B', value: bValues[i % bValues.length] },
      ];
    });

    logsCtrl.append(logs);
    expect(logsCtrl.getList()).to.deep.equal(logs);
    expect(spy.callCount).to.equal(1);

    logsCtrl.filter = [
      { metadata: 'A', value: 'a' },
    ];
    expectIndexes(logsCtrl.getList(), logs, [0, 4, 8, 12, 16, 20]);
    expect(spy.callCount).to.equal(2);

    logsCtrl.filter = [
      { metadata: 'A', value: 'a' },
      { metadata: 'A', value: 'aa' },
    ];
    expectIndexes(logsCtrl.getList(), logs, [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21]);
    expect(spy.callCount).to.equal(3);

    logsCtrl.filter = [
      { metadata: 'A', value: 'a' },
      { metadata: 'B', value: 'b' },
    ];
    expectIndexes(logsCtrl.getList(), logs, [0, 12]);
    expect(spy.callCount).to.equal(4);

    logsCtrl.filter = null;
    expect(logsCtrl.getList()).to.deep.equal(logs);
    expect(spy.callCount).to.equal(5);
  });

  it('selection', () => {

    logsCtrl.limit = 10;
    expect(spy.callCount).to.equal(1);

    const logsOne = generateLogs(10, 0);

    logsCtrl.append(logsOne);
    expect(logsCtrl.getList()).to.deep.equal(logsOne);
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(spy.callCount).to.equal(2);

    logsCtrl.select('00002');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(spy.callCount).to.equal(3);

    logsCtrl.clearSelection();
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(spy.callCount).to.equal(4);

    logsCtrl.select('00002');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(spy.callCount).to.equal(5);

    const logsTwo = generateLogs(5, 10);

    logsCtrl.append(logsTwo);
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(spy.callCount).to.equal(6);

    logsCtrl.select('00010');
    expect(logsCtrl.isSelected('00010')).to.equal(true);
    expect(spy.callCount).to.equal(7);

    logsCtrl.clear();
    expect(logsCtrl.isSelected('00010')).to.equal(false);
    expect(spy.callCount).to.equal(8);
  });

  it('multiple selection (one by one)', () => {

    logsCtrl.limit = 10;

    const logsOne = generateLogs(10, 0);

    logsCtrl.append(logsOne);
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(false);

    logsCtrl.select('00002');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(false);

    logsCtrl.select('00003');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(true);
    expect(logsCtrl.isSelected('00004')).to.equal(false);

    logsCtrl.select('00004');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(true);
    expect(logsCtrl.isSelected('00004')).to.equal(true);

    logsCtrl.select('00003');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(true);

    logsCtrl.clearSelection();
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(false);

    logsCtrl.select('00002');
    logsCtrl.select('00003');
    logsCtrl.select('00004');
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(true);
    expect(logsCtrl.isSelected('00004')).to.equal(true);

    const logsTwo = generateLogs(4, 10);

    logsCtrl.append(logsTwo);
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(true);
  });

  it('multiple selection (by series)', () => {

    logsCtrl.limit = 10;

    const logsOne = generateLogs(10, 0);

    logsCtrl.append(logsOne);

    logsCtrl.select('00002');
    logsCtrl.select('00004', true);

    expect(logsCtrl.isSelected('00001')).to.equal(false);
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(true);
    expect(logsCtrl.isSelected('00004')).to.equal(true);
    expect(logsCtrl.isSelected('00005')).to.equal(false);

    logsCtrl.clearSelection();
    logsCtrl.select('00004');
    logsCtrl.select('00002', true);

    expect(logsCtrl.isSelected('00001')).to.equal(false);
    expect(logsCtrl.isSelected('00002')).to.equal(true);
    expect(logsCtrl.isSelected('00003')).to.equal(true);
    expect(logsCtrl.isSelected('00004')).to.equal(true);
    expect(logsCtrl.isSelected('00005')).to.equal(false);

    logsCtrl.clearSelection();
    logsCtrl.select('00002');
    logsCtrl.select('00004');
    logsCtrl.select('00006', true);

    expect(logsCtrl.isSelected('00001')).to.equal(false);
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(true);
    expect(logsCtrl.isSelected('00005')).to.equal(true);
    expect(logsCtrl.isSelected('00006')).to.equal(true);
    expect(logsCtrl.isSelected('00007')).to.equal(false);

    logsCtrl.clearSelection();
    logsCtrl.select('00002');
    logsCtrl.select('00006');
    logsCtrl.select('00004', true);
    logsCtrl.select('00008', true);

    expect(logsCtrl.isSelected('00001')).to.equal(false);
    expect(logsCtrl.isSelected('00002')).to.equal(false);
    expect(logsCtrl.isSelected('00003')).to.equal(false);
    expect(logsCtrl.isSelected('00004')).to.equal(false);
    expect(logsCtrl.isSelected('00005')).to.equal(false);
    expect(logsCtrl.isSelected('00006')).to.equal(true);
    expect(logsCtrl.isSelected('00007')).to.equal(true);
    expect(logsCtrl.isSelected('00008')).to.equal(true);
    expect(logsCtrl.isSelected('00009')).to.equal(false);

  });

  it('isSelectionEmpty()', () => {

    logsCtrl.limit = 10;

    const logsOne = generateLogs(10, 0);

    logsCtrl.append(logsOne);
    expect(logsCtrl.isSelectionEmpty()).to.equal(true);

    logsCtrl.select('00002');
    expect(logsCtrl.isSelectionEmpty()).to.equal(false);

    logsCtrl.select('00003');
    expect(logsCtrl.isSelectionEmpty()).to.equal(false);

    logsCtrl.select('00003');
    expect(logsCtrl.isSelectionEmpty()).to.equal(false);

    logsCtrl.select('00002');
    expect(logsCtrl.isSelectionEmpty()).to.equal(true);
  });
});

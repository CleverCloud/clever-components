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
});

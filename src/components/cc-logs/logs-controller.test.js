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
});

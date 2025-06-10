import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
import { LogsController } from './logs-controller.js';

/**
 *
 * @param {number} length
 * @param {number} offset
 * @param {(i: number) => Array} getMetadata
 * @return {Array<Log>}
 */
function generateLogs(length, offset = 0, getMetadata = () => []) {
  return Array.from({ length }).map((_, index) => {
    const offsetIndex = index + offset;
    const id = String(offsetIndex).padStart(5, '0');
    return {
      id,
      date: new Date(1600000000000 + offsetIndex * 1000),
      message: `Message ${id}`,
      metadata: getMetadata(offsetIndex),
    };
  });
}

describe('', () => {
  let logsCtrl;
  let spies = {};
  let offset = 0;

  beforeEach(() => {
    spies = {
      requestUpdate: hanbi.spy(),
      focusedLogChange: hanbi.spy(),
    };
    logsCtrl = new LogsController({
      requestUpdate: spies.requestUpdate.handler,
      _onFocusedLogChange: spies.focusedLogChange.handler,
      _onSelectionChanged: () => {},
    });
    offset = 0;
  });

  function appendLogs(length, getMetadata) {
    const logs = generateLogs(length, offset, getMetadata);
    logsCtrl.append(logs);
    offset += length;
    return logs;
  }

  function appendLogsWithMetadata() {
    return appendLogs(24, (i) => {
      const aValues = ['a', 'aa', 'aaa', 'aaaa'];
      const bValues = ['b', 'bb', 'bbb'];
      return [
        { name: 'A', value: aValues[i % aValues.length] },
        { name: 'B', value: bValues[i % bValues.length] },
      ];
    });
  }

  function assertListByIndex(fullList, indexes) {
    const expectedList = fullList.filter((_, i) => indexes.includes(i));
    return expect(logsCtrl.getList()).to.deep.equal(expectedList);
  }

  function assertSelection(expectedSelection) {
    expect(logsCtrl.selectionLength, 'selection length').to.equal(expectedSelection.length);
    expect(logsCtrl.isSelectionEmpty(), 'selection is empty').to.equal(expectedSelection.length === 0);
    expectedSelection.forEach((selection) => {
      expect(logsCtrl.isSelected(selection), `${selection} is selected`).to.equal(true);
    });

    expect(logsCtrl.getSelectedLogs()).to.deep.equal(expectedSelection.map((i) => logsCtrl.getList()[i]));
  }

  it('should be empty at startup', () => {
    expect(logsCtrl.getList()).to.deep.equal([]);
    expect(logsCtrl.listLength).to.equal(0);
  });

  describe('appendLogs() method', () => {
    it('should append logs to the list', () => {
      const logs = appendLogs(4);

      expect(logsCtrl.getList()).to.deep.equal(logs);
      expect(logsCtrl.listLength).to.equal(4);
    });

    it('should update host when appending some logs', () => {
      appendLogs(4);

      expect(spies.requestUpdate.callCount).to.equal(1);
    });

    it('should drop focused log if it was removed because of the limit', () => {
      logsCtrl.limit = 10;
      appendLogs(10);
      logsCtrl.focus(1);
      spies.focusedLogChange.reset();

      logsCtrl.append(generateLogs(5, 10));

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([null]);
    });

    it('should keep focused log and updated its index when limit does not put it out of the list', () => {
      logsCtrl.limit = 10;
      logsCtrl.append(generateLogs(10, 0));
      logsCtrl.focus(8);
      spies.focusedLogChange.reset();

      logsCtrl.append(generateLogs(5, 10));

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([3]);
    });

    it('should drop focused log if it was removed because of a new filter', () => {
      logsCtrl.limit = 10;
      logsCtrl.append(
        generateLogs(10, 0, (i) => {
          return [{ name: 'even', value: i % 2 === 0 ? 'yes' : 'no' }];
        }),
      );
      logsCtrl.focus(4);
      spies.focusedLogChange.reset();

      logsCtrl.filter = {
        metadata: [{ metadata: 'even', value: 'yes' }],
      };

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([null]);
    });
  });

  describe('clear method', () => {
    it('should clear logs from the list', () => {
      appendLogs(4);

      logsCtrl.clear();

      expect(logsCtrl.getList()).to.deep.equal([]);
      expect(logsCtrl.listLength).to.equal(0);
    });

    it('should request host update', () => {
      appendLogs(4);
      spies.requestUpdate.reset();

      logsCtrl.clear();

      expect(spies.requestUpdate.callCount).to.equal(1);
    });

    it('should drop focused log', () => {
      logsCtrl.append(generateLogs(10, 0));
      logsCtrl.focus(4);
      spies.focusedLogChange.reset();

      logsCtrl.clear();

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([null]);
    });
  });

  describe('limit', () => {
    it('should be applied when setting limit to less than the actual amount of logs', () => {
      const logs = appendLogs(10);

      logsCtrl.limit = 6;

      expect(logsCtrl.getList()).to.deep.equal(logs.slice(4));
      expect(logsCtrl.listLength).to.equal(6);
    });

    it('should request host update when applying limit', () => {
      appendLogs(10);
      spies.requestUpdate.reset();

      logsCtrl.limit = 6;

      expect(spies.requestUpdate.callCount).to.equal(1);
    });

    it('should be applied when appending logs', () => {
      logsCtrl.limit = 6;
      const logsOne = appendLogs(4);

      const logsTwo = appendLogs(4);

      expect(logsCtrl.getList()).to.deep.equal([...logsOne.slice(2), ...logsTwo]);
      expect(logsCtrl.listLength).to.equal(6);
    });
  });

  describe('filter', () => {
    describe('with metadata filter', () => {
      it('should be applied when setting new filter on metadata', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          metadata: [{ metadata: 'A', value: 'a' }],
        };

        assertListByIndex(logs, [0, 4, 8, 12, 16, 20]);
      });
    });

    it('should request host update when setting new filter', () => {
      appendLogsWithMetadata();
      spies.requestUpdate.reset();

      logsCtrl.filter = {
        metadata: [{ metadata: 'A', value: 'a' }],
      };

      expect(spies.requestUpdate.callCount).to.equal(1);
    });

    it('should be applied when appending new logs', () => {
      logsCtrl.filter = {
        metadata: [{ metadata: 'A', value: 'a' }],
      };

      const logs = appendLogsWithMetadata();

      assertListByIndex(logs, [0, 4, 8, 12, 16, 20]);
    });

    it('should request host update when appending new logs', () => {
      logsCtrl.filter = {
        metadata: [{ metadata: 'A', value: 'a' }],
      };
      spies.requestUpdate.reset();

      appendLogsWithMetadata();

      expect(spies.requestUpdate.callCount).to.equal(1);
    });

    it('should be dropped when setting null filter', () => {
      logsCtrl.filter = {
        metadata: [{ metadata: 'A', value: 'a' }],
      };
      const logs = appendLogsWithMetadata();

      logsCtrl.filter = null;

      expect(logsCtrl.getList()).to.deep.equal(logs);
    });

    it('should use OR boolean operator when filtering on same metadata', () => {
      const logs = appendLogsWithMetadata();

      logsCtrl.filter = {
        metadata: [
          { metadata: 'A', value: 'a' },
          { metadata: 'A', value: 'aa' },
        ],
      };

      assertListByIndex(logs, [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21]);
    });

    it('should use AND boolean operator when filtering on different metadata', () => {
      const logs = appendLogsWithMetadata();

      logsCtrl.filter = {
        metadata: [
          { metadata: 'A', value: 'a' },
          { metadata: 'B', value: 'b' },
        ],
      };

      assertListByIndex(logs, [0, 12]);
    });

    it('should use AND boolean operator when filtering on metadata and message', () => {
      const logs = appendLogsWithMetadata();

      logsCtrl.filter = {
        message: {
          type: 'loose',
          value: '0000',
        },
        metadata: [{ metadata: 'A', value: 'a' }],
      };

      assertListByIndex(logs, [0, 4, 8]);
    });

    describe('with loose message filter', () => {
      it('should be applied', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'loose',
            value: '00004',
          },
        };

        assertListByIndex(logs, [4]);
      });

      it('should be applied with multiple keywords', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'loose',
            value: '00004 Message',
          },
        };

        assertListByIndex(logs, [4]);
      });

      it('should use AND boolean operator with multiple keywords', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'loose',
            value: '00004 00001',
          },
        };

        assertListByIndex(logs, []);
      });

      it('should use be case insensitive', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'loose',
            value: '00004 meSsAgE',
          },
        };

        assertListByIndex(logs, [4]);
      });

      it('should ignore empty spaces', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'loose',
            value: '   00004    Message   ',
          },
        };

        assertListByIndex(logs, [4]);
      });
    });

    describe('with strict filter', () => {
      it('should match with exact string', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'strict',
            value: 'Message 00004',
          },
        };

        assertListByIndex(logs, [4]);
      });

      it('should not match with string without the same case', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'strict',
            value: 'MeSSaGe 00004',
          },
        };

        assertListByIndex(logs, []);
      });

      it('should not match with tokens upside down', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'strict',
            value: '00004 Message',
          },
        };

        assertListByIndex(logs, []);
      });

      it('should not match with extra spaces', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'strict',
            value: 'Message  00004',
          },
        };

        assertListByIndex(logs, []);
      });
    });

    describe('with regex filter', () => {
      it('should match with exact string', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'regex',
            value: 'Message 00004',
          },
        };

        assertListByIndex(logs, [4]);
      });

      it('should not match with invalid regex', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'regex',
            value: 'Message 00004(',
          },
        };

        assertListByIndex(logs, []);
      });

      it('should match with regex', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'regex',
            value: 'Message 0{4}[1234]',
          },
        };

        assertListByIndex(logs, [1, 2, 3, 4]);
      });

      it('should match with regex and flags', () => {
        const logs = appendLogsWithMetadata();

        logsCtrl.filter = {
          message: {
            type: 'regex',
            value: '/message 00004/i',
          },
        };

        assertListByIndex(logs, [4]);
      });
    });
  });

  describe('selection', () => {
    it('should be empty at init', () => {
      assertSelection([]);
    });

    it('should be empty at init after appending logs', () => {
      appendLogs(10);

      assertSelection([]);
    });

    describe('with select() method', () => {
      it('should select nothing when trying to select a log at index too big', () => {
        appendLogs(10);
        logsCtrl.select(10000);

        assertSelection([]);
      });

      it('should add to selection', () => {
        appendLogs(10);

        logsCtrl.select(2);

        assertSelection([2]);
      });

      it('should replace the actual selection', () => {
        appendLogs(10);
        logsCtrl.select(2);

        logsCtrl.select(5);

        assertSelection([5]);
      });

      it('should request host update', () => {
        appendLogs(10);
        spies.requestUpdate.reset();

        logsCtrl.select(2);

        expect(spies.requestUpdate.callCount).to.equal(1);
      });
    });

    describe('with toggleSelection() method', () => {
      it('should select nothing when trying to select a log at index too big', () => {
        appendLogs(10);
        logsCtrl.toggleSelection(10000);

        assertSelection([]);
      });

      it('should not drop current selection when trying to select a log at index too big', () => {
        appendLogs(10);
        logsCtrl.toggleSelection(5);
        logsCtrl.toggleSelection(6);

        logsCtrl.toggleSelection(10000);

        assertSelection([5, 6]);
      });

      it('should add unselected log to the selection', () => {
        appendLogs(10);
        logsCtrl.toggleSelection(5);

        logsCtrl.toggleSelection(6);

        assertSelection([5, 6]);
      });

      it('should remove selected log from the selection', () => {
        appendLogs(10);
        logsCtrl.toggleSelection(5);
        logsCtrl.toggleSelection(6);

        logsCtrl.toggleSelection(5);

        assertSelection([6]);
      });
    });

    describe('with extendSelection() method', () => {
      describe('with replace', () => {
        it('should extends the selection to the end when given index is higher than length - 1', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(2);

          logsCtrl.extendSelection(10000, 'replace');

          assertSelection([2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it('should extends the selection to the beginning when given index is lower than 0', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(2);

          logsCtrl.extendSelection(-1, 'replace');

          assertSelection([0, 1, 2]);
        });

        it('should extends the selection up to the given index', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(2);

          logsCtrl.extendSelection(8, 'replace');

          assertSelection([2, 3, 4, 5, 6, 7, 8]);
        });

        it('should extends the selection down to the given index', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(5);

          logsCtrl.extendSelection(2, 'replace');

          assertSelection([2, 3, 4, 5]);
        });
      });

      describe('with append', () => {
        it('should extends the selection to the end when given index is higher than length - 1', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(2);
          logsCtrl.toggleSelection(4);

          logsCtrl.extendSelection(10000, 'append');

          assertSelection([2, 4, 5, 6, 7, 8, 9]);
        });

        it('should extends the selection to the beginning when given index is lower than 0', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(4);
          logsCtrl.toggleSelection(2);

          logsCtrl.extendSelection(-1, 'append');

          assertSelection([0, 1, 2, 4]);
        });

        it('should extends the selection up to the given index', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(2);
          logsCtrl.toggleSelection(4);

          logsCtrl.extendSelection(8, 'append');

          assertSelection([2, 4, 5, 6, 7, 8]);
        });

        it('should extends the selection down to the given index', () => {
          appendLogs(10);
          logsCtrl.toggleSelection(8);
          logsCtrl.toggleSelection(5);

          logsCtrl.extendSelection(2, 'append');

          assertSelection([2, 3, 4, 5, 8]);
        });
      });
    });

    describe('with limit', () => {
      it('should remove from selection the item that has been evicted by the limit when appending logs', () => {
        logsCtrl.limit = 10;
        appendLogs(10);
        logsCtrl.select(2);

        appendLogs(5);

        assertSelection([]);
      });

      it('should remove from selection the item that has been evicted by the limit when setting new limit', () => {
        logsCtrl.limit = 10;
        appendLogs(10);
        logsCtrl.select(2);

        logsCtrl.limit = 7;

        assertSelection([]);
      });

      it('should shift the selection indexes when the limit applies', () => {
        logsCtrl.limit = 10;
        appendLogs(10);
        logsCtrl.toggleSelection(2);
        logsCtrl.toggleSelection(3);
        logsCtrl.toggleSelection(6);

        appendLogs(2);

        assertSelection([0, 1, 4]);
      });

      it('should shift the selection indexes or drop selection when the limit applies', () => {
        logsCtrl.limit = 10;
        appendLogs(10);
        logsCtrl.toggleSelection(2);
        logsCtrl.toggleSelection(3);
        logsCtrl.toggleSelection(6);

        appendLogs(3);

        assertSelection([0, 3]);
      });
    });

    describe('with filter', () => {
      it('should keep selection when applying a new filter', () => {
        appendLogsWithMetadata();
        logsCtrl.toggleSelection(1);
        logsCtrl.toggleSelection(4);

        logsCtrl.filter = {
          metadata: [
            { metadata: 'A', value: 'a' },
            { metadata: 'A', value: 'aa' },
          ],
        };

        assertSelection([1, 2]);
      });

      it('should remove from selection the elements dropped when applying a new filter', () => {
        appendLogsWithMetadata();
        logsCtrl.toggleSelection(2);
        logsCtrl.toggleSelection(4);

        assertSelection([2, 4]);

        logsCtrl.filter = {
          metadata: [
            { metadata: 'A', value: 'a' },
            { metadata: 'A', value: 'aa' },
          ],
        };

        assertSelection([2]);
      });

      it('should remove from selection the element dropped by the filter when appending logs', () => {
        logsCtrl.limit = 24;
        logsCtrl.filter = {
          metadata: [
            { metadata: 'A', value: 'a' },
            { metadata: 'A', value: 'aa' },
          ],
        };
        appendLogsWithMetadata();
        logsCtrl.toggleSelection(1);
        logsCtrl.toggleSelection(2);

        const logs = generateLogs(2, 24, () => [{ name: 'A', value: 'a' }]);
        logsCtrl.append(logs);

        assertSelection([0]);
      });
    });
  });

  describe('clearSelection() method', () => {
    it('should clear selection', () => {
      appendLogs(10);
      logsCtrl.select(2);

      logsCtrl.clearSelection();

      assertSelection([]);
    });

    it('should request host update', () => {
      appendLogs(10);
      logsCtrl.select(2);
      spies.requestUpdate.reset();

      logsCtrl.clearSelection();

      expect(spies.requestUpdate.callCount).to.equal(1);
    });
  });

  describe('focus() method', () => {
    beforeEach(() => {
      appendLogs(10);
    });

    it('should notify host when first focusing log', () => {
      logsCtrl.focus(2);

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([2]);
    });

    it('should not notify host when focusing an already focused log', () => {
      logsCtrl.focus(2);
      spies.focusedLogChange.reset();

      logsCtrl.focus(2);

      expect(spies.focusedLogChange.callCount).to.equal(0);
    });

    it('should notify host when focusing another log', () => {
      logsCtrl.focus(2);
      spies.focusedLogChange.reset();

      logsCtrl.focus(4);

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([4]);
    });
  });

  describe('clearFocus() method', () => {
    beforeEach(() => {
      appendLogs(10);
    });

    it('should not notify host when no log was focused', () => {
      logsCtrl.clearFocus();

      expect(spies.focusedLogChange.callCount).to.equal(0);
    });

    it('should notify host when a log was focused', () => {
      logsCtrl.focus(2);
      spies.focusedLogChange.reset();

      logsCtrl.clearFocus();

      expect(spies.focusedLogChange.callCount).to.equal(1);
    });

    describe('when notifyHost is false', () => {
      it('should not notify host when a log was focused', () => {
        logsCtrl.focus(2);
        spies.focusedLogChange.reset();

        logsCtrl.clearFocus(false);

        expect(spies.focusedLogChange.callCount).to.equal(0);
      });
    });
  });

  describe('moveFocus() method', () => {
    beforeEach(() => {
      logsCtrl.limit = 10;
      appendLogs(10);
    });

    it('should focus on previous log when current focused log is not first', () => {
      logsCtrl.focus(2);
      spies.focusedLogChange.reset();

      logsCtrl.moveFocus('up');

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([1]);
    });

    it('should focus on next log when current focused log is not last', () => {
      logsCtrl.focus(2);
      spies.focusedLogChange.reset();

      logsCtrl.moveFocus('down');

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([3]);
    });

    it('should not move focused log when current focused log is first and direction is up', () => {
      logsCtrl.focus(0);
      spies.focusedLogChange.reset();

      logsCtrl.moveFocus('up');

      expect(spies.focusedLogChange.callCount).to.equal(0);
    });

    it('should not move focused log when current focused log is last and direction is down', () => {
      logsCtrl.focus(9);
      spies.focusedLogChange.reset();

      logsCtrl.moveFocus('down');

      expect(spies.focusedLogChange.callCount).to.equal(0);
    });

    it('should move focus to first log when current focused log is null and direction is down', () => {
      logsCtrl.moveFocus('down', { first: 4, last: 6 });

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([4]);
    });

    it('should move focus to last log when current focused log is null and direction is up', () => {
      logsCtrl.moveFocus('up', { first: 4, last: 6 });

      expect(spies.focusedLogChange.callCount).to.equal(1);
      expect(spies.focusedLogChange.lastCall.args).to.deep.equal([6]);
    });

    it('should not move focus when current focused log is null and direction is down and given range is null', () => {
      logsCtrl.moveFocus('down');

      expect(spies.focusedLogChange.callCount).to.equal(0);
    });

    it('should not move focus when current focused log is null and direction is up and given range is null', () => {
      logsCtrl.moveFocus('up');

      expect(spies.focusedLogChange.callCount).to.equal(0);
    });
  });
});

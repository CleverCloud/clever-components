import { chai, expect } from '@bundled-es-modules/chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { dispatchCustomEvent } from '../src/lib/events.js';

chai.use(chaiAsPromised);

/**
 * @param nodeName
 * @param eventNameToDispatch
 * @param eventNameToListen
 * @param detail
 * @return {Promise<CustomEvent>}
 */
function fireEvent (nodeName, eventNameToDispatch, eventNameToListen, detail) {
  return new Promise((resolve, reject) => {
    const htmlElement = document.createElement(nodeName);
    document.body.appendChild(htmlElement);
    htmlElement.addEventListener(eventNameToListen, resolve);
    dispatchCustomEvent(htmlElement, eventNameToDispatch, detail);
    reject(new Error('event not received'));
  });
}

describe('dispatchCustomEvent', () => {
  it('should dispatch custom event', async () => {
    await fireEvent('cc-component', 'myEvent', 'cc-component:myEvent', 'detail');
  });

  it('should not receive event when listening on wrong event', async () => {
    expect(fireEvent('cc-component', 'myEvent', 'wrongEvent', 'detail'))
      .to.eventually.be.rejectedWith('event not received');
  });

  it('should dispatch custom event on the right element', async () => {
    const event = await fireEvent('cc-component', 'myEvent', 'cc-component:myEvent', 'detail');
    expect(event.target?.nodeName?.toLowerCase()).to.equal('cc-component');
  });

  it('should dispatch custom event with the right type', async () => {
    const event = await fireEvent('cc-component', 'myEvent', 'cc-component:myEvent', 'detail');
    expect(event.type).to.equal('cc-component:myEvent');
  });

  it('should dispatch custom event with the given detail', async () => {
    const event = await fireEvent('cc-component', 'myEvent', 'cc-component:myEvent', 'detail');
    expect(event.detail).to.equal('detail');
  });

  it('should dispatch custom event with full event name', async () => {
    await fireEvent('cc-component', 'full:name', 'full:name', 'detail');
  });
});

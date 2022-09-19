import '../../src/components/cc-smart-container/cc-smart-container.js';
import { expect } from '@bundled-es-modules/chai';
import { stub as rawStub } from 'hanbi';
import { defineSmartComponentCore, updateRootContext } from '../../src/lib/smart-manager.js';

// hanbi should have a chained API IMO
function stub (fn) {
  const theStub = rawStub(fn);
  theStub.passThrough();
  return theStub;
}

function sleep (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function $ (root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

// Those are not unit tests for the smart-manager.
// They're more like e2e tests of how the smart-manager works with <cc-smart-container> in example situations.
describe('smart components', () => {

  const $main = document.querySelector('#main');
  let history;
  const onConnectStub = stub(() => history.push('onConnectStub'));
  const onContextUpdateStub = stub(() => history.push('onContextUpdateStub'));
  const onDisconnectStub = stub(() => history.push('onDisconnectStub'));
  let defineComponentController;
  let defineComponentSignal;

  beforeEach(() => {
    updateRootContext({});
    history = [];
    defineComponentController = new AbortController();
    defineComponentSignal = defineComponentController.signal;
    onConnectStub.reset();
    onContextUpdateStub.reset();
    onDisconnectStub.reset();
  });

  afterEach(() => {
    $main.innerHTML = '';
    if (defineComponentController != null) {
      defineComponentController.abort();
    }
  });

  describe('append element => onConnect then onContextUpdate', () => {

    it('defineComponent, append container (no context), append component ==> onConnect (no onContextUpdate) (1 level)', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.callCount).to.equal(0);
    });

    it('defineComponent, append container, append component ==> onConnect + onContextUpdate (1 level)', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
    });

    it('defineComponent, append container * 3 (ancestors), append component, update context * 3 ==> onConnect + multiple onContextUpdate (3 levels)', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
          two: { type: String },
          three: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container><cc-smart-container><cc-smart-container></cc-smart-container></cc-smart-container></cc-smart-container>`;
      const [$containerOne, $containerTwo, $containerThree] = $($main, 'cc-smart-container');
      $containerOne.context = { one: 'the-one' };
      $containerTwo.context = { two: 'the-two' };
      $containerThree.context = { three: 'the-three' };

      $containerThree.innerHTML = `<my-component></my-component>`;
      const [$component] = $($main, 'my-component');

      await sleep(25);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$containerThree, $component, {
        one: 'the-one',
        two: 'the-two',
        three: 'the-three',
      }]);

      $containerOne.context = { one: 'the-one-one' };

      await sleep(25);
      expect(onContextUpdateStub.getCall(1).args).to.deep.equal([$containerThree, $component, {
        one: 'the-one-one',
        two: 'the-two',
        three: 'the-three',
      }]);

      $containerTwo.context = { two: 'the-two-two' };

      await sleep(25);
      expect(onContextUpdateStub.getCall(2).args).to.deep.equal([$containerThree, $component, {
        one: 'the-one-one',
        two: 'the-two-two',
        three: 'the-three',
      }]);

      $containerThree.context = { three: 'the-three-three' };

      await sleep(25);
      expect(onContextUpdateStub.getCall(3).args).to.deep.equal([$containerThree, $component, {
        one: 'the-one-one',
        two: 'the-two-two',
        three: 'the-three-three',
      }]);

      $containerThree.context = { three: 'the-three-three', one: 'override' };

      await sleep(25);
      expect(onContextUpdateStub.getCall(4).args).to.deep.equal([$containerThree, $component, {
        one: 'override',
        two: 'the-two-two',
        three: 'the-three-three',
      }]);

      // Make sure onConnect happened only once
      expect(onConnectStub.callCount).to.equal(1);
    });

    it('defineComponent, append container, append component, update root context ==> onConnect + onContextUpdate (root context)', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          tokenA: { type: String },
          tokenB: { type: String },
          one: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($main, 'my-component');

      await sleep(25);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, {
        one: 'the-one',
      }]);

      updateRootContext({ tokenA: 'aaa' });

      await sleep(25);
      expect(onContextUpdateStub.getCall(1).args).to.deep.equal([$container, $component, {
        tokenA: 'aaa',
        one: 'the-one',
      }]);

      updateRootContext({ tokenB: 'bbb' });

      await sleep(25);
      expect(onContextUpdateStub.getCall(2).args).to.deep.equal([$container, $component, {
        tokenB: 'bbb',
        one: 'the-one',
      }]);

      updateRootContext({ tokenA: 'aaa', tokenB: 'bbb' });

      await sleep(25);
      expect(onContextUpdateStub.getCall(3).args).to.deep.equal([$container, $component, {
        tokenA: 'aaa',
        tokenB: 'bbb',
        one: 'the-one',
      }]);

      // Make sure onConnect happened only once
      expect(onConnectStub.callCount).to.equal(1);
    });

    // SPECIAL CASES vv

    it('append container, append component, defineComponent ==> onConnect + onContextUpdate (1 level)', async () => {

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($container, 'my-component');

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
    });

    it('defineComponent, append container, append component, remove component, append component ==> (onConnect + onContextUpdate) * 2', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);

      $container.removeChild($component);
      await sleep(25);
      $container.appendChild($component);

      await sleep(25);
      expect(onConnectStub.getCall(1).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(1).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
    });

    it('append container, append component, defineComponent ==> onConnect + onContextUpdate * 3 (ignore duplicated contexts)', async () => {

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component></my-component>`;

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      await sleep(25);
      $container.context = { one: 'the-one' };
      await sleep(25);
      $container.context = { one: 'the-one' };
      await sleep(25);
      $container.context = { one: 'the-one' };

      await sleep(25);
      expect(onContextUpdateStub.callCount).to.equal(1);
    });

    it('append container, append component, defineComponent ==> onConnect + onContextUpdate * 3 (ignore unlisted params)', async () => {

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one', foo: 'foo', bar: 'bar' };

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($main, 'my-component');

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      await sleep(25);
      $container.context = { one: 'the-one', foobar: 'foobar' };
      await sleep(25);
      $container.context = { one: 'the-one', barfoo: 'barfoo' };

      await sleep(25);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
      expect(onContextUpdateStub.callCount).to.equal(1);
    });
  });

  describe('remove element => onDisconnect', () => {

    it('defineComponent, append container, append component, remove component ==> onDisconnect', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      $container.removeChild($component);

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(1);
    });

    it('defineComponent, append container, append component, remove container ==> onDisconnect', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');

      $container.innerHTML = `<my-component></my-component>`;

      await sleep(25);
      $main.removeChild($container);

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(1);
    });
  });

  describe('switch component from container to container => onDisconnect, then onConnect then onContextUpdate', () => {

    it('defineComponent, append container * 3 (ancestors), append/adopt component * 3 ==> (onConnect + onContextUpdate + disconnect) * 3', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
          two: { type: String },
          three: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container><cc-smart-container><cc-smart-container></cc-smart-container></cc-smart-container></cc-smart-container>`;
      const [$containerOne, $containerTwo, $containerThree] = $($main, 'cc-smart-container');
      $containerOne.id = 'one';
      $containerOne.context = { one: 'the-one' };
      $containerTwo.id = 'two';
      $containerTwo.context = { two: 'the-two' };
      $containerThree.id = 'three';
      $containerThree.context = { three: 'the-three' };

      $containerThree.innerHTML = `<my-component></my-component>`;
      const [$component] = $($containerThree, 'my-component');
      $component.id = 'cmp';

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$containerThree, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$containerThree, $component, {
        one: 'the-one',
        two: 'the-two',
        three: 'the-three',
      }]);

      $containerTwo.appendChild($component);

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(1);
      expect(onConnectStub.getCall(1).args).to.deep.equal([$containerTwo, $component]);
      expect(onContextUpdateStub.getCall(1).args).to.deep.equal([$containerTwo, $component, {
        one: 'the-one',
        two: 'the-two',
      }]);

      $containerOne.appendChild($component);

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(2);
      expect(onConnectStub.getCall(2).args).to.deep.equal([$containerOne, $component]);
      expect(onContextUpdateStub.getCall(2).args).to.deep.equal([$containerOne, $component, { one: 'the-one' }]);

      expect(history).to.deep.equal([
        'onConnectStub',
        'onContextUpdateStub',
        'onDisconnectStub',
        'onConnectStub',
        'onContextUpdateStub',
        'onDisconnectStub',
        'onConnectStub',
        'onContextUpdateStub',
      ]);
    });

    it('defineComponent, append container * 3 (siblings), append/adopt component * 3, remove component ==> (onConnect + onContextUpdate + disconnect) * 3', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        params: {
          one: { type: String },
          two: { type: String },
          three: { type: String },
        },
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container><cc-smart-container></cc-smart-container><cc-smart-container></cc-smart-container>`;
      const [$containerOne, $containerTwo, $containerThree] = $($main, 'cc-smart-container');
      $containerOne.context = { one: 'the-one' };
      $containerTwo.context = { two: 'the-two' };
      $containerThree.context = { three: 'the-three' };

      $containerThree.innerHTML = `<my-component></my-component>`;
      const [$component] = $($containerThree, 'my-component');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$containerThree, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$containerThree, $component, { three: 'the-three' }]);

      $containerTwo.appendChild($component);

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(1);
      expect(onConnectStub.getCall(1).args).to.deep.equal([$containerTwo, $component]);
      expect(onContextUpdateStub.getCall(1).args).to.deep.equal([$containerTwo, $component, { two: 'the-two' }]);

      $containerOne.appendChild($component);

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(2);
      expect(onConnectStub.getCall(2).args).to.deep.equal([$containerOne, $component]);
      expect(onContextUpdateStub.getCall(2).args).to.deep.equal([$containerOne, $component, { one: 'the-one' }]);

      expect(history).to.deep.equal([
        'onConnectStub',
        'onContextUpdateStub',
        'onDisconnectStub',
        'onConnectStub',
        'onContextUpdateStub',
        'onDisconnectStub',
        'onConnectStub',
        'onContextUpdateStub',
      ]);
    });
  });

  describe('update selector', () => {

    it('defineComponent, append container, append component, match selector ==> onConnect + onContextUpdate', async () => {

      defineSmartComponentCore({
        selector: 'my-component.foo',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      expect(onConnectStub.callCount).to.equal(0);
      expect(onContextUpdateStub.callCount).to.equal(0);

      $component.classList.add('foo');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
    });

    it('defineComponent, append container, append component, unmatch selector ==> onDisconnect', async () => {

      defineSmartComponentCore({
        selector: 'my-component.foo',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component class="foo"></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);

      $component.classList.remove('foo');

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(1);
    });

    it('defineComponent * 2, append container, append component, change selector, remove component ==> (onConnect + onContextUpdate + disconnect) * 2', async () => {

      const onConnectStubBar = stub(() => history.push('onConnectStubBar'));
      const onContextUpdateStubBar = stub(() => history.push('onContextUpdateStubBar'));
      const onDisconnectStubBar = stub(() => history.push('onDisconnectStubBar'));

      defineSmartComponentCore({
        selector: 'my-component.foo',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      defineSmartComponentCore({
        selector: 'my-component.bar',
        onConnect: onConnectStubBar.handler,
        onContextUpdate: onContextUpdateStubBar.handler,
        onDisconnect: onDisconnectStubBar.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');
      $container.context = { one: 'the-one' };

      $container.innerHTML = `<my-component class="foo"></my-component>`;
      const [$component] = $($container, 'my-component');

      await sleep(25);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
      expect(onDisconnectStub.callCount).to.equal(0);
      expect(onConnectStubBar.callCount).to.equal(0);
      expect(onContextUpdateStubBar.callCount).to.equal(0);
      expect(onDisconnectStubBar.callCount).to.equal(0);

      $component.setAttribute('class', 'bar');

      await sleep(25);
      expect(onConnectStub.callCount).to.equal(1);
      expect(onContextUpdateStub.callCount).to.equal(1);
      expect(onDisconnectStub.callCount).to.equal(1);
      expect(onConnectStub.getCall(0).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStubBar.getCall(0).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
      expect(onDisconnectStubBar.callCount).to.equal(0);

      $component.setAttribute('class', 'foo');

      await sleep(25);
      expect(onConnectStub.getCall(1).args).to.deep.equal([$container, $component]);
      expect(onContextUpdateStub.getCall(1).args).to.deep.equal([$container, $component, { one: 'the-one' }]);
      expect(onDisconnectStub.callCount).to.equal(1);
      expect(onConnectStubBar.callCount).to.equal(1);
      expect(onContextUpdateStubBar.callCount).to.equal(1);
      expect(onDisconnectStubBar.callCount).to.equal(1);

      // Make sure a component is disconnected before being connected again
      expect(history).to.deep.equal([
        'onConnectStub',
        'onContextUpdateStub',
        'onDisconnectStub',
        'onConnectStubBar',
        'onContextUpdateStubBar',
        'onDisconnectStubBar',
        'onConnectStub',
        'onContextUpdateStub',
      ]);
    });
  });

  describe('abort defineComponent => onDisconnect', () => {

    it('defineComponent, append container, append component, abort defineComponent ==> onDisconnect', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');

      $container.innerHTML = `<my-component></my-component>`;

      await sleep(25);
      defineComponentController.abort();

      await sleep(25);
      expect(onDisconnectStub.callCount).to.equal(1);
    });

    it('defineComponent, append container, abort defineComponent, append component ==> nothing', async () => {

      defineSmartComponentCore({
        selector: 'my-component',
        onConnect: onConnectStub.handler,
        onContextUpdate: onContextUpdateStub.handler,
        onDisconnect: onDisconnectStub.handler,
      }, defineComponentSignal);

      $main.innerHTML = `<cc-smart-container></cc-smart-container>`;
      const [$container] = $($main, 'cc-smart-container');

      await sleep(25);
      defineComponentController.abort();

      $container.innerHTML = `<my-component></my-component>`;

      await sleep(25);
      expect(onConnectStub.callCount).to.equal(0);
      expect(onContextUpdateStub.callCount).to.equal(0);
      expect(onDisconnectStub.callCount).to.equal(0);
    });
  });
});

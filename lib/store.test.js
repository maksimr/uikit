import { cursor, Store } from './store';
import { produce } from 'immer';

describe('Store', function() {
  /**
   * @type {Store<any>}
   */
  let store;
  beforeEach(function() {
    store = new Store({}, (...args) => produce(...args));
  });

  it('should create a store', function() {
    expect(store).toBeDefined();
  });

  it('should change store state', function() {
    store.swap(() => ({ foo: 'foo' }));
    expect(store.value).toEqual({ foo: 'foo' });
  });

  it('should pass additional parameters to swap', function() {
    store.swap((state, value) => ({ value }), 'foo');
    expect(store.value).toEqual({ value: 'foo' });
  });

  it('should not invoke listener immediately by default', function() {
    const onStateChange = jest.fn();
    store.watch(onStateChange);
    expect(onStateChange).not.toHaveBeenCalled();
  });

  it('should call listener when we attach it to the store immediately', function() {
    const onStateChange = jest.fn();
    store.watch(onStateChange, true);
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('should add watcher', function() {
    const onStateChange = jest.fn();
    store.watch(onStateChange);
    store.swap(() => ({}));
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('should remove watcher', function() {
    const onStateChange = jest.fn();
    const removeListener = store.watch(onStateChange);
    removeListener();
    store.swap(() => ({}));
    expect(onStateChange).not.toHaveBeenCalled();
  });

  it('should not call listeners which was added during calling process', () => {
    const onStateChangeB = jest.fn();
    const onStateChangeA = jest.fn((state) => {
      if (state === 1) {
        store.watch(onStateChangeB);
      }
    });

    store.watch(onStateChangeA);
    store.swap(() => (1));

    expect(onStateChangeA).toHaveBeenCalledTimes(1);
    expect(onStateChangeB).not.toHaveBeenCalled();

    store.swap(() => (2));
    expect(onStateChangeB).toHaveBeenCalledTimes(1);
  });

  it('should call listeners which go after removed listener', function() {
    const onStateChangeBeforeRemovedListener = jest.fn();
    const onStateChangeAfterRemovedListener = jest.fn();

    store.watch(onStateChangeBeforeRemovedListener);
    const removeListener = store.watch(() => removeListener());
    store.watch(onStateChangeAfterRemovedListener);

    store.swap(() => ({}));
    expect(onStateChangeBeforeRemovedListener).toHaveBeenCalledTimes(1);
    expect(onStateChangeAfterRemovedListener).toHaveBeenCalledTimes(1);
  });

  it('should correctly handle the case when user trigger swap in listener and remove other listeners in nested change', function() {
    const onStateChangeBeforeRemovedListener = jest.fn();
    const onStateChangeAfterRemovedListener = jest.fn();
    const onStateChangeRemovedListenerAndTriggerSwap = jest.fn((state) => {
      const NESTED_SWAP_STATE = 2;
      if (state === NESTED_SWAP_STATE) {
        removeListener();
      } else {
        store.swap(() => (NESTED_SWAP_STATE));
      }
    });

    store.watch(onStateChangeBeforeRemovedListener);
    const removeListener = store.watch(onStateChangeRemovedListenerAndTriggerSwap);
    store.watch(onStateChangeAfterRemovedListener);

    store.swap(() => (1));
    expect(onStateChangeBeforeRemovedListener).toHaveBeenCalledTimes(2);
    expect(onStateChangeAfterRemovedListener).toHaveBeenCalledTimes(2);
  });

  describe('cursor', function() {
    it('should create cursor on the store and trigger watcher only if cursor state has changed', function() {
      store.swap(() => ({ foo: {} }));
      const onStateChange = jest.fn();
      const { store: fooStore } = cursor(store, (state) => state?.foo);
      fooStore.watch(onStateChange);

      store.swap((state) => ({ ...state, bar: {} }));
      expect(onStateChange).not.toHaveBeenCalled();

      store.swap((state) => ({ ...state, foo: {} }));
      expect(onStateChange).toHaveBeenCalled();
    })

    it('should change root store if we change cursor content', function() {
      store.swap(() => ({ foo: {} }));
      const onStateChange = jest.fn();
      const { store: fooStore } = cursor(store, (state) => state?.foo);
      store.watch(onStateChange);

      fooStore.swap((state) => {
        state.value = true;
      });
      expect(onStateChange).toHaveBeenCalled();
      expect(store.value?.foo?.value).toEqual(true);
    })

    it('should remove cursor', function() {
      store.swap(() => ({ foo: {} }));
      const onStateChange = jest.fn();
      const { store: fooStore, destroy } = cursor(store, (state) => state?.foo);
      fooStore.watch(onStateChange);
      destroy();

      store.swap((state) => ({ ...state, bar: {} }));
      expect(onStateChange).not.toHaveBeenCalled();

      store.swap((state) => ({ ...state, foo: {} }));
      expect(onStateChange).not.toHaveBeenCalled();
    })
  });
});
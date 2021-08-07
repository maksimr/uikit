import { Store } from './Store';

describe('Store', function() {
  /**
   * @type {Store<{}>}
   */
  let store;
  beforeEach(function() {
    store = new Store({}, (state, fn) => fn(state) || state);
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

  it('should call listener when we attach it to the store', function() {
    const onStateChange = jest.fn();
    store.watch(onStateChange);
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('should add listener on store change', function() {
    const onStateChange = jest.fn();
    store.watch(onStateChange);
    store.swap(() => ({}));
    expect(onStateChange).toHaveBeenCalledTimes(2);
  });

  it('should remove listener on store change', function() {
    const onStateChange = jest.fn();
    const removeListener = store.watch(onStateChange);
    removeListener();
    store.swap(() => ({}));
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });
});
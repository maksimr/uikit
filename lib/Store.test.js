import { Store } from './Store';

describe('Store', function() {
  let store;
  beforeEach(function() {
    store = new Store({}, reducer);
  });

  it('should create a store', function() {
    expect(store).toBeDefined();
  });

  it('should call listener when we attach it to the store', function() {
    const onStateChange = jest.fn();
    store.addListener(onStateChange);
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('should add listener on store change', function() {
    const onStateChange = jest.fn();
    store.addListener(onStateChange);
    store.swap(() => {});
    expect(onStateChange).toHaveBeenCalledTimes(2);
  });

  it('should remove listener on store change', function() {
    const onStateChange = jest.fn();
    const removeListener = store.addListener(onStateChange);
    removeListener();
    store.swap(() => {});
    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  function reducer(state, fn) {
    return fn(state);
  }
});
/**
 * @template T
 * @typedef {function(T,...any=):(T|void)} Producer
 */

/**
 * @template T
 * @typedef {function(T,(state: T) => ReturnType<Producer<T>>):T} Reducer
 */

/**
 * @template T
 * @typedef {function(T, T):*} StoreWatcher
 */

/**
 * @template T
 * @typedef {{watcher: StoreWatcher<T>|null}} StoreListener
 */

/**
 * @template T
 */
export class Store {
  /**
   * @param {T} initValue
   * @param {Reducer<T>} reducer
   */
  constructor(initValue, reducer) {
    this.value = initValue;
    this.reducer = reducer;
    this.swap = this.swap.bind(this);
    this.watch = this.watch.bind(this);

    /**
     * @private
     * @type {StoreListener<T>[]}
     */
    this.listeners = [];
  }

  /**
   * @param {Producer<T>} fn
   * @param  {...any} args
   * @returns {T}
   */
  swap(fn, ...args) {
    const prevValue = this.value;
    this.value = this.reducer(prevValue, (state) => fn(state, ...args));

    if (this.value !== prevValue) {
      Array.from(this.listeners)
        .forEach((listener) => listener?.watcher?.(this.value, prevValue));
    }

    return this.value;
  }

  /**
   * @param {StoreWatcher<T>|null} watcher
   * @param {Boolean} [invokeImmediately]
   * @returns {function():void}
   */
  watch(watcher, invokeImmediately = true) {
    const listener = /**@type {StoreListener<T>}*/({ watcher });
    this.listeners.push(listener);
    if (invokeImmediately) {
      listener?.watcher?.(this.value, this.value);
    }
    return () => {
      watcher = listener.watcher = null;
      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    };
  }
}
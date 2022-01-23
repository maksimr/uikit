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
    /**
     * @private
     * @type {typeof this.listeners | null}
     */
    this.processingListeners = null;
  }

  /**
   * @description Swaps the value of store
   * @param {Producer<T>} fn
   * @param  {...any} args Additional arguments which would be passed to producer function
   * @returns {T}
   */
  swap(fn, ...args) {
    const prevValue = this.value;
    this.value = this.reducer(prevValue, (state) => fn(state, ...args));

    if (this.value !== prevValue) {
      const prevProcessingListenersValue = this.processingListeners;
      this.processingListeners = this.listeners;
      this.processingListeners.forEach((listener) => listener?.watcher?.(this.value, prevValue));
      this.processingListeners = prevProcessingListenersValue;
    }

    return this.value;
  }

  /**
   * @description The method sets up a function that will be called whenever the state is changed
   * @param {StoreWatcher<T>|null} watcher
   * @param {Boolean} [invokeImmediately] Should be watcher function called immediately after attach. By default false
   * @returns {function():void} Remove watcher function
   */
  watch(watcher, invokeImmediately = false) {
    const listener = /**@type {StoreListener<T>}*/({ watcher });
    this.listeners.push(listener);
    if (invokeImmediately) {
      listener?.watcher?.(this.value, this.value);
    }
    return this.deregister.bind(this, listener);
  }

  /**
   * @private
   * @param {StoreListener<T>} listener 
   */
  deregister(listener) {
    listener.watcher = null;
    const listeners = this.getListenersForMutation();
    listeners.splice(listeners.indexOf(listener), 1);
  }

  /**
   * @private
   * @returns {StoreListener<T>[]}
   */
  getListenersForMutation() {
    if (this.processingListeners === this.listeners) {
      this.listeners = Array.from(this.listeners);
    }
    return this.listeners;
  }
}
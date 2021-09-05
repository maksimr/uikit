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
 * @typedef {function(T, T):*} StoreListener
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
    /**@type {(StoreListener<T>|null)[]}*/
    this.listeners = [];
    this.swap = this.swap.bind(this);
    this.watch = this.watch.bind(this);

    /** @private */
    this._invokeListenersInProgress = 0;
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
      this._invokeListenersInProgress += 1;
      this.listeners.forEach((it) => it?.(this.value, prevValue));
      this._invokeListenersInProgress -= 1;
      // Listener can trigger store swap so this nested
      // swap run all attached listeners again.
      // So we should run listeners cleanup only after
      // all listeners processing are finished
      if (this._invokeListenersInProgress === 0) {
        let index = this.listeners.length - 1;
        while (index >= 0) {
          if (this.listeners[index] === null) {
            this.listeners.splice(index, 1);
          }
          index -= 1;
        }
      }
    }

    return this.value;
  }

  /**
   * @param {StoreListener<T>} listener
   * @param {Boolean} [invokeImmediately]
   * @returns {function():void}
   */
  watch(listener, invokeImmediately = true) {
    this.listeners.push(listener);
    if (invokeImmediately) {
      listener(this.value, this.value);
    }
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        // If we in the process of triggering
        // listeners than just replace it on null
        // to not ruine order in listeners array which
        // is mutable
        if (this._invokeListenersInProgress) {
          this.listeners[index] = null;
          return;
        }
        this.listeners.splice(index, 1);
      }
    };
  }
}